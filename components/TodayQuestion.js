"use client";

import { useEffect, useState } from "react";
import { dailyQuestions } from "@/data/content";

// साल के दिन के हिसाब से हर दिन एक नया प्रश्न चुनता है।
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

export default function TodayQuestion() {
  const [question, setQuestion] = useState(dailyQuestions[0]);
  const [dateText, setDateText] = useState("");
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const today = new Date();
    setQuestion(dailyQuestions[getDayOfYear(today) % dailyQuestions.length]);
    setDateText(
      today.toLocaleDateString("hi-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    );
    // पहले लिखा उत्तर इसी browser में वापस दिखाएँ (Login आने तक अस्थायी)
    try {
      const key = "pp-answer-" + today.toDateString();
      const old = localStorage.getItem(key);
      if (old) setAnswer(old);
    } catch {}
  }, []);

  function handleSave() {
    if (!answer.trim()) return;
    try {
      localStorage.setItem("pp-answer-" + new Date().toDateString(), answer);
    } catch {}
    setSaved(true);
  }

  return (
    <div className="question-card">
      <span className="eyebrow">आज का प्रश्न</span>
      <p className="question-date">{dateText}</p>
      <h2 className="question-text serif">{question}</h2>
      <textarea
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setSaved(false);
        }}
        placeholder="कुछ पल रुकिए… और ईमानदारी से लिखिए।"
        aria-label="आज का उत्तर"
      />
      <button className="btn btn-primary" onClick={handleSave}>
        आज का उत्तर सहेजें
      </button>
      {saved ? (
        <p className="question-saved">✓ आपका उत्तर इस डिवाइस पर सहेज लिया गया है।</p>
      ) : (
        <p className="question-note">
          आपका उत्तर केवल आपका है — यह किसी के साथ साझा नहीं होता।
        </p>
      )}
    </div>
  );
}
