import { NextResponse } from "next/server";
import { PROGRAMS } from "@/data/margdarshan";
import { payConfigured, rzKeyId, sb, createRazorpayOrder } from "@/lib/payServer";

export const runtime = "nodejs";

// भुगतान शुरू करें: कीमत हमेशा server पर data/margdarshan.js से ली जाती है, browser से नहीं।
export async function POST(req) {
  if (!payConfigured()) {
    return NextResponse.json({ error: "Online भुगतान अभी चालू नहीं है। हमारी टीम आपसे संपर्क करेगी।" }, { status: 503 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "गलत अनुरोध" }, { status: 400 });
  }
  const enquiryNo = String(body.enquiryNo || "").toUpperCase().replace(/[^A-Z0-9-]/g, "");

  try {
    // आवेदन असली है? कौन-सा कार्यक्रम? पहले से भुगतान तो नहीं हुआ?
    const rows = await sb(`pp_enquiries?enquiry_no=eq.${enquiryNo}&select=enquiry_no,program,status,name`);
    const enq = rows?.[0];
    if (!enq) return NextResponse.json({ error: "आवेदन नहीं मिला।" }, { status: 404 });
    if (enq.status === "paid") return NextResponse.json({ error: "इस आवेदन का भुगतान पहले ही हो चुका है।" }, { status: 409 });

    const prog = PROGRAMS.find((p) => p.key === enq.program);
    if (!prog || prog.free || !prog.price) {
      return NextResponse.json({ error: "इस कार्यक्रम का शुल्क बातचीत के बाद तय होगा।" }, { status: 400 });
    }

    const amountPaise = Math.round(Number(prog.price) * 100);
    const order = await createRazorpayOrder({
      amountPaise,
      receipt: enquiryNo,
      notes: { enquiry_no: enquiryNo, program: prog.key },
    });

    await sb("pp_payments", {
      method: "POST",
      prefer: "return=minimal",
      body: { enquiry_no: enquiryNo, program: prog.key, amount_paise: amountPaise, rz_order_id: order.id },
    });

    return NextResponse.json({ orderId: order.id, amount: amountPaise, keyId: rzKeyId(), title: prog.title });
  } catch (err) {
    console.error("pay/order", err);
    return NextResponse.json({ error: "भुगतान शुरू नहीं हो पाया। थोड़ी देर बाद कोशिश करें।" }, { status: 500 });
  }
}
