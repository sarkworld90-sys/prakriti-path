"use client";

import { useEffect, useState } from "react";
import { ORG_TYPES, SERVICES, PURPOSES, drishta } from "@/data/drishta";
import { rpc, cleanPhone, validPhone, errorText, isConfigured } from "@/lib/oneBowl";
import { captureUtm, trackLead, trackEvent } from "@/lib/track";

const EMPTY = { name: "", org: "", phone: "", email: "", orgType: "", purpose: "", service: "", details: "", consent: false };

export default function DrishtaForm() {
  const [f, setF] = useState(EMPTY);
  const [utm, setUtm] = useState({});
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    setUtm(captureUtm());
    // पेज के किसी बटन से आए हों (जैसे "मूल्यांकन करवाएँ") तो उद्देश्य पहले से चुनें
    const onPick = (e) => setF((x) => ({ ...x, purpose: e.detail }));
    window.addEventListener("drishta:purpose", onPick);
    try {
      const p = new URLSearchParams(window.location.search).get("purpose");
      if (p && PURPOSES.some((x) => x.key === p)) setF((x) => ({ ...x, purpose: p }));
    } catch {}
    return () => window.removeEventListener("drishta:purpose", onPick);
  }, []);

  const set = (k, v) => {
    setF((x) => ({ ...x, [k]: v }));
    if (status === "error") setStatus("idle");
  };
  const fail = (m) => (setStatus("error"), setMsg(m));

  async function submit(e) {
    e.preventDefault();
    const phone = cleanPhone(f.phone);
    if (!f.purpose) return fail("कृपया चुनें कि आप क्या चाहते हैं।");
    if (f.name.trim().length < 2) return fail("कृपया अपना नाम लिखें।");
    if (f.org.trim().length < 2) return fail("कृपया संस्था का नाम लिखें।");
    if (!validPhone(phone)) return fail("कृपया सही 10 अंकों का मोबाइल नंबर लिखें।");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return fail("ईमेल सही नहीं लग रहा।");
    if (!f.orgType) return fail("कृपया संस्था का प्रकार चुनें।");
    if (!f.consent) return fail("आगे बढ़ने के लिए सहमति वाले बॉक्स पर टिक करें।");
    if (!isConfigured()) return fail("Form अभी Database से नहीं जुड़ा है।");

    setStatus("sending");
    try {
      const r = await rpc("pp_book_drishta", {
        p_name: f.name,
        p_org: f.org,
        p_phone: phone,
        p_email: f.email,
        p_org_type: f.orgType,
        p_purpose: f.purpose,
        p_service: f.service || null,
        p_details: f.details,
        p_utm: utm,
      });
      trackLead(r.enquiry_no, { content_name: "Drishta Inquiry", content_category: f.purpose });
      setResult({ ...r, name: f.name.trim(), org: f.org.trim(), orgType: f.orgType, purpose: f.purpose });
      setStatus("done");
    } catch (err) {
      fail(errorText(err));
    }
  }

  if (status === "done" && result) {
    const typ = ORG_TYPES.find((t) => t.key === result.orgType)?.title || result.orgType;
    const pur = PURPOSES.find((p) => p.key === result.purpose)?.hi || result.purpose;
    const wa = `https://wa.me/${drishta.whatsapp}?text=${encodeURIComponent(
      `नमस्ते 🙏 मैंने प्रकृति पथ – दृष्टा के लिए आवेदन किया है।\nआवेदन संख्या: ${result.enquiry_no}\nसंस्था: ${result.org} (${typ})\nउद्देश्य: ${pur}`
    )}`;
    return (
      <div className="md-card md-done" id="inquiry-form">
        <div className="md-done-icon">🔭</div>
        <h3 className="serif">धन्यवाद, {result.name}। आपका आवेदन मिल गया।</h3>
        <p>आवेदन संख्या:</p>
        <div className="md-id">{result.enquiry_no}</div>
        <p className="md-small">हमारी टीम 1–2 कार्यदिवस में आपसे संपर्क करके पहली बातचीत का समय तय करेगी।</p>
        <a
          className="md-btn md-btn-wa"
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 16 }}
          onClick={() => trackEvent("WhatsAppClick", { place: "drishta_after_form" })}
        >
          WhatsApp पर आवेदन की सूचना भेजें
        </a>
      </div>
    );
  }

  return (
    <form className="md-card dr-form" id="inquiry-form" onSubmit={submit} noValidate>
      <fieldset className="md-field">
        <legend>आप क्या चाहते हैं? *</legend>
        <div className="md-chips">
          {PURPOSES.map((p) => (
            <button
              type="button"
              key={p.key}
              className={`md-chip ${f.purpose === p.key ? "md-chip-on" : ""}`}
              aria-pressed={f.purpose === p.key}
              onClick={() => set("purpose", p.key)}
            >
              {p.hi}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="md-grid">
        <label>
          <span>आपका नाम *</span>
          <input value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        </label>
        <label>
          <span>संस्था का नाम *</span>
          <input value={f.org} onChange={(e) => set("org", e.target.value)} autoComplete="organization" />
        </label>
        <label>
          <span>मोबाइल नंबर *</span>
          <input
            value={f.phone}
            onChange={(e) => set("phone", e.target.value)}
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={14}
            placeholder="10 अंकों का नंबर"
          />
        </label>
        <label>
          <span>ईमेल</span>
          <input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" placeholder="वैकल्पिक" />
        </label>
        <label>
          <span>संस्था का प्रकार *</span>
          <select value={f.orgType} onChange={(e) => set("orgType", e.target.value)}>
            <option value="">— चुनें —</option>
            {ORG_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.title}
              </option>
            ))}
            <option value="other">अन्य</option>
          </select>
        </label>
        <label>
          <span>आवश्यक सेवा</span>
          <select value={f.service} onChange={(e) => set("service", e.target.value)}>
            <option value="">— वैकल्पिक —</option>
            {SERVICES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.tag}. {s.title}
              </option>
            ))}
            <option value="unsure">अभी तय नहीं — बात करके बताएँगे</option>
          </select>
        </label>
      </div>

      <label className="md-message">
        <span>संक्षिप्त विवरण</span>
        <textarea
          rows={4}
          value={f.details}
          onChange={(e) => set("details", e.target.value)}
          maxLength={2000}
          placeholder="संस्था का आकार, मुख्य चुनौती, क्या समझना या सुधारना चाहते हैं…"
        />
      </label>

      <label className="md-consent">
        <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />
        <span>
          मैं सहमत हूँ कि प्रकृति पथ इस आवेदन के लिए मुझसे संपर्क करे। जानकारी गोपनीय रहेगी (<a href="/privacy">गोपनीयता नीति</a>)।
        </span>
      </label>

      {status === "error" && <p className="md-error">{msg}</p>}

      <button className="md-btn md-btn-primary dr-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "भेज रहे हैं…" : "आवेदन भेजें →"}
      </button>
    </form>
  );
}
