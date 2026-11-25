"use client";

import { useEffect } from "react";

// Google Analytics 4 और Google Tag Manager — केवल तभी चलेंगे जब Vercel में ID डाली हो:
//   NEXT_PUBLIC_GA4_ID  (जैसे G-XXXXXXX)    NEXT_PUBLIC_GTM_ID  (जैसे GTM-XXXXXXX)
const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const GTM = process.env.NEXT_PUBLIC_GTM_ID;

function add(src) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

export default function Analytics() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    if (GTM && !window.__ppGtm) {
      window.__ppGtm = true;
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      add(`https://www.googletagmanager.com/gtm.js?id=${GTM}`);
    }
    if (GA4 && !window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA4);
      add(`https://www.googletagmanager.com/gtag/js?id=${GA4}`);
    }
  }, []);
  return null;
}
