"use client";

import { PROGRAMS, feeLabel } from "@/data/margdarshan";

// कार्ड का बटन दबाने पर नीचे फॉर्म में वही कार्यक्रम पहले से चुना हो
export function chooseProgram(key) {
  window.dispatchEvent(new CustomEvent("pp:program", { detail: key }));
  document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
}

export default function ProgramCards() {
  const featured = PROGRAMS.filter((p) => p.featured);
  const rest = PROGRAMS.filter((p) => !p.featured);

  return (
    <>
      {featured.map((p) => (
        <div key={p.key} className="md-free">
          <span className="md-free-icon" aria-hidden>
            {p.icon}
          </span>
          <div>
            <h3 className="serif">{p.title}</h3>
            <p>{p.for} — {p.points.join(" · ")}</p>
          </div>
          <button type="button" className="md-btn md-btn-haldi" onClick={() => chooseProgram(p.key)}>
            निःशुल्क बातचीत बुक करें →
          </button>
        </div>
      ))}

      <div className="md-programs">
        {rest.map((p) => (
          <article key={p.key} className="md-program">
            <div className="md-program-head">
              <span className="md-program-icon" aria-hidden>
                {p.icon}
              </span>
              <div className="md-modes">
                {p.modes.map((m) => (
                  <span key={m} className="md-mode">
                    {m === "online" ? "Online" : "Offline"}
                  </span>
                ))}
              </div>
            </div>
            <h3 className="serif">{p.title}</h3>
            <p className="md-program-en">{p.en}</p>
            <p className="md-program-for">{p.for}</p>
            <ul>
              {p.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            {p.link && (
              <a href={p.link} className="md-more">
                पूरी जानकारी देखें →
              </a>
            )}
            <div className="md-program-foot">
              <span className="md-fee">{feeLabel(p)}</span>
              <button type="button" className="md-btn md-btn-soft" onClick={() => chooseProgram(p.key)}>
                बुक करें →
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
