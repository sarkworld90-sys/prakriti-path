import HeroPath from "@/components/HeroPath";
import TodayQuestion from "@/components/TodayQuestion";
import FoundingForm from "@/components/FoundingForm";
import {
  site,
  navLinks,
  selfKnowledge,
  pillars,
  journeyWeeks,
  circles,
  books,
  programs,
} from "@/data/content";

export default function Home() {
  return (
    <>
      {/* ===== Header ===== */}
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="logo serif">
            <span className="logo-mark">प</span>
            {site.name}
          </a>
          <nav className="nav">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href="#judein" className="btn btn-primary">
            Founding Member बनें
          </a>
        </div>
      </header>

      <main>
        {/* ===== Hero ===== */}
        <section className="hero">
          <HeroPath />
          <div className="container hero-inner">
            <h1>{site.name}</h1>
            <p className="hero-tagline serif">{site.tagline}</p>
            <p className="hero-intro">{site.intro}</p>
            <div className="hero-actions">
              <a href="#aaj-ka-prashn" className="btn btn-primary">
                अपनी यात्रा शुरू करें →
              </a>
              <a href="#yatra" className="btn btn-outline">
                प्रकृति पथ को जानें
              </a>
            </div>
            <p className="hero-en">A Journey Towards Self-Discovery</p>
          </div>
        </section>

        {/* ===== Section 2: आप स्वयं को कितना जानते हैं? ===== */}
        <section className="section know" id="parichay">
          <div className="container">
            <span className="eyebrow">पहला प्रश्न</span>
            <h2 className="section-title">आप स्वयं को कितना जानते हैं?</h2>
            <p className="section-lead">
              हम दुनिया के बारे में बहुत कुछ जानते हैं, पर स्वयं के बारे में सबसे कम। प्रकृति पथ इन पाँच
              प्रश्नों से शुरू होता है।
            </p>
            <div className="know-grid">
              {selfKnowledge.map((k, i) => (
                <div className="know-card" key={k.title}>
                  <span className="num">0{i + 1}</span>
                  <h3>{k.title}</h3>
                  <p>{k.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Section 3: हमारी यात्रा — 4 स्तंभ ===== */}
        <section className="section" id="yatra">
          <div className="container">
            <span className="eyebrow">हमारी यात्रा</span>
            <h2 className="section-title">चार कदम — स्वयं से समाज तक</h2>
            <p className="section-lead">
              व्यक्ति → परिवार → समाज → राष्ट्र → मानवता। जब व्यक्ति स्वयं को समझने लगता है, तो बाकी सब
              समझना आसान हो जाता है।
            </p>
            <div className="pillar-grid">
              {pillars.map((p, i) => (
                <div className="pillar" key={p.en}>
                  <span className="pillar-step">कदम {i + 1}</span>
                  <div className="pillar-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p className="en">{p.en}</p>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Section 4: आज का प्रश्न ===== */}
        <section className="section question-wrap" id="aaj-ka-prashn">
          <div className="container">
            <TodayQuestion />
          </div>
        </section>

        {/* ===== Section 5: 30 दिन / 365 दिन यात्रा ===== */}
        <section className="section">
          <div className="container">
            <div className="journey-head">
              <div>
                <span className="eyebrow">स्वयं की खोज</span>
                <h2 className="section-title">30 दिनों की आत्म-खोज यात्रा</h2>
                <p className="section-lead">
                  हर दिन एक प्रश्न, हर सप्ताह एक चिंतन। 30 दिन से शुरू करें — और 365 दिनों की यात्रा तक
                  पहुँचें।
                </p>
              </div>
              <div className="big-num serif">30</div>
            </div>
            <div className="weeks">
              {journeyWeeks.map((w) => (
                <div className="week" key={w.week}>
                  <p className="label">{w.week}</p>
                  <h3>{w.title}</h3>
                  <p className="days">{w.days}</p>
                  <p className="topics">{w.topics}</p>
                </div>
              ))}
            </div>
            <div className="journey-cta">
              <a href="#aaj-ka-prashn" className="btn btn-haldi">
                दिन 1 से शुरू करें
              </a>
            </div>
          </div>
        </section>

        {/* ===== Section 6: समुदाय ===== */}
        <section className="section" id="samuday" style={{ paddingTop: 0 }}>
          <div className="container">
            <span className="eyebrow">समुदाय</span>
            <h2 className="section-title">सोशल मीडिया नहीं — सार्थक समुदाय</h2>
            <p className="section-lead">
              ऐसे लोगों के साथ जुड़ें जो स्वयं को समझना चाहते हैं। हर मंडल एक विषय पर केंद्रित।
            </p>
            <div className="circle-grid">
              {circles.map((c) => (
                <div className="circle" key={c.name}>
                  <div className="circle-icon">{c.icon}</div>
                  <div>
                    <h3>{c.name}</h3>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Section 7: पुस्तकें और कार्यक्रम ===== */}
        <section className="section books-wrap" id="pustakein">
          <div className="container">
            <span className="eyebrow">पुस्तकें और कार्यक्रम</span>
            <h2 className="section-title">पढ़ें, समझें, जिएँ</h2>
            <div className="two-col">
              <div>
                <h3 className="col-title">पुस्तकें</h3>
                <div className="book-row">
                  {books.map((b) => (
                    <div className="book" key={b.subtitle}>
                      <div>
                        <div className="t serif">{b.title}</div>
                        <div className="s">{b.subtitle}</div>
                      </div>
                      <div className="a">{site.founder}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="col-title">कार्यक्रम</h3>
                {programs.map((p) => (
                  <div className="program" key={p.title}>
                    <h4>{p.title}</h4>
                    <p>{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Founding Members — जुड़ें ===== */}
        <section className="section final" id="judein">
          <div className="container">
            <blockquote className="serif">
              “लोगों को प्रकृति पथ से जोड़ना नहीं, लोगों को स्वयं से जोड़ना है।”
            </blockquote>
            <span className="eyebrow">100 Founding Members</span>
            <h2 className="section-title">पहले 100 यात्रियों में शामिल हों</h2>
            <p className="section-lead" style={{ margin: "0 auto 36px" }}>
              30 दिन · 30 प्रश्न · 4 साप्ताहिक चिंतन · 1 अंतिम जीवन-चिंतन। प्रकृति पथ को आकार देने में आपकी
              भागीदारी सबसे महत्वपूर्ण होगी।
            </p>
            <FoundingForm />
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <div className="logo serif">
                <span className="logo-mark">प</span>
                {site.name}
              </div>
              <p style={{ marginTop: 10 }}>{site.tagline}</p>
            </div>
            <div>
              <p>संस्थापक: {site.founder}</p>
              <p>{site.website}</p>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} {site.name} · {site.nameEn}
          </div>
        </div>
      </footer>
    </>
  );
}
