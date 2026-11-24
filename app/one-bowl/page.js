import "./one-bowl.css";
import { campaign, STEPS, LEVELS, GALLERY, VIDEOS } from "@/data/oneBowl";
import ImpactDashboard from "@/components/one-bowl/ImpactDashboard";
import JoinCampaignForm, { BowlPhotoUpload } from "@/components/one-bowl/JoinCampaignForm";
import AmbassadorForm from "@/components/one-bowl/AmbassadorForm";
import SubCampaigns from "@/components/one-bowl/SubCampaigns";
import ShareButtons from "@/components/one-bowl/ShareButtons";

export const metadata = {
  title: "One Bowl of Water — एक कटोरी पानी, एक जीवन के नाम | Prakriti Path",
  description:
    "Prakriti Path का राष्ट्रीय अभियान: पक्षियों और जीवों के लिए अपने घर, छत, स्कूल या दुकान पर एक कटोरी पानी रखें। संकल्प लें, फोटो भेजें, Ambassador बनें।",
  alternates: { canonical: `https://${campaign.website}${campaign.path}` },
  openGraph: {
    title: "One Bowl of Water — एक कटोरी पानी, एक जीवन के नाम",
    description: "पक्षियों के लिए एक कटोरी पानी रखें और अभियान से जुड़ें। — Prakriti Path",
    url: `https://${campaign.website}${campaign.path}`,
    siteName: "Prakriti Path",
    locale: "hi_IN",
    type: "website",
  },
};

function BowlArt() {
  return (
    <svg className="ob-art" viewBox="0 0 320 240" role="img" aria-label="मिट्टी की कटोरी में पानी पीती चिड़िया">
      <ellipse cx="160" cy="214" rx="120" ry="10" fill="#000" opacity=".08" />
      {/* कटोरी */}
      <path d="M58 150 Q160 150 262 150 Q252 206 160 210 Q68 206 58 150Z" fill="#B5582E" />
      <path d="M70 170 Q160 178 250 170" stroke="#8E3F1E" strokeWidth="3" fill="none" opacity=".5" />
      <ellipse cx="160" cy="150" rx="102" ry="20" fill="#9A4523" />
      <ellipse cx="160" cy="152" rx="92" ry="15" fill="#3E9BD4" />
      <ellipse cx="135" cy="149" rx="30" ry="4" fill="#fff" opacity=".45" />
      {/* चिड़िया */}
      <g transform="translate(196 78)">
        <path d="M0 40 Q-8 10 22 4 Q52 0 58 28 Q60 52 34 58 Q10 60 0 40Z" fill="#6B4E3D" />
        <path d="M8 44 Q20 24 44 30 Q40 52 20 54Z" fill="#E8D3B8" />
        <path d="M30 14 Q56 10 62 34 Q46 22 30 26Z" fill="#4E382B" />
        <circle cx="12" cy="20" r="3.2" fill="#1d1d1d" />
        <path d="M2 24 L-16 44 L0 30Z" fill="#E2A33C" />
        <path d="M58 30 L84 22 L70 40Z" fill="#4E382B" />
        <path d="M24 58 L20 74 M38 58 L40 74" stroke="#E2A33C" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* बूँदें */}
      <path d="M100 74 q8 12 0 18 q-8 -6 0 -18Z" fill="#3E9BD4" opacity=".7" />
      <path d="M126 46 q6 9 0 14 q-6 -5 0 -14Z" fill="#3E9BD4" opacity=".5" />
    </svg>
  );
}

