import "../margdarshan/margdarshan.css";
import { PROGRAMS, feeLabel } from "@/data/margdarshan";
import { WEEKS, HOW } from "@/data/yatra21";

export const metadata = {
  title: "21 दिन की यात्रा — समझना, पहचानना, दिशा | Prakriti Path",
  description:
    "रोज़ एक छोटा अभ्यास, निजी journal और हर सप्ताह मार्गदर्शन सत्र — 21 दिन में अपनी प्रकृति जानें और आगे की दिशा पाएँ। Prakriti Path द्वारा।",
  alternates: { canonical: "https://prakritipath.org/yatra-21" },
};

const BOOK = "/margdarshan?program=yatra21&src=yatra21#book";

export default function Yatra21Page() {
  const prog = PROGRAMS.find((p) => p.key === "yatra21");

  return (
    <main className="md">
      <section className="md-hero">
        <div className="md-wrap md-narrow" style={{ textAlign: "center" }}>
          <p className="md-kicker">प्रकृति पथ · 21-Day Journey</p>
          <h1 className="md-title serif">
            21 दिन की यात्रा
            <br />
            <span>समझना → पहचानना → दिशा</span>
          </h1>
          <p className="md-lead" style={{ marginInline: "auto" }}>
            एक बातचीत से समझ आती है, पर बदलाव रोज़ के अभ्यास से टिकता है। 21 दिन, हर दिन 10–15 मिनट — और हर सप्ताह एक
            मार्गदर्शन सत्र।
          </p>
          <div className="md-cta" style={{ justifyContent: "center" }}>
            <a href={BOOK} className="md-btn md-btn-primary">
              यात्रा शुरू करें →
            </a>
            <a href="/prakriti-quiz" className="md-btn md-btn-ghost">
              पहले अपनी प्रकृति जानें
            </a>
          </div>
          <p className="md-trust">{feeLabel(prog)} · Online</p>
        </div>
      </section>

      <section className="md-sec md-sec-tint">
        <div className="md-wrap">
          <p className="md-eyebrow">कैसे चलेगी यात्रा</p>
          <h2 className="md-h2 serif">हर दिन थोड़ा, पर लगातार</h2>
          <div className="md-approach md-how4">
            {HOW.map((h) => (
              <div key={h.t} className="md-step">
                <span style={{ fontSize: 30 }} aria-hidden>
                  {h.icon}
                </span>
                <h3 className="serif">{h.t}</h3>
                <p>{h.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {WEEKS.map((w) => (
        <section key={w.n} className={`md-sec ${w.n === 2 ? "md-sec-tint" : ""}`}>
          <div className="md-wrap">
            <p className="md-eyebrow">सप्ताह {w.n}</p>
            <h2 className="md-h2 serif">{w.title}</h2>
            <p className="md-sub-lead">{w.sub}</p>
            <ol className="md-days" start={(w.n - 1) * 7 + 1}>
              {w.days.map((d, i) => (
                <li key={d.t} className="md-day">
                  <span className="md-day-n">दिन {(w.n - 1) * 7 + i + 1}</span>
                  <b>{d.t}</b>
                  <p>{d.p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}

      <section className="md-final">
        <div className="md-wrap md-narrow">
          <h2 className="serif">21 दिन बाद, आप खुद को थोड़ा और जानेंगे</h2>
          <p>पहली 15 मिनट की बातचीत निःशुल्क है — तय करने से पहले बात कर लें।</p>
          <div className="md-cta" style={{ justifyContent: "center" }}>
            <a href={BOOK} className="md-btn md-btn-haldi">
              यात्रा शुरू करें →
            </a>
            <a href="/margdarshan?program=free_call#book" className="md-btn md-btn-ghost">
              निःशुल्क बातचीत
            </a>
          </div>
          <p className="md-attrib">Prakriti Path · By Amresh Kumar Rudra</p>
        </div>
      </section>
    </main>
  );
}
