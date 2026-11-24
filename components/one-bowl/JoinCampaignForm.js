"use client";

import { useEffect, useState } from "react";
import { STATES, PARTICIPANT_TYPES } from "@/data/oneBowl";
import { rpc, uploadPhoto, cleanPhone, validPhone, readReferral, errorText, isConfigured } from "@/lib/oneBowl";
import ShareButtons from "./ShareButtons";

const EMPTY = { name: "", phone: "", state: "", district: "", place: "", bowls: 1, type: "individual", pledge: false };

export default function JoinCampaignForm() {
  const [form, setForm] = useState(EMPTY);
  const [ref, setRef] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(null); // { campaign_id, existing, phone }

  useEffect(() => {
    setRef(readReferral());
    // "One School One Bowl" जैसे कार्ड से आए हों तो प्रकार पहले से चुनें
    const onPick = (e) => setForm((f) => ({ ...f, type: e.detail }));
    window.addEventListener("obw:type", onPick);
    return () => window.removeEventListener("obw:type", onPick);
  }, []);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (status === "error") setStatus("idle");
  };
  const fail = (t) => (setStatus("error"), setMsg(t));

  async function submit(e) {
    e.preventDefault();
    const phone = cleanPhone(form.phone);
    if (form.name.trim().length < 2) return fail("कृपया अपना पूरा नाम लिखें।");
    if (!validPhone(phone)) return fail("कृपया सही 10 अंकों का मोबाइल नंबर लिखें।");
    if (!form.state) return fail("कृपया राज्य चुनें।");
    if (!form.place.trim()) return fail("कृपया अपना शहर / गाँव लिखें।");
    if (!form.pledge) return fail("संकल्प वाले बॉक्स पर टिक करें।");
    if (!isConfigured()) return fail("Form अभी Database से नहीं जुड़ा है (.env.local देखें)।");

    setStatus("sending");
    try {
      const r = await rpc("obw_join", {
        p_name: form.name,
        p_phone: phone,
        p_state: form.state,
        p_district: form.district,
        p_place: form.place,
        p_bowls: Number(form.bowls) || 1,
        p_type: form.type,
        p_ref: ref || null,
      });
      setResult({ ...r, phone, name: form.name.trim() });
      setStatus("done");
    } catch (err) {
      fail(errorText(err));
    }
  }

  if (status === "done" && result) {
    return (
      <div className="ob-card ob-done">
        <div className="ob-done-icon">🕊️</div>
        <h3 className="serif">
          {result.existing ? "आप पहले से अभियान से जुड़े हैं!" : `धन्यवाद, ${result.name}! आपका संकल्प दर्ज हो गया।`}
        </h3>
        <p>आपकी Unique Campaign ID:</p>
        <div className="ob-id">{result.campaign_id}</div>
        <p className="ob-small">इसे सँभालकर रखें — फोटो भेजने के लिए यही ID और आपका मोबाइल नंबर काम आएगा।</p>

        <BowlPhotoUpload campaignId={result.campaign_id} phone={result.phone} />

        <div className="ob-share-box">
          <p>अब 5 और लोगों को जोड़िए 👇</p>
          <ShareButtons refCode={ref} />
        </div>
      </div>
    );
  }

  return (
    <form className="ob-card" onSubmit={submit} noValidate>
      {ref && <p className="ob-ref">आप Ambassador <b>{ref}</b> के निमंत्रण से जुड़ रहे हैं 🙏</p>}

      <fieldset className="ob-field">
        <legend>आप किस रूप में जुड़ रहे हैं?</legend>
        <div className="ob-chips">
          {PARTICIPANT_TYPES.map((t) => (
            <button
              type="button"
              key={t.key}
              className={`ob-chip ${form.type === t.key ? "ob-chip-on" : ""}`}
              aria-pressed={form.type === t.key}
              onClick={() => update("type", t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="ob-grid">
        <label>
          <span>{form.type === "individual" ? "नाम *" : "संस्था / आपका नाम *"}</span>
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
          <span>राज्य *</span>
          <select value={form.state} onChange={(e) => update("state", e.target.value)}>
            <option value="">— चुनें —</option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          <span>जिला</span>
          <input value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="जिले का नाम" />
        </label>
        <label>
          <span>शहर / गाँव *</span>
          <input value={form.place} onChange={(e) => update("place", e.target.value)} placeholder="जहाँ कटोरी रखेंगे" />
        </label>
        <label>
          <span>कितनी कटोरियाँ रखेंगे? *</span>
          <input
            type="number"
            min={1}
            max={100}
            value={form.bowls}
            onChange={(e) => update("bowls", e.target.value)}
            inputMode="numeric"
          />
        </label>
      </div>

      <label className="ob-consent">
        <input type="checkbox" checked={form.pledge} onChange={(e) => update("pledge", e.target.checked)} />
        <span>
          <b>मेरा संकल्प:</b> मैं पक्षियों और जीवों के लिए कटोरी में रोज़ साफ़ पानी रखूँगा/रखूँगी। मेरी जानकारी केवल इस अभियान
          के लिए उपयोग हो (<a href="/privacy">गोपनीयता नीति</a>)।
        </span>
      </label>

      {status === "error" && <p className="ob-error">{msg}</p>}

      <button className="ob-btn ob-btn-water" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "जोड़ रहे हैं…" : "संकल्प लें और जुड़ें 💧"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------
// कटोरी की फोटो भेजें — पंजीकरण के तुरंत बाद, या बाद में Campaign ID से
// ---------------------------------------------------------------------
export function BowlPhotoUpload({ campaignId = "", phone = "" }) {
  const [id, setId] = useState(campaignId);
  const [mob, setMob] = useState(phone);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loc, setLoc] = useState(null); // { lat, lng }
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const known = Boolean(campaignId && phone);

  function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
  }

  function shareLocation() {
    if (!navigator.geolocation) return;
    setMsg("लोकेशन ले रहे हैं…");
    navigator.geolocation.getCurrentPosition(
      (p) => (setLoc({ lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6) }), setMsg("")),
      () => setMsg("लोकेशन नहीं मिली — कोई बात नहीं, यह वैकल्पिक है।"),
      { timeout: 10000 }
    );
  }

  async function send() {
    const cid = id.trim().toUpperCase();
    const p = cleanPhone(mob);
    if (!/^OBW-\d+$/.test(cid)) return (setStatus("error"), setMsg("सही Campaign ID लिखें (जैसे OBW-100001)।"));
    if (!validPhone(p)) return (setStatus("error"), setMsg("सही मोबाइल नंबर लिखें।"));
    if (!file) return (setStatus("error"), setMsg("पहले कटोरी की फोटो चुनें।"));

    setStatus("sending");
    setMsg("");
    try {
      const path = await uploadPhoto(`reports/${cid}/${Date.now()}.jpg`, file);
      await rpc("obw_report", {
        p_campaign_id: cid,
        p_phone: p,
        p_photo_path: path,
        p_lat: loc?.lat ?? null,
        p_lng: loc?.lng ?? null,
      });
      setStatus("done");
      setFile(null);
      setPreview("");
    } catch (err) {
      setStatus("error");
      setMsg(errorText(err));
    }
  }

  if (status === "done") {
    return (
      <div className="ob-upload ob-upload-done">
        ✅ फोटो मिल गई! सत्यापन के बाद यह <b>Verified Bowls</b> में जुड़ जाएगी।
        <button type="button" className="ob-link" onClick={() => setStatus("idle")}>
          एक और फोटो भेजें
        </button>
      </div>
    );
  }

  return (
    <div className="ob-upload">
      <h4>📸 अपनी कटोरी की फोटो भेजें</h4>
      {!known && (
        <div className="ob-grid">
          <label>
            <span>Campaign ID</span>
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="OBW-100001" />
          </label>
          <label>
            <span>मोबाइल नंबर</span>
            <input value={mob} onChange={(e) => setMob(e.target.value)} inputMode="numeric" maxLength={14} />
          </label>
        </div>
      )}
      <label className="ob-file">
        <input type="file" accept="image/*" capture="environment" onChange={pick} />
        {preview ? <img src={preview} alt="चुनी गई फोटो" /> : <span>फोटो चुनें या कैमरा खोलें</span>}
      </label>
      <div className="ob-upload-row">
        <button type="button" className="ob-link" onClick={shareLocation} disabled={!!loc}>
          {loc ? "📍 लोकेशन जुड़ गई" : "📍 लोकेशन जोड़ें (वैकल्पिक)"}
        </button>
        <button type="button" className="ob-btn ob-btn-water" onClick={send} disabled={status === "sending"}>
          {status === "sending" ? "भेज रहे हैं…" : "फोटो भेजें"}
        </button>
      </div>
      {msg && <p className={status === "error" ? "ob-error" : "ob-small"}>{msg}</p>}
    </div>
  );
}
