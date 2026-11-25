"use client";

import { drishta } from "@/data/drishta";
import { trackEvent } from "@/lib/track";

// "मूल्यांकन करवाएँ" जैसे बटन → नीचे फॉर्म पर, उद्देश्य पहले से चुना हुआ
export function PurposeButton({ purpose, className = "md-btn md-btn-primary", children }) {
  return (
    <a
      href={`#inquiry`}
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("drishta:purpose", { detail: purpose }));
        trackEvent("DrishtaCTA", { purpose });
      }}
    >
      {children}
    </a>
  );
}

// WhatsApp बटन — click भी track होता है (Meta Pixel + GA4)
export function WhatsAppButton({ place = "drishta", className = "md-btn md-btn-wa", children = "WhatsApp पर बात करें" }) {
  const text = "नमस्ते 🙏 मैं प्रकृति पथ – दृष्टा (संस्था का अवलोकन और विकास) के बारे में जानना चाहता/चाहती हूँ।";
  return (
    <a
      className={className}
      href={`https://wa.me/${drishta.whatsapp}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("WhatsAppClick", { place })}
    >
      {children}
    </a>
  );
}
