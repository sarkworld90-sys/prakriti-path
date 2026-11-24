"use client";

import { SUB_CAMPAIGNS } from "@/data/oneBowl";

// कार्ड पर क्लिक → नीचे Join form खुले और सही प्रकार (स्कूल/ऑफ़िस/दुकान) पहले से चुना हो
const TYPE_FOR = { "One School One Bowl": "school", "One Office One Bowl": "office", "One Shop One Bowl": "shop" };

export default function SubCampaigns() {
  function go(title) {
    const type = TYPE_FOR[title];
    if (type) window.dispatchEvent(new CustomEvent("obw:type", { detail: type }));
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="ob-subs">
      {SUB_CAMPAIGNS.map((c) => (
        <button type="button" key={c.title} className="ob-sub" onClick={() => go(c.title)}>
          <span className="ob-sub-icon" aria-hidden>
            {c.icon}
          </span>
          <b>{c.title}</b>
          <span>{c.text}</span>
          <span className="ob-sub-cta">जुड़ें →</span>
        </button>
      ))}
    </div>
  );
}
