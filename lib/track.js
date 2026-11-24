// Ads tracking helpers — Meta (Facebook) Pixel

// Facebook ad के link से आए UTM / fbclid पकड़ें और 30 दिन याद रखें
export function captureUtm() {
  if (typeof window === "undefined") return {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
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

// Lead बनने पर Pixel को बताएँ — इसी से Facebook सही लोगों को ad दिखाना सीखता है
export function trackLead(eventId, extra = {}) {
  try {
    if (window.fbq) window.fbq("track", "Lead", { content_name: "Free Guidance Call", ...extra }, { eventID: eventId });
  } catch {}
}

export function trackEvent(name, data = {}) {
  try {
    if (window.fbq) window.fbq("trackCustom", name, data);
  } catch {}
}
