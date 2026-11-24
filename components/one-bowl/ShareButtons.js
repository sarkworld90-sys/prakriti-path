"use client";

import { useEffect, useState } from "react";
import { campaign } from "@/data/oneBowl";

export default function ShareButtons({ refCode = "" }) {
  const [link, setLink] = useState(`https://${campaign.website}${campaign.path}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const base = `${window.location.origin}${campaign.path}`;
    setLink(refCode ? `${base}?ref=${encodeURIComponent(refCode)}` : base);
  }, [refCode]);

  const text =
    `🌍 *${campaign.name}* — ${campaign.tagline}\n\n` +
    `इस गर्मी पक्षियों और जीवों के लिए अपने घर, छत या दुकान पर एक कटोरी पानी रखें। ` +
    `मैंने संकल्प लिया है, आप भी जुड़ें 👇\n${link}\n\n— ${campaign.by}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="ob-share">
      <a
        className="ob-btn ob-btn-wa"
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp पर भेजें
      </a>
      <button type="button" className="ob-btn ob-btn-ghost" onClick={copy}>
        {copied ? "✓ लिंक कॉपी हुआ" : "लिंक कॉपी करें"}
      </button>
    </div>
  );
}
