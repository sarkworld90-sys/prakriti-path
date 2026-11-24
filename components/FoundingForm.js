"use client";

import { useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function FoundingForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", consent: false });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const phone = form.phone.replace(/\D/g, "").slice(-10);

    if (form.name.trim().length < 2) return fail("कृपया अपना पूरा नाम लिखें।");
    if (!/^[6-9]\d{9}$/.test(phone)) return fail("कृपया सही 10 अंकों का मोबाइल नंबर लिखें।");
    if (!form.consent) return fail("आगे बढ़ने के लिए सहमति वाले बॉक्स पर टिक करें।");
    if (!SUPABASE_URL || !SUPABASE_KEY) return fail("Form अभी Database से नहीं जुड़ा है (.env.local देखें)।");

    setStatus("sending");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/founding_members`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone,
          email: form.email.trim() || null,
          city: form.city.trim() || null,
          consent: true,
        }),
      });

      if (res.status === 409) {
        setStatus("done");
        setMessage("आप पहले से प्रकृति पथ से जुड़े हुए हैं। 🌱");
        return;
      }
      if (!res.ok) throw new Error(await res.text());

      setStatus("done");
      setMessage(`धन्यवाद, ${form.name.trim()}! आप प्रकृति पथ के Founding Member बन गए हैं। 🌱`);
    } catch (err) {
      console.error(err);
      fail("कुछ गड़बड़ हुई। कृपया थोड़ी देर बाद फिर कोशिश करें।");
    }
  }

  function fail(text) {
    setStatus("error");
    setMessage(text);
  }

  if (status === "done") {
    return (
      <div className="join-card join-done">
        <div className="join-done-icon">🌱</div>
        <h3 className="serif">{message}</h3>
        <p>जैसे ही 30 दिनों की यात्रा शुरू होगी, हम आपसे संपर्क करेंगे।</p>
      </div>
    );
  }

  return (
    <form className="join-card" onSubmit={handleSubmit} noValidate>
      <div className="join-grid">
        <label>
          <span>नाम *</span>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="आपका पूरा नाम" />
        </label>
        <label>
          <span>मोबाइल नंबर *</span>
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="10 अंकों का नंबर"
            inputMode="numeric"
            maxLength={14}
          />
        </label>
        <label>
          <span>ईमेल</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="वैकल्पिक"
          />
        </label>
        <label>
          <span>शहर</span>
          <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="वैकल्पिक" />
        </label>
      </div>

      <label className="join-consent">
        <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} />
        <span>
          मैं सहमत हूँ कि प्रकृति पथ मेरी जानकारी केवल इस कार्यक्रम के बारे में संपर्क करने के लिए उपयोग करे। मेरी
          जानकारी किसी और को नहीं दी जाएगी।
        </span>
      </label>

      {status === "error" && <p className="join-error">{message}</p>}

      <button className="btn btn-haldi" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "जोड़ रहे हैं…" : "Founding Member बनें →"}
      </button>
    </form>
  );
}
