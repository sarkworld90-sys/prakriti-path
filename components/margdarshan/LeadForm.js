"use client";

import { useEffect, useState } from "react";
import { contact } from "@/data/margdarshan";
import { rpc, cleanPhone, validPhone, errorText, isConfigured } from "@/lib/oneBowl";
import { captureUtm, trackLead } from "@/lib/track";

// Facebook ads से आने वालों के लिए छोटा, तेज़ फॉर्म — निःशुल्क 15 मिनट की बातचीत
const TOPICS = ["मन की उलझन", "डर / चिंता", "रिश्ते", "करियर / दिशा", "अपनी प्रकृति जानना", "अन्य"];
const TIMES = ["सुबह", "दोपहर", "शाम", "कभी भी"];

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [topics, setTopics] = useState([]);
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [utm, setUtm] = useState({});
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => setUtm(captureUtm()), []);

  const toggle = (x) => setTopics((t) => (t.includes(x) ? t.filter((y) => y !== x) : [...t, x]));
  const fail = (m) => (setStatus("error"), setMsg(m));

  async function submit(e) {
    e.preventDefault();
    const p = cleanPhone(phone);
    if (name.trim().length < 2) return fail("कृपया अपना नाम लिखें।");
    if (!validPhone(p)) return fail("कृपया सही 10 अंकों का मोबाइल नंबर लिखें।");
    if (!isConfigured()) return fail("Form अभी Database से नहीं जुड़ा है (.env.local देखें)।");

    setStatus("sending");
    try {
      const concern = [topics.length ? `विषय: ${topics.join(", ")}` : "", note.trim()].filter(Boolean).join(" — ");
      const r = await rpc("pp_book_lead", {
        p_name: name,
        p_phone: p,
        p_city: city,
        p_concern: concern,
        p_time: time,
        p_utm: utm,
      });
      trackLead(r.enquiry_no);
      setResult({ ...r, name: name.trim() });
      setStatus("done");
    } catch (err) {
      fail(errorText(err));
    }
  }

  if (status === "done" && result) {
    const wa = contact.whatsapp
      ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
          `नमस्ते 🙏 मैंने निःशुल्क मार्गदर्शन बातचीत बुक की है। आवेदन संख्या: ${result.enquiry_no}`
        )}`
      : "";
    return (
      <div className="md-card md-done gd-form" id="form">
        <div className="md-done-icon">🪷</div>
        <h3 className="serif">धन्यवाद, {result.name}! आपकी बातचीत बुक हो गई।</h3>
        <p>आवेदन संख्या:</p>
        <div className="md-id">{result.enquiry_no}</div>
        <p className="md-small">24 घंटों में हमारी टीम आपको फ़ोन या WhatsApp करके समय तय करेगी।</p>
        {wa && (
          <a className="md-btn md-btn-wa" href={wa} target="_blank" rel="noopener noreferrer" style={{ marginTop: 14 }}>
            अभी WhatsApp पर संदेश भेजें
          </a>
        )}
        <div className="gd-next">
          <p>तब तक, 3 मिनट में जानिए अपनी प्रकृति:</p>
          <a href="/prakriti-quiz" className="md-btn md-btn-soft">
            🧭 Prakriti Quiz दें →
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="md-card gd-form" id="form" onSubmit={submit} noValidate>
      <p className="gd-form-title serif">निःशुल्क 15 मिनट की बातचीत बुक करें</p>
      <p className="gd-form-sub">कोई शुल्क नहीं · कोई दबाव नहीं · पूरी गोपनीयता</p>

      <div className="gd-fields">
        <label>
          <span>आपका नाम *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="पूरा नाम" autoComplete="name" />
        </label>
        <label>
          <span>मोबाइल नंबर (WhatsApp) *</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10 अंकों का नंबर"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={14}
          />
        </label>
        <label>
          <span>शहर</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="वैकल्पिक" autoComplete="address-level2" />
        </label>
      </div>

      <fieldset className="md-field">
        <legend>किस बारे में बात करना चाहेंगे? (वैकल्पिक)</legend>
        <div className="md-chips">
          {TOPICS.map((x) => (
            <button
              type="button"
              key={x}
              className={`md-chip ${topics.includes(x) ? "md-chip-on" : ""}`}
              aria-pressed={topics.includes(x)}
              onClick={() => toggle(x)}
            >
              {x}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="md-field">
        <legend>बात करने का सुविधाजनक समय</legend>
        <div className="md-chips">
          {TIMES.map((x) => (
            <button
              type="button"
              key={x}
              className={`md-chip ${time === x ? "md-chip-on" : ""}`}
              aria-pressed={time === x}
              onClick={() => setTime(time === x ? "" : x)}
            >
              {x}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="md-message">
        <span>कुछ और बताना चाहें (वैकल्पिक)</span>
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} placeholder="जितना सहज लगे, उतना ही" />
      </label>

      {status === "error" && <p className="md-error">{msg}</p>}

      <button className="md-btn md-btn-haldi gd-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "बुक हो रहा है…" : "निःशुल्क बातचीत बुक करें →"}
      </button>
      <p className="gd-privacy">
        बुक करके आप सहमति देते हैं कि प्रकृति पथ इस बातचीत के लिए आपसे संपर्क करे।{" "}
        <a href="/privacy">गोपनीयता नीति</a>
      </p>
    </form>
  );
}
