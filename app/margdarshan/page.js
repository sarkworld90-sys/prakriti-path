import "./margdarshan.css";
import { PAINS, APPROACH, FAQ, contact, book } from "@/data/margdarshan";
import ProgramCards from "@/components/margdarshan/ProgramCards";
import BookingForm from "@/components/margdarshan/BookingForm";

export const metadata = {
  title: "प्रकृति पथ मार्गदर्शन — Online / Offline सत्र, अपनी प्रकृति जानें | Prakriti Path",
  description:
    "मोह, डर और उलझन से स्पष्टता की ओर। व्यक्तिगत मार्गदर्शन, अपनी प्रकृति जानें, समूह कक्षाएँ, Corporate और विभागीय कार्यक्रम — Online और Offline। Amresh Kumar Rudra द्वारा।",
  alternates: { canonical: "https://prakritipath.org/margdarshan" },
  openGraph: {
    title: "प्रकृति पथ मार्गदर्शन — अपनी प्रकृति जानें, अपना पथ पाएँ",
    description: "व्यक्तिगत, समूह, Corporate और विभागीय सत्र — Online और Offline।",
    url: "https://prakritipath.org/margdarshan",
    siteName: "Prakriti Path",
    locale: "hi_IN",
    type: "website",
  },
};

const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(book.qrLink)}`;

function PathArt() {
  return (
    <svg className="md-art" viewBox="0 0 320 280" role="img" aria-label="उलझी रेखा से सीधे पथ की ओर">
      <circle cx="232" cy="78" r="38" fill="#E2A33C" opacity=".9" />
      <circle cx="232" cy="78" r="56" fill="#E2A33C" opacity=".15" />
      {/* उलझन */}
      <path
        d="M30 230 C 60 180, 20 160, 60 150 S 110 190, 90 140 S 40 110, 90 100 S 130 150, 120 120"
        fill="none"
        stroke="#9fb3a6"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* स्पष्ट पथ */}
      <path d="M120 120 C 150 100, 175 95, 200 92" fill="none" stroke="#2f5d46" strokeWidth="6" strokeLinecap="round" />
      <circle cx="120" cy="120" r="7" fill="#2f5d46" />
      {/* पौधा */}
      <g transform="translate(150 200)">
        <path d="M0 50 V10" stroke="#2f5d46" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 22 C -26 18, -30 -4, -30 -4 C -8 -6, 0 10, 0 22Z" fill="#4f8a68" />
        <path d="M0 14 C 24 10, 30 -12, 30 -12 C 8 -14, 0 2, 0 14Z" fill="#6fa884" />
        <ellipse cx="0" cy="54" rx="40" ry="7" fill="#b5582e" opacity=".85" />
      </g>
    </svg>
  );
}

export default function MargdarshanPage() {
  return (
    <main className="md">
      {/* ── HERO ── */}
      <section className="md-hero">
        <div className="md-wrap md-hero-in">
          <div>
            <p className="md-kicker">प्रकृति पथ मार्गदर्शन · Online & Offline</p>
            <h1 className="md-title serif">
              उलझन से स्पष्टता तक —
              <br />
              <span>अपनी प्रकृति जानें, अपना पथ पाएँ</span>
            </h1>
            <p className="md-lead">
              जब हम मोह, डर और माया में उलझ जाते हैं, तो जीवन बोझ लगने लगता है। प्रकृति पथ मार्गदर्शन आपको यह समझने में मदद
              करता है कि आप भीतर से कौन हैं, कहाँ अटके हैं — और आगे का रास्ता क्या है।
            </p>
            <div className="md-cta">
              <a href="#book" className="md-btn md-btn-primary">
                सत्र बुक करें →
              </a>
              <a href="#programs" className="md-btn md-btn-ghost">
                कार्यक्रम देखें
              </a>
            </div>
            <p className="md-trust">पहली 15 मिनट की बातचीत निःशुल्क · व्यक्तिगत · समूह · Corporate · विभाग</p>
          </div>
          <PathArt />
        </div>
      </section>

      {/* ── क्या आप भी… ── */}
      <section className="md-sec">
        <div className="md-wrap">
          <p className="md-eyebrow">क्या आप भी…</p>
          <h2 className="md-h2 serif">इनमें से किसी बात में खुद को पाते हैं?</h2>
          <div className="md-pains">
            {PAINS.map((p) => (
              <div key={p.text} className="md-pain">
                <span aria-hidden>{p.icon}</span>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <p className="md-pain-close serif">
            तो आप अकेले नहीं हैं। और यह स्थायी नहीं है — <b>समझ आते ही दिशा बदलती है।</b>
          </p>
          <a href="/prakriti-quiz" className="md-quiz-cta">
            <span aria-hidden>🧭</span>
            <span>
              <b>पहला कदम: 3 मिनट में जानिए अपनी प्रकृति</b>
              <small>16 सरल प्रश्न · निःशुल्क · तुरंत परिणाम</small>
            </span>
            <span className="md-quiz-go">Quiz शुरू करें →</span>
          </a>
        </div>
      </section>

      {/* ── तरीका ── */}
      <section className="md-sec md-sec-tint">
        <div className="md-wrap">
          <p className="md-eyebrow">हमारा तरीका</p>
          <h2 className="md-h2 serif">समझना → पहचानना → दिशा</h2>
          <div className="md-approach">
            {APPROACH.map((a) => (
              <div key={a.n} className="md-step">
                <span className="md-step-n">{a.n}</span>
                <h3 className="serif">{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── कार्यक्रम ── */}
      <section className="md-sec" id="programs">
        <div className="md-wrap">
          <p className="md-eyebrow">कार्यक्रम</p>
          <h2 className="md-h2 serif">आपके लिए कौन-सा रास्ता?</h2>
          <p className="md-sub-lead">ज़्यादातर कार्यक्रम Online (video call) और Offline (आमने-सामने) — दोनों रूपों में उपलब्ध हैं।</p>
          <ProgramCards />
        </div>
      </section>

      {/* ── संस्थाओं के लिए ── */}
      <section className="md-sec md-org">
        <div className="md-wrap md-two">
          <div>
            <p className="md-eyebrow md-eyebrow-light">Corporate · विभाग · संस्थान</p>
            <h2 className="md-h2 serif">जब लोग भीतर से स्पष्ट होते हैं, तो टीम भी मज़बूत होती है</h2>
          </div>
          <div>
            <ul className="md-org-list">
              <li>काम के तनाव और भावनाओं को समझने के सत्र</li>
              <li>टीम में संवाद, भरोसा और आपसी समझ</li>
              <li>नेतृत्व के लिए आत्म-जागरूकता</li>
              <li>विद्यार्थियों के लिए — दबाव, लक्ष्य और अपनी प्रकृति</li>
              <li>एक दिन की कार्यशाला से कई सप्ताह के कार्यक्रम तक</li>
            </ul>
            <a href="#book" className="md-btn md-btn-haldi">
              अपनी संस्था के लिए बात करें →
            </a>
          </div>
        </div>
      </section>

      {/* ── मार्गदर्शक ── */}
      <section className="md-sec md-sec-tint">
        <div className="md-wrap md-guide">
          <div className="md-guide-mark serif" aria-hidden={!contact.guidePhoto}>
            {contact.guidePhoto ? <img src={contact.guidePhoto} alt="Amresh Kumar Rudra" /> : "अ"}
          </div>
          <div>
            <p className="md-eyebrow">आपके मार्गदर्शक</p>
            <h2 className="md-h2 serif">Amresh Kumar Rudra</h2>
            <p className="md-guide-role">उद्यमी · लेखक · सामाजिक चिंतक · संस्थापक, प्रकृति पथ</p>
            <p className="md-prose">
              प्रकृति पथ का विचार यही है कि हर व्यक्ति की अपनी एक प्रकृति है — और जब वह उसे पहचान लेता है, तो जीवन का
              रास्ता अपने-आप साफ़ होने लगता है। इसी विचार पर लिखी पुस्तक <b>“प्रकृति पथ”</b> और ये सत्र, दोनों उसी यात्रा
              के हिस्से हैं।
            </p>
          </div>
        </div>
      </section>

      {/* ── पुस्तक ── */}
      <section className="md-sec">
        <div className="md-wrap md-book">
          <div className="md-book-cover serif" aria-hidden>
            <span>प्रकृति</span>
            <span>पथ</span>
            <small>Amresh Kumar Rudra</small>
          </div>
          <div>
            <p className="md-eyebrow">पुस्तक</p>
            <h2 className="md-h2 serif">
              {book.title} — {book.subtitle}
            </h2>
            <p className="md-prose">
              जो बातें सत्रों में होती हैं, उनकी नींव इस पुस्तक में है। सत्र से पहले या बाद में इसे पढ़ना आपकी यात्रा को और गहरा
              करता है।
            </p>
            <div className="md-cta">
              {book.amazon && (
                <a className="md-btn md-btn-primary" href={book.amazon} target="_blank" rel="noopener noreferrer">
                  Amazon पर खरीदें
                </a>
              )}
              {book.flipkart && (
                <a className="md-btn md-btn-ghost" href={book.flipkart} target="_blank" rel="noopener noreferrer">
                  Flipkart पर खरीदें
                </a>
              )}
            </div>
          </div>
          <figure className="md-qr">
            <img src={QR_SRC} alt="पुस्तक से सत्र बुक करने का QR code" width={150} height={150} loading="lazy" />
            <figcaption>
              पुस्तक के पाठक: QR स्कैन करें और सीधे सत्र बुक करें
              <br />
              <a href={QR_SRC} target="_blank" rel="noopener noreferrer">
                छापने के लिए QR डाउनलोड करें
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── बुकिंग ── */}
      <section className="md-sec" id="book">
        <div className="md-wrap md-narrow">
          <p className="md-eyebrow">सत्र बुक करें</p>
          <h2 className="md-h2 serif">पहला कदम — बस एक फॉर्म</h2>
          <p className="md-sub-lead">
            फॉर्म भरें। जिन कार्यक्रमों का शुल्क तय है, उनका भुगतान तुरंत online हो सकता है; बाकी के लिए हमारी टीम आपसे बात
            करके समय और शुल्क तय करेगी। <b>पहली 15 मिनट की बातचीत निःशुल्क है।</b>
          </p>
          <BookingForm />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="md-sec md-sec-tint">
        <div className="md-wrap md-narrow">
          <p className="md-eyebrow">अक्सर पूछे जाने वाले प्रश्न</p>
          <h2 className="md-h2 serif">आपके मन के सवाल</h2>
          <div className="md-faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <div className="md-care" role="note">
            <b>एक ज़रूरी बात:</b> यह मार्गदर्शन आत्म-समझ और जीवन-दिशा के लिए है, इलाज के लिए नहीं। अगर आप बहुत गहरे दुख,
            निराशा या संकट में हैं, तो कृपया डॉक्टर से मिलें या सरकार की निःशुल्क, 24×7 हेल्पलाइन{" "}
            <b>Tele-MANAS: 14416</b> (या 1-800-891-4416) पर बात करें।
          </div>
        </div>
      </section>

      {/* ── अंत ── */}
      <section className="md-final">
        <div className="md-wrap md-narrow">
          <h2 className="serif">अपनी प्रकृति, अपना जीवन पथ</h2>
          <p>बदलाव किसी बड़े दिन का इंतज़ार नहीं करता — वह एक बातचीत से शुरू होता है।</p>
          <a href="#book" className="md-btn md-btn-haldi">
            सत्र बुक करें →
          </a>
          <p className="md-attrib">
            Prakriti Path · By Amresh Kumar Rudra · <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
