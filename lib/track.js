// Ads tracking helpers — Meta (Facebook) Pixel

// Facebook ad के link से आए UTM / fbclid पकड़ें और 30 दिन याद रखें
export function captureUtm() {
  if (typeof window === "undefined") return {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
  try {
    const q = new URLSearchParams(window.location.search);
    const fresh = {};
    keys.forEach((k) => q.get(k) && (fresh[k] = q.get(k).slice(0, 200)));
    if (Object.keys(fresh).length) {
      localStorage.setItem("pp_utm", JSON.stringify({ ...fresh, _t: Date.now() }));
      return fresh;
    }
    const old = JSON.parse(localStorage.getItem("pp_utm") || "null");
    if (old && Date.now() - old._t < 30 * 86400000) {
      delete old._t;
      return old;
    }
  } catch {}
  return {};
}

// Google Analytics 4 / Tag Manager — जो लगा हो उसे event भेजें
function toGoogle(event, data) {
  try {
    if (window.gtag) window.gtag("event", event, data);
    else if (window.dataLayer) window.dataLayer.push({ event, ...data });
  } catch {}
}

// Lead बनने पर Pixel और Google को बताएँ — इसी से ads सही लोगों को दिखाना सीखते हैं
export function trackLead(eventId, extra = {}) {
  try {
    if (window.fbq) window.fbq("track", "Lead", { content_name: "Free Guidance Call", ...extra }, { eventID: eventId });
  } catch {}
  toGoogle("generate_lead", { lead_id: eventId, ...extra });
}

export function trackEvent(name, data = {}) {
  try {
    if (window.fbq) {
      if (name === "WhatsAppClick") window.fbq("track", "Contact", data);
      else window.fbq("trackCustom", name, data);
    }
  } catch {}
  toGoogle(name === "WhatsAppClick" ? "whatsapp_click" : name, data);
}
