// केवल SERVER पर चलने वाला code (API routes) — यहाँ की keys कभी browser तक नहीं जातीं।
// Vercel → Project → Settings → Environment Variables में ये 3 डालें:
//   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, SUPABASE_SERVICE_ROLE_KEY

import crypto from "crypto";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RZ_ID = process.env.RAZORPAY_KEY_ID;
const RZ_SECRET = process.env.RAZORPAY_KEY_SECRET;

export const payConfigured = () => Boolean(SB_URL && SB_SERVICE && RZ_ID && RZ_SECRET);
export const rzKeyId = () => RZ_ID;

// Supabase REST (service role — RLS को पार करता है, इसलिए केवल server पर)
export async function sb(path, { method = "GET", body, prefer } = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SB_SERVICE,
      Authorization: `Bearer ${SB_SERVICE}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`supabase ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

export async function createRazorpayOrder({ amountPaise, receipt, notes }) {
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${RZ_ID}:${RZ_SECRET}`).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`razorpay: ${JSON.stringify(data)}`);
  return data;
}

// Razorpay का signature जाँचें: HMAC_SHA256(order_id + "|" + payment_id, secret)
export function validSignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature) return false;
  const expected = crypto.createHmac("sha256", RZ_SECRET).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