export default function OneBowlPage() {
  return (
    <main className="ob">
      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="ob-hero">
        <div className="ob-wrap ob-hero-in">
          <div>
            <p className="ob-kicker">Prakriti Path का राष्ट्रीय अभियान 🌍</p>
            <h1 className="ob-title">
              ONE BOWL
              <br />
              OF WATER
            </h1>
            <p className="ob-tagline serif">{campaign.tagline}</p>
            <p className="ob-lead">
              तपती गर्मी में एक चिड़िया के लिए पानी की कुछ बूँदें जीवन और मृत्यु का अंतर बन सकती हैं। अपने घर, छत, बालकनी,
              स्कूल, ऑफ़िस या दुकान पर <b>एक कटोरी पानी</b> रखिए — और इस संकल्प को अपने गाँव, शहर और देश तक पहुँचाइए।
            </p>
            <div className="ob-cta">
              <a href="#join" className="ob-btn ob-btn-water">
                अभियान से जुड़ें 💧
              </a>
              <a href="#ambassador" className="ob-btn ob-btn-ghost">
                Ambassador बनें 🎖️
              </a>
            </div>
          </div>
          <BowlArt />
        </div>
      </section>

      {/* ── 2. NATIONAL IMPACT DASHBOARD ───────────────────── */}
      <section className="ob-sec ob-sec-tint" id="impact">
        <div className="ob-wrap">
          <p className="ob-eyebrow">National Impact Dashboard</p>
          <h2 className="ob-h2 serif">देश भर में अभियान की असली तस्वीर</h2>
          <p className="ob-sub-lead">सभी आँकड़े सीधे Database से आते हैं और अपने-आप अपडेट होते हैं।</p>
          <ImpactDashboard />
        </div>
      </section>

      {/* ── 3. उद्देश्य ───────────────────────────────────────── */}
      <section className="ob-sec">
        <div className="ob-wrap ob-two">
          <div>
            <p className="ob-eyebrow">अभियान का उद्देश्य</p>
            <h2 className="ob-h2 serif">एक छोटा-सा काम, जो प्रकृति से हमारा रिश्ता फिर जोड़ दे</h2>
          </div>
          <div className="ob-prose">
            <p>
              शहरों में तालाब, कुएँ और खुले जलस्रोत कम होते जा रहे हैं। गर्मियों में पक्षी, गिलहरियाँ और छोटे जीव पानी की तलाश
              में भटकते हैं। <b>One Bowl of Water</b> का विचार सरल है — हर घर, हर संस्था एक कटोरी पानी की ज़िम्मेदारी ले।
            </p>
            <p>
              यह केवल पानी रखने का अभियान नहीं, बल्कि <b>प्रकृति पथ</b> की उस सोच का हिस्सा है जो कहती है कि अपनी प्रकृति को
              पहचानने का रास्ता बाहर की प्रकृति की देखभाल से होकर जाता है।
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. कैसे करें ─────────────────────────────────────── */}
      <section className="ob-sec ob-sec-tint">
        <div className="ob-wrap">
          <p className="ob-eyebrow">कैसे करें</p>
          <h2 className="ob-h2 serif">चार आसान कदम</h2>
          <ol className="ob-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="ob-step">
                <span className="ob-step-n">{i + 1}</span>
                <span className="ob-step-icon" aria-hidden>
                  {s.icon}
                </span>
                <b>{s.title}</b>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 5. JOIN CAMPAIGN ─────────────────────────────────── */}
      <section className="ob-sec" id="join">
        <div className="ob-wrap ob-narrow">
          <p className="ob-eyebrow">Join Campaign</p>
          <h2 className="ob-h2 serif">संकल्प लें — अपनी Campaign ID पाएँ</h2>
          <p className="ob-sub-lead">एक मिनट का फॉर्म। जुड़ते ही आपको Unique Campaign ID मिलेगी और आप अपनी कटोरी की फोटो भेज सकेंगे।</p>
          <JoinCampaignForm />

          <details className="ob-details">
            <summary>पहले से जुड़े हैं? अपनी Campaign ID से कटोरी की फोटो भेजें</summary>
            <BowlPhotoUpload />
          </details>
        </div>
      </section>

      {/* ── 6. विशेष अभियान ──────────────────────────────────── */}
      <section className="ob-sec ob-sec-tint">
        <div className="ob-wrap">
          <p className="ob-eyebrow">विशेष अभियान</p>
          <h2 className="ob-h2 serif">हर जगह एक कटोरी</h2>
          <SubCampaigns />
        </div>
      </section>

      {/* ── 7. AMBASSADOR ────────────────────────────────────── */}
      <section className="ob-sec" id="ambassador">
        <div className="ob-wrap ob-two ob-two-top">
          <div>
            <p className="ob-eyebrow">Become an Ambassador</p>
            <h2 className="ob-h2 serif">अपने क्षेत्र में अभियान का नेतृत्व करें</h2>
            <p className="ob-prose">
              Ambassador अपने क्षेत्र में लोगों को जोड़ते हैं, कटोरियाँ रखवाते हैं और उनकी रिपोर्ट भेजते हैं। स्वीकृति के बाद हर
              Ambassador को मिलता है:
            </p>
            <ul className="ob-perks">
              <li>🆔 Unique Ambassador ID और Digital ID Card</li>
              <li>🔳 अपना QR Code और Referral Link</li>
              <li>📊 अपना Dashboard — Reach, Pledge, Reported, Verified</li>
              <li>🏅 Digital Certificate</li>
            </ul>
            <div className="ob-ladder" aria-label="Ambassador Hierarchy">
              {LEVELS.map((l, i) => (
                <div key={l.key} className="ob-rung" style={{ "--i": i }}>
                  <span>{l.label}</span>
                  <small>{l.hi}</small>
                </div>
              ))}
            </div>
          </div>
          <AmbassadorForm />
        </div>
      </section>

      {/* ── 8. तस्वीरें और वीडियो ───────────────────────────── */}
      <section className="ob-sec ob-sec-tint">
        <div className="ob-wrap">
          <p className="ob-eyebrow">तस्वीरें और वीडियो</p>
          <h2 className="ob-h2 serif">अभियान की झलकियाँ</h2>
          {GALLERY.length + VIDEOS.length === 0 ? (
            <div className="ob-empty">
              <span aria-hidden>🕊️</span>
              <p>
                पहली तस्वीरें जल्द ही यहाँ होंगी — आपकी कटोरी की फोटो भी इनमें हो सकती है!{" "}
                <a href={campaign.youtube} target="_blank" rel="noopener noreferrer">
                  YouTube पर Prakriti Path देखें →
                </a>
              </p>
            </div>
          ) : (
            <div className="ob-gallery">
              {VIDEOS.map((v) => (
                <div key={v} className="ob-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v}`}
                    title="One Bowl of Water वीडियो"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              ))}
              {GALLERY.map((g) => (
                <figure key={g.src}>
                  <img src={g.src} alt={g.caption} loading="lazy" />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 9. SHARE + ATTRIBUTION ──────────────────────────── */}
      <section className="ob-final">
        <div className="ob-wrap ob-narrow">
          <h2 className="serif">एक कटोरी पानी – एक जीवन के नाम</h2>
          <p>यह संदेश जितने लोगों तक पहुँचेगा, उतने ही जीवन बचेंगे।</p>
          <ShareButtons />
          <p className="ob-attrib">
            <b>ONE BOWL OF WATER</b> · {campaign.by} · By {campaign.founder} ·{" "}
            <a href="/">{campaign.website}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
