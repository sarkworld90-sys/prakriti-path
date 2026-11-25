import "../margdarshan/margdarshan.css";
import "../drishta.css";
import { drishta, ORG_TYPES, SERVICES, BY_SECTOR, METHOD, REPORT, DIGITAL } from "@/data/drishta";
import DrishtaForm from "@/components/DrishtaForm";
import { PurposeButton, WhatsAppButton } from "@/components/DrishtaActions";

export const metadata = {
  title: "प्रकृति पथ – दृष्टा | संस्था का अवलोकन, मूल्यांकन और विकास योजना — Organizational Assessment",
  description:
    "स्कूल, कॉलेज, NGO, Trust, अस्पताल, कंपनी और सरकारी प्रोजेक्ट के लिए निष्पक्ष संस्थागत अवलोकन, मूल्यांकन, लागत अनुकूलन, HR, तकनीक और विकास योजना। संस्था को बदलने से पहले, उसे समझिए। — Amresh Kumar Rudra",
  alternates: { canonical: "https://prakritipath.org/drishta" },
  openGraph: {
    title: "प्रकृति पथ – दृष्टा · Organizational Observation & Development",
    description: "संस्था को बदलने से पहले, उसे समझिए। निष्पक्ष अवलोकन, तथ्य-आधारित मूल्यांकन और व्यावहारिक विकास योजना।",
    url: "https://prakritipath.org/drishta",
    siteName: "Prakriti Path",
    locale: "hi_IN",
    type: "website",
  },
};

function Eye() {
  return (
    <svg className="dr-eye" viewBox="0 0 320 260" role="img" aria-label="संस्था को ध्यान से देखती एक दृष्टि">
      <circle cx="160" cy="130" r="118" fill="#e8f1ea" />
      <path d="M40 130 C 90 60, 230 60, 280 130 C 230 200, 90 200, 40 130Z" fill="#fff" stroke="#1f3d2f" strokeWidth="6" />
      <circle cx="160" cy="130" r="44" fill="#2f5d46" />
      <circle cx="160" cy="130" r="20" fill="#1f3d2f" />
      <circle cx="148" cy="118" r="8" fill="#fff" opacity=".9" />
      {/* संस्था के छोटे भवन */}
      <g fill="#e2a33c">
        <rect x="58" y="214" width="26" height="30" rx="3" />
        <rect x="92" y="200" width="30" height="44" rx="3" />
        <rect x="198" y="206" width="30" height="38" rx="3" />
        <rect x="236" y="218" width="24" height="26" rx="3" />
      </g>
      <path d="M134 230 h52 v14 h-52z M146 206 l14 -14 l14 14z M140 206 h40 v24 h-40z" fill="#b5582e" />
    </svg>
  );
}

