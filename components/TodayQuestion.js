"use client";

import { useEffect, useState } from "react";
import { dailyQuestions } from "@/data/content";
import { dailyQuestions as enQuestions } from "@/data/content.en";
import { dayOfYear, questionForDate } from "@/lib/dates";
import { ui } from "@/data/ui";

export default function TodayQuestion({ lang = "hi" }) {
  const en = lang === "en";
  const t = ui[en ? "en" : "hi"].q;
  const [question, setQuestion] = useState(en ? enQuestions[0] : dailyQuestions[0]);
  const [dateText, setDateText] = useState("");

  useEffect(() => {
    const today = new Date();
    // दोनों भाषाओं में उस दिन एक ही प्रश्न (क्रम content.js और content.en.js में एक जैसा)
    setQuestion(en ? enQuestions[dayOfYear(today) % enQuestions.length] : questionForDate(today));
    setDateText(today.toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, [en, t.locale]);

  return (
    <div className="question-card">
      <span className="eyebrow">{t.eyebrow}</span>
      <p className="question-date">{dateText}</p>
      <h2 className="question-text serif">{question}</h2>
      <a href="/login" className="btn btn-primary">
        {t.cta}
      </a>
      <p className="question-note">{t.note}</p>
    </div>
  );
}
