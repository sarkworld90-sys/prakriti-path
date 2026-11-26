"use client";

import { useEffect, useState } from "react";
import { PROGRAMS, MODES, LANGUAGES, contact, feeLabel } from "@/data/margdarshan";
import { rpc, cleanPhone, validPhone, errorText, isConfigured } from "@/lib/oneBowl";
import PayButton from "./PayButton";
import { trackLead } from "@/lib/track";

const EMPTY = {
  program: "",
  mode: "",
  name: "",
  phone: "",
  email: "",
  city: "",
  org: "",
  team: "",
  time: "",
  language: "हिंदी",
  concern: "",
  consent: false,
};

const isOrg = (p) => p === "corporate" || p === "department";

export default function BookingForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(null);
  const [source, setSource] = useState("website");
  const [quiz, setQuiz] = useState("");

  // URL से: ?program=prakriti&src=quiz  (Quiz, पुस्तक का QR, 21 दिन वाला page)
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const prog = q.get("program");
      if (prog && PROGRAMS.some((p) => p.key === prog)) pick(prog);
      const src = (q.get("src") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "");
      if (src) setSource(src);
      const qr = localStorage.getItem("pp_quiz_result");
      if (src === "quiz" && qr) {
        setQuiz(qr);
        setForm((f) => ({ ...f, concern: f.concern || `मेरा Quiz परिणाम: ${qr}` }));
      }
    } catch {}
  }, []);

  function pick(key) {
    const prog = PROGRAMS.find((p) => p.key === key);
    setForm((f) => ({
      ...f,
      program: key,
      // केवल एक तरीका हो (जैसे पहली बातचीत = online) तो अपने-आप चुनें
      mode: prog?.modes.length === 1 ? prog.modes[0] : f.mode === "offline" && !prog?.modes.includes("offline") ? "" : f.mode,
    }));
  }

  useEffect(() => {
    const onPick = (e) => pick(e.detail);
    window.addEventListener("pp:program", onPick);
    return () => window.removeEventListener("pp:program", onPick);
  }, []);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (status === "error") setStatus("idle");
  };
  const fail = (t) => (setStatus("error"), setMsg(t));

  async function submit(e) {
    e.preventDefault();
    const phone = cleanPhone(form.phone);
    if (!form.program) return fail("कृपया चुनें कि आप किस कार्यक्रम से जुड़ना चाहते हैं।");
    if (!form.mode) return fail("कृपया Online या Offline चुनें।");
    if (form.name.trim().length < 2) return fail("कृपया अपना पूरा नाम लिखें।");
    if (!validPhone(phone)) return fail("कृपया सही 10 अंकों का मोबाइल नंबर लिखें।");
    if (isOrg(form.program) && !form.org.trim()) return fail("कृपया कंपनी / विभाग / संस्था का नाम लिखें।");
    if (!form.consent) return fail("आगे बढ़ने के लिए सहमति वाले बॉक्स पर टिक करें।");
    if (!isConfigured()) return fail("Form अभी Database से नहीं जुड़ा है (.env.local देखें)।");

    setStatus("sending");
    try {
      const r = await rpc("pp_book_enquiry", {
        p_program: form.program,
        p_mode: form.mode,
        p_name: form.name,
        p_phone: phone,
        p_email: form.email,
        p_city: form.city,
        p_org: form.org,
        p_team: parseInt(form.team, 10) || null,
        p_time: form.time,
        p_language: form.language,
        p_concern: form.concern,
        p_source: source,
        p_quiz: quiz || null,
      });
      trackLead(r.enquiry_no, { content_category: form.program });
      setResult({ ...r, name: form.name.trim(), program: form.program, phone });
      setStatus("done");
    } catch (err) {
      fail(errorText(err));
    }
  }

  if (status === "done" && result) {
    const prog = PROGRAMS.find((p) => p.key === result.program);
    const wa = contact.whatsapp
      ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
          `नमस्ते 🙏 मैंने "${prog?.title}" के लिए आवेदन किया है। आवेदन संख्या: ${result.enquiry_no}`
        )}`
      : "";
    return (
      <div className="md-card md-done">
        <div className="md-done-icon">🪷</div>
        <h3 className="serif">धन्यवाद, {result.name}। आपका पहला कदम उठ चुका है।</h3>
        <p>आवेदन संख्या:</p>
        <div className="md-id">{result.enquiry_no}</div>
        {prog?.price && !prog.free ? (
          <>
            <p className="md-small">
              इस कार्यक्रम का शुल्क <b>{feeLabel(prog)}</b> है। अभी online भुगतान करके अपनी जगह पक्की करें — या बाद में, जब
              हमारी टीम आपसे संपर्क करे।
            </p>
            <PayButton enquiryNo={result.enquiry_no} program={prog.key} name={result.name} phone={result.phone} />
          </>
        ) : (
          <p className="md-small">
            प्रकृति पथ की टीम 24–48 घंटों में आपसे संपर्क करके
            {prog?.free ? " आपके Appointment का समय तय करेगी।" : " Appointment का समय और तरीका तय करेगी।"}
          </p>
        )}
        {wa && (
          <a className="md-btn md-btn-wa" href={wa} target="_blank" rel="noopener noreferrer" style={{ marginTop: 16 }}>
            WhatsApp पर बात शुरू करें
          </a>
        )}
      </div>
    );
  }

  const org = isOrg(form.program);
  const curProg = PROGRAMS.find((p) => p.key === form.program);

  return (
    <form className="md-card" onSubmit={submit} noValidate>
      <fieldset className="md-field">
        <legend>कौन-सा कार्यक्रम? *</legend>
        <div className="md-chips">
          {PROGRAMS.map((p) => (
            <button
              type="button"
              key={p.key}
              className={`md-chip ${form.program === p.key ? "md-chip-on" : ""}`}
              aria-pressed={form.program === p.key}
              onClick={() => (pick(p.key), status === "error" && setStatus("idle"))}
            >
              {p.icon} {p.title}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="md-field">
        <legend>कैसे? *</legend>
        <div className="md-chips">
          {MODES.filter(
            (m) => m.key === "any" ? (curProg?.modes.length ?? 2) > 1 : !curProg || curProg.modes.includes(m.key)
          ).map((m) => (
            <button
              type="button"
              key={m.key}
              className={`md-chip ${form.mode === m.key ? "md-chip-on" : ""}`}
              aria-pressed={form.mode === m.key}
              onClick={() => update("mode", m.key)}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="md-grid">
        {org && (
          <label>
            <span>कंपनी / विभाग / संस्था का नाम *</span>
            <input value={form.org} onChange={(e) => update("org", e.target.value)} />
          </label>
        )}
        {(org || form.program === "group") && (
          <label>
            <span>कितने लोग?</span>
            <input
              type="number"
              min={1}
              value={form.team}
              onChange={(e) => update("team", e.target.value)}
              inputMode="numeric"
              placeholder="लगभग संख्या"
            />
          </label>
        )}
        <label>
          <span>{org ? "संपर्क व्यक्ति का नाम *" : "नाम *"}</span>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="पूरा नाम" />
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
        <label>
          <span>सुविधाजनक समय</span>
          <input value={form.time} onChange={(e) => update("time", e.target.value)} placeholder="जैसे शाम 6–8, रविवार" />
        </label>
        <label>
          <span>भाषा</span>
          <select value={form.language} onChange={(e) => update("language", e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="md-message">
        <span>{org ? "आपकी टीम की ज़रूरत क्या है?" : "आप किस बात पर बात करना चाहते हैं?"}</span>
        <textarea
          rows={4}
          value={form.concern}
          onChange={(e) => update("concern", e.target.value)}
          maxLength={1500}
          placeholder={
            org ? "वैकल्पिक — जैसे काम का तनाव, टीम में संवाद, नेतृत्व" : "वैकल्पिक — जितना सहज लगे, उतना ही लिखें। यह केवल हमारी टीम पढ़ेगी।"
          }
        />
      </label>

      <label className="md-consent">
        <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} />
        <span>
          मैं सहमत हूँ कि प्रकृति पथ मेरी जानकारी केवल इस सत्र के लिए संपर्क करने हेतु उपयोग करे। मेरी जानकारी किसी और को
          नहीं दी जाएगी (<a href="/privacy">गोपनीयता नीति</a>)।
        </span>
      </label>

      {status === "error" && <p className="md-error">{msg}</p>}

      <button className="md-btn md-btn-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "भेज रहे हैं…" : "सत्र के लिए आवेदन करें →"}
      </button>
    </form>
  );
}