export default function DrishtaPage() {
  return (
    <main className="md dr">
      {/* ── HERO ── */}
      <section className="md-hero">
        <div className="md-wrap md-hero-in">
          <div>
            <p className="md-kicker">
              PRAKRITI PATH – दृष्टा · {drishta.en}
            </p>
            <h1 className="md-title serif">
              आपकी संस्था को
              <br />
              <span>एक नई दृष्टि की आवश्यकता है।</span>
            </h1>
            <p className="md-lead">
              हम आपकी संस्था की कार्यप्रणाली, प्रबंधन, मानव संसाधन, वित्तीय व्यवस्था, तकनीक, संसाधनों और भविष्य की संभावनाओं का
              अध्ययन करते हैं।
            </p>
            <p className="md-lead" style={{ marginTop: 10 }}>
              हमारा उद्देश्य केवल कमियाँ निकालना नहीं, बल्कि संस्था की <b>वास्तविक क्षमताओं</b> और <b>विकास के अवसरों</b> को
              पहचानना है।
            </p>
            <div className="md-cta">
              <PurposeButton purpose="assessment">अपनी संस्था का मूल्यांकन करवाएँ →</PurposeButton>
              <PurposeButton purpose="consultation" className="md-btn md-btn-ghost">
                Consultation के लिए संपर्क करें
              </PurposeButton>
            </div>
            <p className="dr-motto serif">“{drishta.motto}”</p>
          </div>
          <Eye />
        </div>
      </section>

      {/* ── किन संस्थाओं को ── */}
      <section className="md-sec md-sec-tint" id="sansthayen">
        <div className="md-wrap">
          <p className="md-eyebrow">हम किन संस्थाओं को सेवाएँ देते हैं?</p>
          <h2 className="md-h2 serif">छोटी दुकान से बड़े उद्यम तक — हर संस्था की अपनी प्रकृति है</h2>
          <div className="dr-types">
            {ORG_TYPES.map((t) => (
              <div key={t.key} className="dr-type">
                <span className="dr-type-icon" aria-hidden>
                  {t.icon}
                </span>
                <b>{t.title}</b>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── मुख्य सेवाएँ ── */}
      <section className="md-sec" id="sevayen">
        <div className="md-wrap">
          <p className="md-eyebrow">हमारी मुख्य सेवाएँ</p>
          <h2 className="md-h2 serif">किसको क्या मिलेगा?</h2>
          <div className="dr-services">
            {SERVICES.map((s) => (
              <article key={s.key} className="dr-service">
                <div className="dr-service-head">
                  <span className="dr-tag">{s.tag}</span>
                  <div>
                    <h3 className="serif">{s.title}</h3>
                    <p>{s.hi}</p>
                  </div>
                </div>
                <p className="dr-gets">संस्था को मिलेगा:</p>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="dr-inline-cta">
            <PurposeButton purpose="assessment">अपनी संस्था का मूल्यांकन करवाएँ →</PurposeButton>
          </div>
        </div>
      </section>

      {/* ── संस्था-वार ── */}
      <section className="md-sec md-sec-tint">
        <div className="md-wrap">
          <p className="md-eyebrow">अलग-अलग संस्थाओं को मिलने वाली सेवाएँ</p>
          <h2 className="md-h2 serif">आपकी संस्था के लिए क्या खास है</h2>
          <div className="dr-sectors">
            {BY_SECTOR.map((s) => (
              <details key={s.title} className="dr-sector" open>
                <summary>
                  <span aria-hidden>{s.icon}</span> {s.title}
                </summary>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <p className="md-small dr-note">
            इन सेवाओं को संगठन की वास्तविक आवश्यकता और विशेषज्ञता के अनुसार प्रस्तावित किया जाएगा।
          </p>
        </div>
      </section>

      {/* ── कार्यप्रणाली ── */}
      <section className="md-sec md-org">
        <div className="md-wrap">
          <p className="md-eyebrow md-eyebrow-light">हमारी कार्यप्रणाली</p>
          <h2 className="md-h2 serif">सात चरण — देखने से विकास तक</h2>
          <ol className="dr-method">
            {METHOD.map((m, i) => (
              <li key={m.en}>
                <span className="dr-step-n">{i + 1}</span>
                <b>{m.en}</b>
                <span>{m.hi}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── रिपोर्ट ── */}
      <section className="md-sec">
        <div className="md-wrap md-two md-two-top">
          <div>
            <p className="md-eyebrow">संस्था को कौन-सी रिपोर्ट मिलेगी?</p>
            <h2 className="md-h2 serif">Professional Organizational Development Report</h2>
            <p className="md-prose" style={{ marginTop: 12 }}>
              अध्ययन के अंत में आपकी संस्था को एक विस्तृत रिपोर्ट मिलेगी, जिसमें शामिल होंगे:
            </p>
            <ul className="dr-report-list">
              {REPORT.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="md-small dr-note">
              वास्तविक रिपोर्ट आपकी संस्था के अध्ययन, बातचीत और उपलब्ध प्रमाणों के आधार पर ही तैयार होगी। दाईं ओर का डिज़ाइन केवल एक
              नमूना है।
            </p>
          </div>

          <div className="dr-sample" aria-label="नमूना रिपोर्ट का डिज़ाइन">
            <div className="dr-sample-mark">नमूना · SAMPLE</div>
            <div className="dr-sample-cover">
              <p>PRAKRITI PATH – दृष्टा</p>
              <h3 className="serif">Organizational Development Report</h3>
              <span>संस्था: [संस्था का नाम] · अवधि: [अध्ययन की अवधि]</span>
            </div>
            <div className="dr-sample-body">
              <p className="dr-sample-h">1. Organization Overview</p>
              <div className="dr-line" style={{ width: "92%" }} />
              <div className="dr-line" style={{ width: "78%" }} />
              <p className="dr-sample-h">3. Department-wise Analysis</p>
              <div className="dr-bars">
                {["प्रशासन", "संचालन", "HR", "वित्त", "तकनीक"].map((d) => (
                  <div key={d} className="dr-bar">
                    <span>{d}</span>
                    <i />
                  </div>
                ))}
              </div>
              <p className="dr-sample-h">10. 90-Day Action Plan</p>
              <div className="dr-plan">
                <div>
                  <b>0–30 दिन</b>
                  <div className="dr-line" />
                </div>
                <div>
                  <b>31–60 दिन</b>
                  <div className="dr-line" />
                </div>
                <div>
                  <b>61–90 दिन</b>
                  <div className="dr-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Digital ── */}
      <section className="md-sec md-sec-tint">
        <div className="md-wrap">
          <p className="md-eyebrow">Digital Communication और Engagement</p>
          <h2 className="md-h2 serif">अपनी टीम, सदस्यों और लोगों से डिजिटल रूप से जुड़ें</h2>
          <p className="md-sub-lead">
            जो सुविधाएँ अभी तैयार हो रही हैं, उन पर <b>Coming Soon</b> लिखा है। उपलब्ध सुविधाओं पर click करके उन्हें अभी देख
            सकते हैं।
          </p>
          <div className="dr-digital">
            {DIGITAL.map((d) => {
              const inner = (
                <>
                  <span aria-hidden>{d.icon}</span>
                  <b>{d.title}</b>
                  <em className={d.available ? "dr-live" : "dr-soon"}>{d.available ? "उपलब्ध" : "Coming Soon"}</em>
                </>
              );
              return d.available ? (
                <a key={d.title} href={d.link} className="dr-digi dr-digi-on">
                  {inner}
                </a>
              ) : (
                <div key={d.title} className="dr-digi">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Inquiry ── */}
      <section className="md-sec" id="inquiry">
        <div className="md-wrap md-two md-two-top">
          <div>
            <p className="md-eyebrow">जुड़ें</p>
            <h2 className="md-h2 serif">पहली बातचीत से शुरुआत करें</h2>
            <p className="md-prose" style={{ marginTop: 12 }}>
              अपनी संस्था के बारे में कुछ बातें बताइए। हम आपसे संपर्क करके पहली बातचीत का समय तय करेंगे — उसके बाद ही काम का
              दायरा, अवधि और शुल्क तय होगा।
            </p>
            <ul className="dr-purposes">
              <li>🔍 Request Organizational Assessment</li>
              <li>🤝 Book One-to-One Consultation</li>
              <li>💻 Request Software Demo</li>
              <li>🧩 Discuss a New Project</li>
              <li>🔭 Become an Observer / Consultant</li>
            </ul>
            <div className="md-cta">
              <WhatsAppButton place="drishta_inquiry_side" />
            </div>
          </div>
          <DrishtaForm />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="md-final">
        <div className="md-wrap md-narrow">
          <h2 className="serif">क्या आप अपनी संस्था को एक नई दृष्टि से समझना चाहते हैं?</h2>
          <p>आइए, पहले आपकी संस्था को समझते हैं। उसके बाद उसके विकास की दिशा तय करते हैं।</p>
          <div className="md-cta" style={{ justifyContent: "center" }}>
            <PurposeButton purpose="assessment" className="md-btn md-btn-haldi">
              अपनी संस्था का मूल्यांकन करवाएँ
            </PurposeButton>
            <PurposeButton purpose="consultation" className="md-btn md-btn-ghost">
              Consultation Book करें
            </PurposeButton>
            <WhatsAppButton place="drishta_final" className="md-btn md-btn-ghost">
              हमसे संपर्क करें
            </WhatsAppButton>
          </div>
          <p className="md-attrib notranslate" translate="no">
            <b>PRAKRITI PATH – दृष्टा</b> · {drishta.en}
            <br />
            {drishta.motto} · By {drishta.by} · <a href="/">prakritipath.org</a>
          </p>
        </div>
      </section>
    </main>
  );
}
