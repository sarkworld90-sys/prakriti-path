"use client";

import { useState } from "react";

// Razorpay Checkout — UPI, कार्ड, नेट-बैंकिंग
function loadCheckout() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function PayButton({ enquiryNo, program, name = "", phone = "" }) {
  const [status, setStatus] = useState("idle"); // idle | loading | paid | error
  const [msg, setMsg] = useState("");

  async function pay() {
    setStatus("loading");
    setMsg("");
    try {
      if (!(await loadCheckout())) throw new Error("भुगतान खिड़की नहीं खुल पाई। इंटरनेट जाँचें।");

      const res = await fetch("/api/pay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiryNo, program }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "भुगतान शुरू नहीं हो पाया।");

      const rz = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: "INR",
        name: "Prakriti Path",
        description: `${order.title} · ${enquiryNo}`,
        prefill: { name, contact: phone ? `+91${phone}` : undefined },
        notes: { enquiry_no: enquiryNo },
        theme: { color: "#2f5d46" },
        handler: async (resp) => {
          const v = await fetch("/api/pay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          if (v.ok) {
            setStatus("paid");
            try {
              window.fbq && window.fbq("track", "Purchase", { value: order.amount / 100, currency: "INR" }, { eventID: order.orderId });
            } catch {}
          }
          else {
            setStatus("error");
            setMsg("भुगतान हुआ है पर पुष्टि में देर है — हमारी टीम जाँचकर आपसे संपर्क करेगी।");
          }
        },
        modal: { ondismiss: () => setStatus((s) => (s === "paid" ? s : "idle")) },
      });
      rz.on("payment.failed", () => {
        setStatus("error");
        setMsg("भुगतान नहीं हो पाया। कोई पैसा कटा हो तो 5–7 दिन में अपने-आप वापस आ जाएगा। आप फिर से कोशिश कर सकते हैं।");
      });
      rz.open();
    } catch (err) {
      setStatus("error");
      setMsg(err.message);
    }
  }

  if (status === "paid") {
    return (
      <p className="md-paid">
        ✅ भुगतान सफल! आपकी जगह पक्की है। हमारी टीम जल्द ही समय तय करने के लिए संपर्क करेगी।
      </p>
    );
  }

  return (
    <div className="md-pay">
      <button type="button" className="md-btn md-btn-primary" onClick={pay} disabled={status === "loading"}>
        {status === "loading" ? "खोल रहे हैं…" : "अभी online भुगतान करें 🔒"}
      </button>
      <span className="md-small">UPI · कार्ड · नेट-बैंकिंग — Razorpay द्वारा सुरक्षित</span>
      {msg && <p className="md-error">{msg}</p>}
    </div>
  );
}
