"use client";

import { useState } from "react";
import { QUESTIONS, TYPES } from "@/data/prakritiQuiz";

const ORDER = ["prithvi", "jal", "agni", "vayu"];

function score(answers) {
  const s = { prithvi: 0, jal: 0, agni: 0, vayu: 0 };
  answers.forEach((t) => t && (s[t] += 1));
  const ranked = [...ORDER].sort((a, b) => s[b] - s[a]);
  return { s, primary: ranked[0], secondary: s[ranked[1]] > 0 ? ranked[1] : null };
}

export default function PrakritiQuiz() {
  const [step, setStep] = useState(-1); // -1 = शुरुआत, 0..n-1 = प्रश्न, n = परिणाम
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const n = QUESTIONS.length;

  function choose(type) {
    const next = [...answers];
    next[step] = type;
    setAnswers(next);
    setTimeout(() => {
      setStep((x) => x + 1);
      if (step + 1 === n) finish(next);
      window.scrollTo({ top: document.getElementById("quiz")?.offsetTop - 20 || 0, behavior: "smooth" });
    }, 180);
  }

  function finish(all) {
    const r = score(all);
    const label = `${TYPES[r.primary].name}${r.secondary ? ` (साथ में ${TYPES[r.secondary].name})` : ""}`;
    try {
      localStorage.setItem("pp_quiz_result", label);
    } catch {}
  }

  function restart() {
    setAnswers(Array(n).fill(null));
    setStep(0);
  }

  // ── शुरुआत ──
  if (step === -1) {
    return (
      <div className="md-card md-quiz-start" id="quiz">
        <div className="md-quiz-types">
          {ORDER.map((k) => (
            <span key={k}>
              {TYPES[k].icon} {TYPES[k].name.split(" ")[0]}
            </span>
          ))}
        </div>
        <h3 className="serif">आपके भीतर कौन-सा तत्व सबसे प्रबल है?</h3>
        <p className="md-small">
          {n} सरल प्रश्न · लगभग 3 मिनट · हर प्रश्न में वह उत्तर चुनें जो <b>सच में</b> आप जैसा है — जैसा होना चाहिए वैसा नहीं।
        </p>
        <button type="button" className="md-btn md-btn-primary" onClick={() => setStep(0)}>
          Quiz शुरू करें →
        </button>
      </div>
    );
  }

  // ── परिणाम ──
  if (step >= n) {
    const { s, primary, secondary } = score(answers);
    const T = TYPES[primary];
    const shareText =
      `🧭 मेरी प्रकृति: *${T.name}* ${T.icon} — ${T.line}\n\n` +
      `आप भी 3 मिनट में अपनी प्रकृति जानें 👇\nhttps://prakritipath.org/prakriti-quiz\n\n— Prakriti Path`;

    return (
      <div className="md-card md-result" id="quiz" style={{ "--tc": T.color }}>
        <p className="md-eyebrow">आपकी प्रकृति</p>
        <div className="md-result-head">
          <span className="md-result-icon" aria-hidden>
            {T.icon}
          </span>
          <div>
            <h3 className="serif">{T.name}</h3>
            <p>{T.line}</p>
            {secondary && (
              <p className="md-small">
                साथ में: {TYPES[secondary].icon} <b>{TYPES[secondary].name}</b>
              </p>
            )}
          </div>
        </div>

        <div className="md-bars">
          {ORDER.map((k) => (
            <div key={k} className="md-bar">
              <span>
                {TYPES[k].icon} {TYPES[k].name.split(" ")[0]}
              </span>
              <div>
                <i style={{ width: `${Math.round((s[k] / n) * 100)}%`, background: TYPES[k].color }} />
              </div>
              <b>{Math.round((s[k] / n) * 100)}%</b>
            </div>
          ))}
        </div>

        <p className="md-result-about">{T.about}</p>

        <div className="md-result-cols">
          <div>
            <h4>✨ आपकी शक्ति</h4>
            <ul>
              {T.strengths.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>🪢 जहाँ आप अटक सकते हैं</h4>
            <ul>
              {T.stuck.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md-result-steps">
          <h4>🌱 इस सप्ताह के तीन छोटे कदम</h4>
          <ol>
            {T.steps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </div>

        <div className="md-result-cta">
          <p className="serif">
            यह केवल शुरुआत है। आपकी प्रकृति की पूरी, गहरी समझ — और आपके लिए सही जीवन-पथ — एक व्यक्तिगत सत्र में।
          </p>
          <div className="md-cta">
            <a href="/margdarshan?program=prakriti&src=quiz#book" className="md-btn md-btn-primary">
              “अपनी प्रकृति जानें” सत्र बुक करें →
            </a>
            <a href="/margdarshan?program=free_call&src=quiz#book" className="md-btn md-btn-ghost">
              पहले 15 मिनट निःशुल्क बात करें
            </a>
          </div>
          <div className="md-cta">
            <a
              className="md-btn md-btn-wa"
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              परिणाम WhatsApp पर साझा करें
            </a>
            <button type="button" className="md-link" onClick={restart}>
              Quiz दोबारा दें
            </button>
          </div>
        </div>

        <p className="md-small md-quiz-note">
          यह quiz आत्म-चिंतन के लिए है — कोई वैज्ञानिक या चिकित्सीय जाँच नहीं। हर व्यक्ति में चारों तत्व होते हैं; यह केवल
          बताता है कि अभी कौन-सा अधिक प्रबल है।
        </p>
      </div>
    );
  }

  // ── प्रश्न ──
  const Q = QUESTIONS[step];
  return (
    <div className="md-card md-quiz" id="quiz">
      <div className="md-progress" aria-label={`प्रश्न ${step + 1} / ${n}`}>
        <i style={{ width: `${(step / n) * 100}%` }} />
      </div>
      <p className="md-quiz-count">
        प्रश्न {step + 1} / {n}
      </p>
      <h3 className="serif md-quiz-q">{Q.q}</h3>
      <div className="md-options">
        {Q.o.map(([text, type]) => (
          <button
            type="button"
            key={text}
            className={`md-option ${answers[step] === type ? "md-option-on" : ""}`}
            onClick={() => choose(type)}
          >
            {text}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button type="button" className="md-link" onClick={() => setStep(step - 1)}>
          ← पिछला प्रश्न
        </button>
      )}
    </div>
  );
}
