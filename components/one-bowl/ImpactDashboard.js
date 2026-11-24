"use client";

import { useEffect, useState } from "react";
import { rpc, isConfigured } from "@/lib/oneBowl";

const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-IN") : "—");

const TILES = [
  { key: "ambassadors", label: "Ambassadors", hi: "स्वीकृत Ambassador", icon: "🎖️" },
  { key: "participants", label: "Participants", hi: "पंजीकृत नागरिक", icon: "🙋" },
  { key: "reach", label: "Reach", hi: "संदेश की पहुँच", icon: "📣" },
  { key: "pledges", label: "Pledges", hi: "कुल संकल्प", icon: "🤝" },
  { key: "reported", label: "Reported Bowls", hi: "रिपोर्ट की गई कटोरियाँ", icon: "📸" },
  { key: "verified", label: "Verified Bowls", hi: "सत्यापित कटोरियाँ", icon: "✅", strong: true },
];

export default function ImpactDashboard({ initial = null }) {
  const [stats, setStats] = useState(initial);
  const [state, setState] = useState(initial ? "ok" : "loading");

  useEffect(() => {
    if (!isConfigured()) return setState("off");
    let alive = true;
    const load = () =>
      rpc("obw_stats")
        .then((s) => alive && (setStats(s), setState("ok")))
        .catch(() => alive && setState((p) => (p === "ok" ? "ok" : "error")));
    load();
    const t = setInterval(load, 60000); // हर मिनट अपने-आप ताज़ा
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="ob-dash">
      <div className="ob-tiles">
        {TILES.map((t) => (
          <div key={t.key} className={`ob-tile ${t.strong ? "ob-tile-strong" : ""}`}>
            <span className="ob-tile-icon" aria-hidden>
              {t.icon}
            </span>
            <span className="ob-tile-num">{state === "loading" ? "…" : fmt(stats?.[t.key])}</span>
            <span className="ob-tile-label">{t.label}</span>
            <span className="ob-tile-hi">{t.hi}</span>
          </div>
        ))}
      </div>

      <p className="ob-dash-note">
        चारों आँकड़े — <b>Reach</b>, <b>Pledge</b>, <b>Reported</b> और <b>Verified</b> — अलग-अलग गिने जाते हैं। केवल
        फोटो-सत्यापन के बाद ही कोई कटोरी “Verified” मानी जाती है।
        {stats?.bowls_pledged ? <> नागरिकों ने कुल <b>{fmt(stats.bowls_pledged)}</b> कटोरियाँ रखने का संकल्प लिया है।</> : null}
      </p>

      {stats?.states?.length > 0 && (
        <div className="ob-table-wrap">
          <table className="ob-table">
            <thead>
              <tr>
                <th>राज्य</th>
                <th>नागरिक</th>
                <th>जिले</th>
                <th>सत्यापित कटोरियाँ</th>
              </tr>
            </thead>
            <tbody>
              {stats.states.map((s) => (
                <tr key={s.state}>
                  <td>{s.state}</td>
                  <td>{fmt(s.participants)}</td>
                  <td>{fmt(s.districts)}</td>
                  <td>{fmt(s.verified)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {state === "off" && <p className="ob-dash-note">Dashboard अभी Database से नहीं जुड़ा है (.env.local देखें)।</p>}
      {state === "error" && <p className="ob-dash-note">आँकड़े अभी लोड नहीं हो पाए — थोड़ी देर में फिर देखें।</p>}
    </div>
  );
}
