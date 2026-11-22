"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, readAuthError } from "@/lib/supabase";
import { site } from "@/data/content";
import { todayKey, questionForDate, hindiDate, calcStreak } from "@/lib/dates";

const MOODS = [
  { key: "shant", icon: "😌", label: "शांत" },
  { key: "khush", icon: "😊", label: "खुश" },
  { key: "samanya", icon: "😐", label: "सामान्य" },
  { key: "udas", icon: "😔", label: "उदास" },
  { key: "gussa", icon: "😠", label: "गुस्सा" },
  { key: "chintit", icon: "😟", label: "चिंतित" },
];
const moodOf = (k) => MOODS.find((m) => m.key === k);

const EMPTY = { answer: "", mood: "", learned: "", action: "" };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("loading"); // loading | ready | saving | saved | error
  const [openId, setOpenId] = useState(null);

  const today = todayKey();
  const question = questionForDate();

  // ===== Login जाँच + डेटा लोड =====
  useEffect(() => {
    let active = true;

    async function load(session) {
      if (!session) {
        // Google से लौटते समय कोई गलती आई हो तो उसे Login पेज पर दिखाएँ
        const err = readAuthError();
        router.replace(err ? `/login?error_description=${encodeURIComponent(err)}` : "/login");
        return;
      }
      // URL से ?code= हटा दें ताकि Refresh करने पर दिक्कत न हो
      if (window.location.search || window.location.hash) {
        window.history.replaceState(null, "", "/dashboard");
      }
      const u = session.user;
      setUser(u);
      setName(u.user_metadata?.full_name || u.user_metadata?.name || "मित्र");

      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", u.id).maybeSingle();
      if (profile?.full_name && active) setName(profile.full_name);

      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .order("entry_date", { ascending: false })
        .limit(400);
      if (!active) return;
      if (error) {
        console.error(error);
        setStatus("error");
        return;
      }
      setEntries(data || []);
      const todays = (data || []).find((e) => e.entry_date === today);
      if (todays) {
        setForm({
          answer: todays.answer || "",
          mood: todays.mood || "",
          learned: todays.learned || "",
          action: todays.action || "",
        });
      }
      setStatus("ready");
    }

    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/login");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [router, today]);

  // ===== आँकड़े =====
  const stats = useMemo(() => {
    const keys = entries.map((e) => e.entry_date);
    const joined = user ? new Date(user.created_at) : new Date();
    const daysJoined = Math.max(1, Math.floor((Date.now() - joined.getTime()) / 86400000) + 1);
    return { total: entries.length, streak: calcStreak(keys), daysJoined };
  }, [entries, user]);

  const writtenToday = entries.some((e) => e.entry_date === today);
  const firstName = name.split(" ")[0];

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (status === "saved" || status === "error") setStatus("ready");
  }

  // ===== सहेजें =====
  async function save() {
    if (!form.answer.trim() || !user) return;
    setStatus("saving");
    const row = {
      user_id: user.id,
      entry_date: today,
      question,
      answer: form.answer.trim(),
      mood: form.mood || null,
      learned: form.learned.trim() || null,
      action: form.action.trim() || null,
    };
    const { data, error } = await supabase
      .from("journals")
      .upsert(row, { onConflict: "user_id,entry_date" })
      .select()
      .single();
    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }
    setEntries((list) => [data, ...list.filter((e) => e.entry_date !== today)]);
    setStatus("saved");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (status === "loading") {
    return (
      <main className="auth-page">
        <p className="dash-loading">🌱 आपकी यात्रा खुल रही है…</p>
      </main>
    );
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="/" className="logo serif">
            <span className="logo-mark">प</span>
            {site.name}
          </a>
          <div className="dash-user">
            {user?.user_metadata?.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt="" className="dash-avatar" referrerPolicy="no-referrer" />
            )}
            <button className="btn btn-outline dash-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dash">
        <div className="container">
          {/* ===== Greeting ===== */}
          <section className="dash-hello">
            <p className="eyebrow">{hindiDate(today)}</p>
            <h1 className="serif">नमस्ते, {firstName} 🙏</h1>
            <p className="section-lead">
              {writtenToday
                ? "आज का चिंतन पूरा हुआ। चाहें तो इसमें और जोड़ सकते हैं।"
                : "कुछ पल अपने लिए निकालिए। आज का प्रश्न आपकी प्रतीक्षा कर रहा है।"}
            </p>
          </section>

          {/* ===== Progress ===== */}
          <section className="dash-stats">
            <div className="stat">
              <span className="stat-num serif">{stats.streak}</span>
              <span className="stat-label">लगातार दिन 🔥</span>
            </div>
            <div className="stat">
              <span className="stat-num serif">{stats.total}</span>
              <span className="stat-label">कुल चिंतन ✍️</span>
            </div>
            <div className="stat">
              <span className="stat-num serif">{stats.daysJoined}</span>
              <span className="stat-label">दिन से यात्रा में 🌱</span>
            </div>
          </section>

          {/* ===== आज का प्रश्न ===== */}
          <section className="dash-card">
            <span className="eyebrow">आज का प्रश्न</span>
            <h2 className="question-text serif dash-question">{question}</h2>

            <label className="dash-label">मेरा उत्तर *</label>
            <textarea
              className="dash-textarea"
              value={form.answer}
              onChange={(e) => update("answer", e.target.value)}
              placeholder="कुछ पल रुकिए… और ईमानदारी से लिखिए।"
              rows={6}
            />

            <label className="dash-label">आज मैं कैसा महसूस कर रहा/रही हूँ?</label>
            <div className="mood-row">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m.key}
                  className={`mood ${form.mood === m.key ? "mood-on" : ""}`}
                  onClick={() => update("mood", form.mood === m.key ? "" : m.key)}
                >
                  <span className="mood-icon">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            <div className="dash-two">
              <div>
                <label className="dash-label">आज मैंने क्या सीखा?</label>
                <textarea
                  className="dash-textarea"
                  rows={3}
                  value={form.learned}
                  onChange={(e) => update("learned", e.target.value)}
                  placeholder="वैकल्पिक"
                />
              </div>
              <div>
                <label className="dash-label">कल मैं क्या करूँगा/करूँगी?</label>
                <textarea
                  className="dash-textarea"
                  rows={3}
                  value={form.action}
                  onChange={(e) => update("action", e.target.value)}
                  placeholder="वैकल्पिक"
                />
              </div>
            </div>

            <div className="dash-save">
              <button
                className="btn btn-primary"
                onClick={save}
                disabled={status === "saving" || !form.answer.trim()}
              >
                {status === "saving" ? "सहेज रहे हैं…" : writtenToday ? "बदलाव सहेजें" : "आज का चिंतन सहेजें"}
              </button>
              {status === "saved" && <span className="question-saved">✓ आपकी डायरी में सुरक्षित सहेज लिया गया।</span>}
              {status === "error" && <span className="join-error">कुछ गड़बड़ हुई। कृपया फिर कोशिश करें।</span>}
            </div>
            <p className="question-note">🔒 यह केवल आपकी डायरी है — कोई दूसरा User इसे नहीं देख सकता।</p>
          </section>

          {/* ===== मेरी डायरी ===== */}
          <section className="diary">
            <h2 className="section-title">मेरी डायरी</h2>
            {entries.length === 0 ? (
              <p className="section-lead">आपकी डायरी का पहला पन्ना आज लिखा जाएगा। 🌱</p>
            ) : (
              <div className="diary-list">
                {entries.map((e) => {
                  const open = openId === e.id;
                  const m = moodOf(e.mood);
                  return (
                    <article key={e.id} className={`diary-item ${open ? "diary-open" : ""}`}>
                      <button className="diary-head" onClick={() => setOpenId(open ? null : e.id)}>
                        <span className="diary-date">{hindiDate(e.entry_date)}</span>
                        <span className="diary-q">{e.question}</span>
                        <span className="diary-mood">{m ? m.icon : ""}</span>
                      </button>
                      {open && (
                        <div className="diary-body">
                          <p className="diary-answer">{e.answer}</p>
                          {e.learned && (
                            <p>
                              <strong>सीखा:</strong> {e.learned}
                            </p>
                          )}
                          {e.action && (
                            <p>
                              <strong>करूँगा/करूँगी:</strong> {e.action}
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <p className="dash-help">
            यदि आप बहुत अधिक परेशान, अकेला या असहाय महसूस कर रहे हैं, तो किसी अपने से बात करें या Tele-MANAS
            की निःशुल्क हेल्पलाइन <strong>14416</strong> पर कॉल करें — यह 24 घंटे उपलब्ध है।
          </p>
        </div>
      </main>
    </>
  );
}
