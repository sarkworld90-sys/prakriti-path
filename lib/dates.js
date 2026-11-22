import { dailyQuestions } from "@/data/content";

// आज की तारीख "2026-11-22" के रूप में (User के अपने समय के अनुसार)
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

export function questionForDate(date = new Date()) {
  return dailyQuestions[dayOfYear(date) % dailyQuestions.length];
}

export function hindiDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// लगातार कितने दिन लिखा (आज या कल तक)
export function calcStreak(dateKeys) {
  const set = new Set(dateKeys);
  const cursor = new Date();
  if (!set.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(todayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
