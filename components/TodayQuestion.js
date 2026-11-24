"use client";

import { useEffect, useState } from "react";
import { dailyQuestions as hiQuestions } from "@/data/content";
import { dailyQuestions as enQuestions } from "@/data/content.en";
import { ui } from "@/data/ui";

// साल के दिन के हिसाब से हर दिन एक नया प्रश्न चुनता है।
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

export default function TodayQuestion({ lang = "hi" }) {
  const questions = lang === "en" ? enQuestions : hiQuestions;
  const t = ui[lang === "en" ? "en" : "hi"].q;

  const [question, setQuestion] = useState(questions[0]);
  const [dateText, setDateText] = useState("");
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const today = new Date();
    setQuestion(questions[getDayOfYear(today) % questions.length]);
    setDateText(today.toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    // पहले लिखा उत्तर इसी browser में वापस दिखाएँ (Login आने तक अस्थायी)
    try {
      const key = "pp-answer-" + today.toDateString();
      const old = localStorage.getItem(key);
      if (old) setAnswer(old);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  function handleSave() {
    if (!answer.trim()) return;
    try {
      localStorage.setItem("pp-answer-" + new Date().toDateString(), answer);
    } catch {}
    setSaved(true);
  }

  return (
    <div className="question-card">
      <span className="eyebrow">{t.eyebrow}</span>
      <p className="question-date">{dateText}</p>
      <h2 className="question-text serif">{question}</h2>
      <textarea
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setSaved(false);
        }}
        placeholder={t.placeholder}
        aria-label={t.aria}
      />
      <button className="btn btn-primary" onClick={handleSave}>
        {t.save}
      </button>
      {saved ? <p className="question-saved">{t.saved}</p> : <p className="question-note">{t.note}</p>}
    </div>
  );
}
