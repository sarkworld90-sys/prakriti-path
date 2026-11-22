"use client";

import { useState } from "react";
import { joinOptions } from "@/data/content";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  city: "",
  ageGroup: "",
  gender: "",
  interests: [],
  message: "",
  consent: false,
};

export default function FoundingForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (status === "error") setStatus("idle");
  }

  function toggleInterest(key) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(key) ? f.interests.filter((k) => k !== key) : [...f.interests, key],
    }));
    if (status === "error") setStatus("idle");
  }

  function fail(text) {
    setStatus("error");
    setMessage(text);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const phone = form.phone.replace(/\D/g, "").slice(-10);

    if (form.name.trim().length < 2) return fail("कृपया अपना पूरा नाम लिखें।");
    if (!/^[6-9]\d{9}$/.test(phone)) return fail("कृपया सही 10 अंकों का मोबाइल नंबर लिखें।");
    if (!form.ageGroup) return fail("कृपया अपना आयु वर्ग चुनें।");
    if (form.interests.length === 0) return fail("कृपया कम से कम एक भाव चुनें — आप किस भाव से जुड़ना चाहते हैं।");
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
          age_group: form.ageGroup,
          gender: form.gender || null,
          // Supabase में पढ़ने में आसानी के लिए हिंदी नाम सहेजें
          interests: form.interests.map((k) => joinOptions.interests.find((i) => i.key === k)?.label || k),
          message: form.message.trim() || null,
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
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="वैकल्पिक" />
        </label>
        <label>
          <span>शहर</span>
          <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="वैकल्पिक" />
        </label>
      </div>

      {/* आयु वर्ग */}
      <fieldset className="join-field">
        <legend>आयु वर्ग *</legend>
        <div className="chip-row">
          {joinOptions.ageGroups.map((a) => (
            <button
              type="button"
              key={a}
              className={`chip ${form.ageGroup === a ? "chip-on" : ""}`}
              onClick={() => update("ageGroup", a)}
              aria-pressed={form.ageGroup === a}
            >
              {a} वर्ष
            </button>
          ))}
        </div>
      </fieldset>

      {/* लिंग */}
      <fieldset className="join-field">
        <legend>लिंग</legend>
        <div className="chip-row">
          {joinOptions.genders.map((g) => (
            <button
              type="button"
              key={g}
              className={`chip ${form.gender === g ? "chip-on" : ""}`}
              onClick={() => update("gender", form.gender === g ? "" : g)}
              aria-pressed={form.gender === g}
            >
              {g}
            </button>
          ))}
        </div>
      </fieldset>

      {/* जुड़ने का भाव */}
      <fieldset className="join-field">
        <legend>
          आप किस भाव से प्रकृति पथ से जुड़ना चाहते हैं? * <small>(एक या अधिक चुनें)</small>
        </legend>
        <div className="interest-grid">
          {joinOptions.interests.map((i) => {
            const on = form.interests.includes(i.key);
            return (
              <button
                type="button"
                key={i.key}
                className={`interest ${on ? "interest-on" : ""}`}
                onClick={() => toggleInterest(i.key)}
                aria-pressed={on}
              >
                <span className="interest-check">{on ? "✓" : ""}</span>
                <span className="interest-icon">{i.icon}</span>
                <span>{i.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* अपेक्षा */}
      <label className="join-message">
        <span>आप प्रकृति पथ से क्या अपेक्षा रखते हैं?</span>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="वैकल्पिक — दो-चार पंक्तियों में अपने मन की बात लिखें"
          maxLength={1000}
        />
      </label>

      <label className="join-consent">
        <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} />
        <span>
          मैं सहमत हूँ कि प्रकृति पथ मेरी जानकारी केवल इस कार्यक्रम के बारे में संपर्क करने के लिए उपयोग करे। मेरी
          जानकारी किसी और को नहीं दी जाएगी। (<a href="/privacy">गोपनीयता नीति</a>)
        </span>
      </label>

      {status === "error" && <p className="join-error">{message}</p>}

      <button className="btn btn-haldi" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "जोड़ रहे हैं…" : "Founding Member बनें →"}
      </button>
    </form>
  );
}
