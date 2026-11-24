"use client";

import { useEffect, useState } from "react";
import { STATES, LEVELS } from "@/data/oneBowl";
import { rpc, uploadPhoto, randomId, cleanPhone, validPhone, readReferral, errorText, isConfigured } from "@/lib/oneBowl";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  level: "",
  state: "",
  district: "",
  assembly: "",
  block: "",
  panchayat: "",
  occupation: "",
  social: "",
  motivation: "",
  consent: false,
};

export default function AmbassadorForm() {
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [ref, setRef] = useState("");
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => setRef(readReferral()), []);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (status === "error") setStatus("idle");
  };
  const fail = (t) => (setStatus("error"), setMsg(t));

  function pickPhoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit(e) {
    e.preventDefault();
    const phone = cleanPhone(form.phone);
    if (form.name.trim().length < 2) return fail("कृपया अपना पूरा नाम लिखें।");
    if (!validPhone(phone)) return fail("कृपया सही 10 अंकों का मोबाइल नंबर लिखें।");
    if (!form.level) return fail("कृपया चुनें कि आप किस स्तर के Ambassador बनना चाहते हैं।");
    if (!form.state) return fail("कृपया राज्य चुनें।");
    if (!form.district.trim()) return fail("कृपया जिला लिखें।");
    if (!photo) return fail("कृपया अपनी एक साफ़ फोटो लगाएँ — यह Digital ID Card पर आएगी।");
    if (form.motivation.trim().length < 10) return fail("कृपया दो-चार पंक्तियों में बताएँ कि आप क्यों जुड़ना चाहते हैं।");
    if (!form.consent) return fail("आगे बढ़ने के लिए सहमति वाले बॉक्स पर टिक करें।");
    if (!isConfigured()) return fail("Form अभी Database से नहीं जुड़ा है (.env.local देखें)।");

    setStatus("sending");
    try {
      const path = await uploadPhoto(`ambassadors/${randomId()}.jpg`, photo);
      const r = await rpc("obw_apply_ambassador", {
        p_name: form.name,
        p_phone: phone,
        p_email: form.email,
        p_photo_path: path,
        p_level: form.level,
        p_state: form.state,
        p_district: form.district,
        p_assembly: form.assembly,
        p_block: form.block,
        p_panchayat: form.panchayat,
        p_occupation: form.occupation,
        p_social: form.social,
        p_motivation: form.motivation,
        p_ref: ref || null,
      });
      setResult(r);
      setStatus("done");
    } catch (err) {
      fail(errorText(err));
    }
  }

  if (status === "done" && result) {
    return (
      <div className="ob-card ob-done">
        <div className="ob-done-icon">🎖️</div>
        <h3 className="serif">
          {result.existing ? "आपका आवेदन पहले से हमारे पास है।" : "आपका Ambassador आवेदन प्राप्त हो गया!"}
        </h3>
        <p>आवेदन संख्या:</p>
        <div className="ob-id">{result.application_no}</div>
        <p className="ob-small">
          प्रकृति पथ की टीम आपके आवेदन की जाँच करेगी। स्वीकृति के बाद आपको <b>Unique Ambassador ID</b>, अपना{" "}
          <b>QR Code</b> और <b>Digital ID Card</b> मिलेगा।
        </p>
      </div>
    );
  }

  return (
    <form className="ob-card" onSubmit={submit} noValidate>
      {ref && <p className="ob-ref">आपको Ambassador <b>{ref}</b> ने आमंत्रित किया है 🙏</p>}

      <div className="ob-amb-top">
        <label className="ob-avatar">
          <input type="file" accept="image/*" onChange={pickPhoto} />
          {preview ? <img src={preview} alt="आपकी फोटो" /> : <span>📷<br />फोटो *</span>}
        </label>
        <div className="ob-grid ob-grid-tight">
          <label>
            <span>नाम *</span>
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
            <span>व्यवसाय / पद</span>
            <input value={form.occupation} onChange={(e) => update("occupation", e.target.value)} placeholder="जैसे शिक्षक, छात्र, व्यापारी" />
          </label>
        </div>
      </div>

      <fieldset className="ob-field">
        <legend>आप किस स्तर के Ambassador बनना चाहते हैं? *</legend>
        <div className="ob-chips">
          {LEVELS.map((l) => (
            <button
              type="button"
              key={l.key}
              className={`ob-chip ${form.level === l.key ? "ob-chip-on" : ""}`}
              aria-pressed={form.level === l.key}
              onClick={() => update("level", l.key)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="ob-grid">
        <label>
          <span>राज्य *</span>
          <select value={form.state} onChange={(e) => update("state", e.target.value)}>
            <option value="">— चुनें —</option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          <span>जिला *</span>
          <input value={form.district} onChange={(e) => update("district", e.target.value)} />
        </label>
        <label>
          <span>विधानसभा</span>
          <input value={form.assembly} onChange={(e) => update("assembly", e.target.value)} />
        </label>
        <label>
          <span>प्रखंड</span>
          <input value={form.block} onChange={(e) => update("block", e.target.value)} />
        </label>
        <label>
          <span>पंचायत / वार्ड</span>
          <input value={form.panchayat} onChange={(e) => update("panchayat", e.target.value)} />
        </label>
        <label>
          <span>सोशल मीडिया प्रोफ़ाइल</span>
          <input value={form.social} onChange={(e) => update("social", e.target.value)} placeholder="Facebook / Instagram लिंक" />
        </label>
      </div>

      <label className="ob-message">
        <span>आप इस अभियान से क्यों जुड़ना चाहते हैं? *</span>
        <textarea
          rows={3}
          value={form.motivation}
          onChange={(e) => update("motivation", e.target.value)}
          maxLength={1000}
          placeholder="दो-चार पंक्तियों में अपने मन की बात लिखें"
        />
      </label>

      <label className="ob-consent">
        <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} />
        <span>
          मैं सहमत हूँ कि मेरी जानकारी और फोटो केवल इस अभियान, मेरे ID Card और Ambassador प्रोफ़ाइल के लिए उपयोग हो (
          <a href="/privacy">गोपनीयता नीति</a>)।
        </span>
      </label>

      {status === "error" && <p className="ob-error">{msg}</p>}

      <button className="ob-btn ob-btn-haldi" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "आवेदन भेज रहे हैं…" : "Ambassador के लिए आवेदन करें →"}
      </button>
    </form>
  );
}
