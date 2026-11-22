"use client";

import { useEffect, useState } from "react";
import { dailyQuestions } from "@/data/content";
import { questionForDate } from "@/lib/dates";

export default function TodayQuestion() {
  const [question, setQuestion] = useState(dailyQuestions[0]);
  const [dateText, setDateText] = useState("");

  useEffect(() => {
    const today = new Date();
    setQuestion(questionForDate(today));
    setDateText(
      today.toLocaleDateString("hi-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    );
  }, []);

  return (
    <div className="question-card">
      <span className="eyebrow">आज का प्रश्न</span>
      <p className="question-date">{dateText}</p>
      <h2 className="question-text serif">{question}</h2>
      <a href="/login" className="btn btn-primary">
        अपना उत्तर लिखें →
      </a>
      <p className="question-note">
        Google से Login करें — आपका उत्तर आपकी निजी डायरी में सुरक्षित रहेगा।
      </p>
    </div>
  );
}
