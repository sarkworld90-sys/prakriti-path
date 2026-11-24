"use client";

import { useEffect, useRef, useState } from "react";
import "./LanguageSwitcher.css";

// भाषाएँ — code वही जो Google Translate में है। क्रम/नाम यहीं बदलें।
const LANGS = [
  { code: "hi", label: "हिंदी", note: "मूल" },
  { code: "en", label: "English" },
  { code: "bho", label: "भोजपुरी" },
  { code: "mai", label: "मैथिली" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "ur", label: "اردو" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "ne", label: "नेपाली" },
];

const SOURCE = "hi"; // website की मूल भाषा

// visitor की चुनी भाषा — cookie "pp_lang" (server भी इसे पढ़ता है)
function currentLang() {
  const p = document.cookie.match(/(?:^|;\s*)pp_lang=([^;]+)/);
  if (p) return decodeURIComponent(p[1]);
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : SOURCE;
}

function setLangCookie(code) {
  document.cookie = `pp_lang=${code}; path=/; max-age=31536000; samesite=lax`;
}

// जिस पेज का अपना सही अनुवाद है (जैसे homepage का English), उस पर Google नहीं चलेगा
function pageHasNative(code) {
  return Boolean(document.querySelector(`[data-pp-native~="${code}"]`));
}

function setCookie(value) {
  const host = window.location.hostname;
  const domains = [""];
  // prakritipath.org पर Google दोनों तरह की cookie रखता है — दोनों साफ़/सेट करें
  if (host.includes(".") && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) domains.push(`; domain=.${host.replace(/^www\./, "")}`);
  domains.forEach((d) => {
    document.cookie = value
      ? `googtrans=/${SOURCE}/${value}; path=/${d}; max-age=31536000`
      : `googtrans=; path=/${d}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
}

// Google Translate पेज के शब्द बदल देता है, जिससे React कभी-कभी गड़बड़ा जाता है।
// यह छोटा सा सुधार उस गड़बड़ को रोकता है (React की जानी-मानी समस्या का प्रचलित हल)।
function patchDomForTranslate() {
  if (typeof Node === "undefined" || Node.prototype.__ppPatched) return;
  const remove = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) return child;
    return remove.call(this, child);
  };
  const insert = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (node, ref) {
    if (ref && ref.parentNode !== this) return node;
    return insert.call(this, node, ref);
  };
  Node.prototype.__ppPatched = true;
}

export default function LanguageSwitcher() {
  const [lang, setLang] = useState(SOURCE);
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const l = currentLang();
    setLang(l);
    if (l === SOURCE) return; // हिंदी में Google की ज़रूरत ही नहीं — पेज तेज़ रहेगा
    if (pageHasNative(l)) return; // इस पेज का अपना अनुवाद है

    patchDomForTranslate();
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: SOURCE, autoDisplay: false }, "pp-gt");
    };
    if (!document.getElementById("pp-gt-script")) {
      const s = document.createElement("script");
      s.id = "pp-gt-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  // बाहर click करने पर menu बंद
  useEffect(() => {
    if (!open) return;
    const close = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  function choose(code) {
    setOpen(false);
    if (code === lang) return;
    setLangCookie(code);
    setCookie(code === SOURCE ? null : code);
    window.location.reload();
  }

  const cur = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <div className="pp-lang notranslate" translate="no" ref={box}>
      <div id="pp-gt" style={{ display: "none" }} />
      {open && (
        <div className="pp-lang-menu" role="menu">
          <p className="pp-lang-head">भाषा चुनें · Choose language</p>
          <div className="pp-lang-grid">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                role="menuitemradio"
                aria-checked={l.code === lang}
                className={`pp-lang-item ${l.code === lang ? "pp-lang-on" : ""}`}
                onClick={() => choose(l.code)}
              >
                {l.label}
                {l.note && <small>{l.note}</small>}
              </button>
            ))}
          </div>
          <p className="pp-lang-note">
            Homepage का English हमारा अपना अनुवाद है। बाकी भाषाएँ Google द्वारा अपने-आप अनुवादित हैं।
          </p>
        </div>
      )}
      <button
        type="button"
        className="pp-lang-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden>🌐</span> {cur.label} <span aria-hidden className="pp-lang-caret">▾</span>
      </button>
    </div>
  );
}
