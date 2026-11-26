import "../margdarshan/margdarshan.css";
import PrakritiQuiz from "@/components/margdarshan/PrakritiQuiz";
import { TYPES } from "@/data/prakritiQuiz";

export const metadata = {
  title: "अपनी प्रकृति जानें — Prakriti Quiz | Prakriti Path",
  description:
    "16 सरल प्रश्न, 3 मिनट: जानिए आपके भीतर पृथ्वी, जल, अग्नि या वायु — कौन-सी प्रकृति प्रबल है, आपकी शक्ति क्या है और आप कहाँ अटकते हैं।",
  alternates: { canonical: "https://prakritipath.org/prakriti-quiz" },
  openGraph: {
    title: "अपनी प्रकृति जानें — 3 मिनट का Quiz",
    description: "पृथ्वी, जल, अग्नि या वायु — आपकी प्रकृति कौन-सी है?",
    url: "https://prakritipath.org/prakriti-quiz",
    siteName: "Prakriti Path",
    locale: "hi_IN",
    type: "website",
  },
};

export default function QuizPage() {
  return (
    <main className="md">
      <section className="md-hero md-quiz-hero">
        <div className="md-wrap md-narrow" style={{ textAlign: "center" }}>
          <p className="md-kicker">प्रकृति पथ · Prakriti Quiz</p>
          <h1 className="md-title serif">
            अपनी प्रकृति जानें
            <br />
            <span>3 मिनट, 16 प्रश्न</span>
          </h1>
          <p className="md-lead" style={{ marginInline: "auto" }}>
            हर व्यक्ति में पृथ्वी, जल, अग्नि और वायु — चारों तत्व हैं, पर एक सबसे प्रबल होता है। वही तय करता है कि आप कैसे सोचते
            हैं, किससे डरते हैं, और कहाँ अटकते हैं।
          </p>
        </div>
        <div className="md-wrap md-narrow" style={{ marginTop: 32 }}>
          <PrakritiQuiz />
        </div>
      </section>

      <section className="md-sec md-sec-tint">
        <div className="md-wrap">
          <p className="md-eyebrow">चार प्रकृतियाँ</p>
          <h2 className="md-h2 serif">आप इनमें से कौन हैं?</h2>
          <div className="md-approach md-how4">
            {Object.entries(TYPES).map(([k, t]) => (
              <div key={k} className="md-step" style={{ borderTop: `4px solid ${t.color}` }}>
                <span style={{ fontSize: 30 }} aria-hidden>
                  {t.icon}
                </span>
                <h3 className="serif">{t.name}</h3>
                <p>{t.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="md-final">
        <div className="md-wrap md-narrow">
          <h2 className="serif">प्रकृति जानना पहला कदम है</h2>
          <p>उसके अनुसार जीना सीखना — यही प्रकृति पथ है।</p>
          <div className="md-cta" style={{ justifyContent: "center" }}>
            <a href="/margdarshan" className="md-btn md-btn-haldi">
              मार्गदर्शन सत्र देखें →
            </a>
            <a href="/yatra-21" className="md-btn md-btn-ghost">
              21 दिन की यात्रा
            </a>
          </div>
          <p className="md-attrib">Prakriti Path · By Amresh Kumar Rudra</p>
        </div>
      </section>
    </main>
  );
}
