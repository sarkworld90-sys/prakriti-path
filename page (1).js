import { cookies } from "next/headers";
import HeroPath from "@/components/HeroPath";
import TodayQuestion from "@/components/TodayQuestion";
import FoundingForm from "@/components/FoundingForm";
import { SocialLinks, FounderSection, Gallery, ContactSection, WhatsAppFloat, KatoriPani } from "@/components/Extras";
import * as hiContent from "@/data/content";
import * as enContent from "@/data/content.en";
import { ui } from "@/data/ui";
import "./promo.css";

// भाषा: visitor ने 🌐 बटन से जो चुनी (cookie "pp_lang")। English का अपना सही अनुवाद है;
// बाकी भाषाओं में हिंदी पेज Google से अनुवादित होता है।
async function getLang() {
  try {
    const store = await cookies();
    return store.get("pp_lang")?.value === "en" ? "en" : "hi";
  } catch {
    return "hi";
  }
}

export default async function Home() {
  const lang = await getLang();
  const en = lang === "en";
  const C = en ? enContent : hiContent;
  const t = ui[lang];
  const { contact } = hiContent;
  const site = { ...hiContent.site, ...(en ? enContent.site : {}) };
  const { navLinks, selfKnowledge, pillars, journeyWeeks, circles, programs } = C;
  // पुस्तकों के कवर और खरीदने के लिंक हमेशा content.js से; English में केवल नाम बदलते हैं
  const books = hiContent.books.map((b, i) => (en && enContent.books[i] ? { ...b, ...enContent.books[i] } : b));

  return (
    <>
      {/* इस पेज का अपना English है — भाषा बटन इसे पढ़कर Google अनुवाद नहीं चलाता */}
      <span data-pp-native="en" hidden />

      {/* ===== मार्गदर्शन — सबसे ऊपर की पट्टी ===== */}
      <a href="/guidance" className="pp-promo">
        <span>{t.promo}</span>
        <b>{t.promoBtn}</b>
      </a>

      {/* ===== Header ===== */}
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="logo serif notranslate" translate="no">
            <img src="/images/logo-mark.webp" alt="" className="logo-img" />
            {site.name}
          </a>
          <nav className="nav">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            {t.navExtra.map((l) => (
              <a key={l.href} href={l.href} className={l.href === "/margdarshan" ? "pp-nav-hl" : undefined}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a href="/login" className="btn btn-outline">
              {t.login}
            </a>
            <a href="#judein" className="btn btn-primary">
              {t.foundingBtn}
            </a>
          </div>
        </div>
      </header>

      <main lang={lang}>
        {/* ===== Hero ===== */}
        <section className="hero">
          <HeroPath />
          <div className="container hero-inner">
            <h1 className="notranslate" translate="no">
              {site.name}
            </h1>
            <p className="hero-tagline serif">{site.tagline}</p>
            <p className="hero-intro">{site.intro}</p>
            <div className="hero-actions">
              <a href="/login" className="btn btn-primary">
                {t.heroStart}
              </a>
              <a href="#yatra" className="btn btn-outline">
                {t.heroKnow}
              </a>
            </div>
            <a href="/margdarshan" className="pp-hero-guide">
              {t.heroGuide} →
            </a>
            <p className="hero-en">{t.heroSub}</p>
          </div>
        </section>

        {/* ===== हमारी सुविधाएँ — हर सुविधा एक नज़र में ===== */}
        <section className="section pp-fac-wrap" id="suvidhayen">
          <div className="container">
            <span className="eyebrow">{t.facEyebrow}</span>
            <h2 className="section-title">{t.facTitle}</h2>
            <p className="section-lead">{t.facLead}</p>
            <div className="pp-fac">
              {t.facilities.map((f) => (
                <a className="pp-fac-card" key={f.href} href={f.href}>
                  <span className="pp-fac-icon" aria-hidden>
                    {f.icon}
                  </span>
                  <h3>{f.label}</h3>
                  <p>{f.text}</p>
                  <span className="pp-fac-more">{t.facMore}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Section 2: आप स्वयं को कितना जानते हैं? ===== */}
        <section className="section know" id="parichay">
          <div className="container">
            <span className="eyebrow">{t.knowEyebrow}</span>
            <h2 className="section-title">{t.knowTitle}</h2>
            <p className="section-lead">{t.knowLead}</p>
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
            <span className="eyebrow">{t.yatraEyebrow}</span>
            <h2 className="section-title">{t.yatraTitle}</h2>
            <p className="section-lead">{t.yatraLead}</p>
            <div className="pillar-grid">
              {pillars.map((p, i) => (
                <div className="pillar" key={p.en}>
                  <span className="pillar-step">
                    {t.step} {i + 1}
                  </span>
                  <div className="pillar-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p className="en">{p.en}</p>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FounderSection />

        {/* ===== Section 4: आज का प्रश्न ===== */}
        <section className="section question-wrap" id="aaj-ka-prashn">
          <div className="container">
            <TodayQuestion lang={lang} />
          </div>
        </section>

        {/* ===== Section 5: 30 दिन / 365 दिन यात्रा ===== */}
        <section className="section">
          <div className="container">
            <div className="journey-head">
              <div>
                <span className="eyebrow">{t.journeyEyebrow}</span>
                <h2 className="section-title">{t.journeyTitle}</h2>
                <p className="section-lead">{t.journeyLead}</p>
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
              <a href="/login" className="btn btn-haldi">
                {t.startDay1}
              </a>
            </div>
          </div>
        </section>

        <KatoriPani />

        {/* ===== Section 6: समुदाय ===== */}
        <section className="section" id="samuday" style={{ paddingTop: 0 }}>
          <div className="container">
            <span className="eyebrow">{t.communityEyebrow}</span>
            <h2 className="section-title">{t.communityTitle}</h2>
            <p className="section-lead">{t.communityLead}</p>
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

        <Gallery />

        {/* ===== Section 7: पुस्तकें और कार्यक्रम ===== */}
        <section className="section books-wrap" id="pustakein">
          <div className="container">
            <span className="eyebrow">{t.booksEyebrow}</span>
            <h2 className="section-title">{t.booksTitle}</h2>
            <div className="two-col">
              <div>
                <h3 className="col-title">{t.colBooks}</h3>
                <div className="book-row">
                  {books.map((b) => {
                    const cover = b.image ? (
                      <img src={b.image} alt={`${b.title} — ${b.subtitle}`} className="book book-img" />
                    ) : (
                      <div className="book">
                        <div>
                          <div className="t serif notranslate" translate="no">
                            {b.title}
                          </div>
                          <div className="s">{b.subtitle}</div>
                        </div>
                        <div className="a">{site.founder}</div>
                      </div>
                    );
                    return (
                      <div key={b.subtitle} className="book-link">
                        {b.link ? (
                          <a href={b.link} target="_blank" rel="noopener noreferrer">
                            {cover}
                          </a>
                        ) : (
                          cover
                        )}
                        {b.buy?.length > 0 && (
                          <div className="book-buy">
                            {b.buy.map((l) => (
                              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                                {en ? `Buy on ${l.label}` : `${l.label} ${t.buyOn}`}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="col-title">{t.colPrograms}</h3>
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
            <blockquote className="serif">{t.quote}</blockquote>
            <span className="eyebrow">{t.foundingEyebrow}</span>
            <h2 className="section-title">{t.foundingTitle}</h2>
            <p className="section-lead" style={{ margin: "0 auto 36px" }}>
              {t.foundingLead}
            </p>
            <FoundingForm />
          </div>
        </section>
        <ContactSection />
      </main>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <div className="logo serif notranslate" translate="no">
                <img src="/images/logo-mark.webp" alt="" className="logo-img" />
                {site.name}
              </div>
              <p style={{ marginTop: 10 }}>{site.tagline}</p>
            </div>
            <div>
              {t.newPages.map((n) => (
                <p key={n.href}>
                  <a href={n.href} style={{ color: "inherit" }}>
                    {n.label}
                  </a>
                </p>
              ))}
            </div>
            <div>
              <p>
                {t.founder}: {site.founder}
              </p>
              {contact.phone && <p>📞 {contact.phone}</p>}
              {contact.email && (
                <p>
                  ✉️ <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </p>
              )}
              <p>{site.website}</p>
              <SocialLinks light />
              <div className="footer-links">
                <a href="/privacy">{t.privacy}</a>
                <a href="/terms">{t.terms}</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom notranslate" translate="no">
            © {new Date().getFullYear()} {hiContent.site.name} · {hiContent.site.nameEn}
          </div>
        </div>
      </footer>
      <WhatsAppFloat />
    </>
  );
}
