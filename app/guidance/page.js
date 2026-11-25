import "../margdarshan/margdarshan.css";
import "./guidance.css";
import { PAINS, APPROACH, contact } from "@/data/margdarshan";
import LeadForm from "@/components/margdarshan/LeadForm";
import StickyCta from "@/components/margdarshan/StickyCta";

// Facebook / Instagram ads के लिए ख़ास पेज — एक ही लक्ष्य: निःशुल्क बातचीत बुक करना
export const metadata = {
  title: "निःशुल्क मार्गदर्शन बातचीत — Amresh Kumar Rudra | Prakriti Path",
  description:
    "उलझन से स्पष्टता तक: अमरेश कुमार रुद्र (लेखक, प्रकृति पथ) के साथ 15 मिनट की निःशुल्क बातचीत। अपनी प्रकृति समझें और आगे की दिशा पाएँ।",
  alternates: { canonical: "https://prakritipath.org/guidance" },
  openGraph: {
    title: "उलझन से स्पष्टता तक — 15 मिनट की निःशुल्क बातचीत",
    description: "अमरेश कुमार रुद्र के साथ। अपनी प्रकृति समझें, आगे की दिशा पाएँ।",
    url: "https://prakritipath.org/guidance",
    siteName: "Prakriti Path",
    locale: "hi_IN",
    type: "website",
    images: [{ url: "/og-guidance.png", width: 1200, height: 630 }],
  },
};

const IN_15 = [
  { icon: "👂", t: "आपकी बात", p: "आप अपनी उलझन बताते हैं — हम बिना टोके, बिना निर्णय के सुनते हैं।" },
  { icon: "🔎", t: "पहली समझ", p: "आपकी प्रकृति और अटकाव की एक झलक — कि बात असल में कहाँ अटकी है।" },
  { icon: "🧭", t: "अगला कदम", p: "एक स्पष्ट सुझाव — आगे क्या करें। आगे सत्र लेना पूरी तरह आपका निर्णय है।" },
];

const FAQ_SHORT = [
  { q: "क्या सच में निःशुल्क है?", a: "हाँ। पहली 15 मिनट की बातचीत पूरी तरह निःशुल्क है। आगे का कोई सत्र लेना या न लेना आपका निर्णय है।" },
  { q: "बातचीत कैसे होगी?", a: "फ़ोन या video call पर, आपकी सुविधा के समय। फॉर्म भरने के 24 घंटों में हम संपर्क करते हैं।" },
  { q: "क्या मेरी बातें गोपनीय रहेंगी?", a: "हाँ। आपकी बातें और जानकारी किसी के साथ साझा नहीं की जातीं।" },
];

export default function GuidancePage() {
  return (
    <main className="md gd">
      {/* ── ऊपर: छोटा logo, कोई menu नहीं — ध्यान केवल बुकिंग पर ── */}
      <div className="gd-top">
        <a href="/" className="gd-logo serif notranslate" translate="no">
          <span>प</span> प्रकृति पथ
        </a>
        <a href="#form" className="gd-top-cta">
          निःशुल्क बुक करें
        </a>
      </div>

      {/* ── HERO + FORM ── */}
      <section className="gd-hero">
        <div className="md-wrap gd-hero-in">
          <div className="gd-copy">
            <p className="md-kicker">निःशुल्क · 15 मिनट · फ़ोन / Video Call</p>
            <h1 className="md-title serif">
              उलझन से स्पष्टता तक —<br />
              <span>पहली बातचीत निःशुल्क</span>
            </h1>
            <p className="md-lead">
              मोह, डर और उलझन में जीवन भारी लगने लगता है। 15 मिनट की एक शांत बातचीत में समझिए कि आप कहाँ अटके हैं — और
              आगे का रास्ता क्या है।
            </p>
            <ul className="gd-ticks">
              <li>✓ कोई शुल्क नहीं, कोई दबाव नहीं</li>
              <li>✓ पूरी गोपनीयता — एक-से-एक बातचीत</li>
              <li>✓ हिंदी या English में</li>
            </ul>
            <div className="gd-person">
              <div className="gd-arch">
                {contact.guidePhoto ? (
                  <img src={contact.guidePhoto} alt="अमरेश कुमार रुद्र" />
                ) : (
                  <span className="serif">अ</span>
                )}
              </div>
              <div className="gd-person-txt">
                <b className="serif">अमरेश कुमार रुद्र</b>
                <span>लेखक “प्रकृति पथ” · सामाजिक चिंतक · संस्थापक, प्रकृति पथ</span>
                <q className="serif">लोगों को प्रकृति पथ से जोड़ना नहीं, लोगों को स्वयं से जोड़ना है।</q>
              </div>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* ── किनके लिए ── */}
      <section className="md-sec md-sec-tint">
        <div className="md-wrap">
          <p className="md-eyebrow">यह बातचीत किनके लिए है</p>
          <h2 className="md-h2 serif">अगर इनमें से कोई बात जानी-पहचानी लगे</h2>
          <div className="md-pains">
            {PAINS.map((p) => (
              <div key={p.text} className="md-pain">
                <span aria-hidden>{p.icon}</span>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 15 मिनट में क्या होगा ── */}
      <section className="md-sec">
        <div className="md-wrap">
          <p className="md-eyebrow">15 मिनट में क्या होगा</p>
          <h2 className="md-h2 serif">एक छोटी बातचीत, एक साफ़ अगला कदम</h2>
          <div className="md-approach">
            {IN_15.map((a) => (
              <div key={a.t} className="md-step">
                <span style={{ fontSize: 30 }} aria-hidden>
                  {a.icon}
                </span>
                <h3 className="serif">{a.t}</h3>
                <p>{a.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── तरीका ── */}
      <section className="md-sec md-org">
        <div className="md-wrap md-two">
          <div>
            <p className="md-eyebrow md-eyebrow-light">प्रकृति पथ का तरीका</p>
            <h2 className="md-h2 serif">समझना → पहचानना → दिशा</h2>
          </div>
          <ul className="md-org-list">
            {APPROACH.map((a) => (
              <li key={a.n}>
                <b>{a.title}:</b> {a.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="md-sec md-sec-tint">
        <div className="md-wrap md-narrow">
          <p className="md-eyebrow">आपके सवाल</p>
          <div className="md-faq">
            {FAQ_SHORT.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="md-care" role="note">
            <b>ध्यान दें:</b> यह मार्गदर्शन आत्म-समझ और जीवन-दिशा के लिए है, इलाज के लिए नहीं। अगर आप बहुत गहरे दुख, निराशा
            या संकट में हैं, तो कृपया डॉक्टर से मिलें या सरकार की निःशुल्क, 24×7 हेल्पलाइन <b>Tele-MANAS: 14416</b> पर बात
            करें।
          </div>
        </div>
      </section>

      {/* ── अंत ── */}
      <section className="md-final">
        <div className="md-wrap md-narrow">
          <h2 className="serif">बदलाव एक बातचीत से शुरू होता है</h2>
          <p>15 मिनट · निःशुल्क · आपकी सुविधा के समय</p>
          <a href="#form" className="md-btn md-btn-haldi">
            निःशुल्क बातचीत बुक करें →
          </a>
          <p className="md-attrib">
            Prakriti Path · By Amresh Kumar Rudra · <a href="/margdarshan">सभी कार्यक्रम देखें</a>
          </p>
        </div>
      </section>

      {/* ── मोबाइल पर नीचे हमेशा दिखने वाला बटन ── */}
      <StickyCta />
    </main>
  );
}
