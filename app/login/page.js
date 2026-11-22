"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, readAuthError } from "@/lib/supabase";
import { site } from "@/data/content";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // पहले से Login है तो सीधे Dashboard
  useEffect(() => {
    const err = readAuthError();
    if (err) setError("Login में समस्या: " + err);
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setError("Login में समस्या: " + error.message);
      else if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  async function loginWithGoogle() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      console.error(error);
      setError("Login शुरू नहीं हो सका। कृपया फिर कोशिश करें।");
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <a href="/" className="logo serif auth-logo">
          <img src="/images/logo-mark.webp" alt="" className="logo-img" />
          {site.name}
        </a>
        <h1 className="serif">अपनी यात्रा में आपका स्वागत है</h1>
        <p className="auth-lead">
          Login करके हर दिन का प्रश्न लिखें, अपनी डायरी सहेजें और अपनी प्रगति देखें।
        </p>

        <button className="btn-google" onClick={loginWithGoogle} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          {loading ? "Google खुल रहा है…" : "Google से Login करें"}
        </button>

        {error && <p className="join-error" style={{ marginTop: 16 }}>{error}</p>}

        <p className="auth-privacy">
          🔒 आपकी डायरी निजी है — आपके अलावा कोई दूसरा User इसे नहीं देख सकता।
          <br />
          Login करके आप हमारी <a href="/terms">उपयोग की शर्तों</a> और <a href="/privacy">गोपनीयता नीति</a> से सहमत होते हैं।
        </p>
      </div>
    </main>
  );
}
