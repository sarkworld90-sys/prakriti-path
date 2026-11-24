import { NextResponse } from "next/server";
import crypto from "crypto";
import { sb } from "@/lib/payServer";

export const runtime = "nodejs";

// Razorpay Webhook — अगर भुगतान के बाद ग्राहक का browser बंद हो जाए, तब भी भुगतान दर्ज हो।
// Razorpay Dashboard → Settings → Webhooks → URL: https://prakritipath.org/api/pay/webhook
// Event: payment.captured   Secret: वही जो Vercel में RAZORPAY_WEBHOOK_SECRET रखा है
export async function POST(req) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const evt = JSON.parse(raw);
    if (evt.event === "payment.captured") {
      const p = evt.payload?.payment?.entity;
      const orderId = p?.order_id;
      if (orderId) {
        const rows = await sb(`pp_payments?rz_order_id=eq.${encodeURIComponent(orderId)}&select=enquiry_no,status`);
        const pay = rows?.[0];
        if (pay && pay.status !== "paid") {
          await sb(`pp_payments?rz_order_id=eq.${encodeURIComponent(orderId)}`, {
            method: "PATCH",
            prefer: "return=minimal",
            body: { status: "paid", rz_payment_id: p.id, paid_at: new Date().toISOString() },
          });
          await sb(`pp_enquiries?enquiry_no=eq.${encodeURIComponent(pay.enquiry_no)}`, {
            method: "PATCH",
            prefer: "return=minimal",
            body: { status: "paid" },
          });
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("pay/webhook", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
