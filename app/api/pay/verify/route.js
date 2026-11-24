import { NextResponse } from "next/server";
import { payConfigured, sb, validSignature } from "@/lib/payServer";

export const runtime = "nodejs";

// भुगतान के बाद Razorpay का signature जाँचकर रिकॉर्ड "paid" करें
export async function POST(req) {
  if (!payConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const orderId = String(b.razorpay_order_id || "");
  const paymentId = String(b.razorpay_payment_id || "");

  if (!validSignature(orderId, paymentId, b.razorpay_signature)) {
    return NextResponse.json({ ok: false, error: "signature" }, { status: 400 });
  }

  try {
    const rows = await sb(`pp_payments?rz_order_id=eq.${encodeURIComponent(orderId)}&select=enquiry_no,status`);
    const pay = rows?.[0];
    if (!pay) return NextResponse.json({ ok: false }, { status: 404 });

    if (pay.status !== "paid") {
      await sb(`pp_payments?rz_order_id=eq.${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: { status: "paid", rz_payment_id: paymentId, paid_at: new Date().toISOString() },
      });
      await sb(`pp_enquiries?enquiry_no=eq.${encodeURIComponent(pay.enquiry_no)}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: { status: "paid" },
      });
    }
    return NextResponse.json({ ok: true, enquiryNo: pay.enquiry_no });
  } catch (err) {
    console.error("pay/verify", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
