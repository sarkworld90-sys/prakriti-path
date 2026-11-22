import { contact, social, founder, gallery, katoriPani } from "@/data/content";

const waLink = (num) => `https://wa.me/${String(num).replace(/\D/g, "")}`;

// ===== सोशल मीडिया बटन =====
export function SocialLinks({ light = false }) {
  const items = [
    social.facebook && { href: social.facebook, icon: "📘", label: "Facebook" },
    social.instagram && { href: social.instagram, icon: "📸", label: "Instagram" },
    social.youtube && { href: social.youtube, icon: "▶️", label: "YouTube" },
    social.whatsappChannel && { href: social.whatsappChannel, icon: "📢", label: "WhatsApp Channel" },
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <div className={`social-row ${light ? "social-light" : ""}`}>
      {items.map((i) => (
        <a key={i.label} href={i.href} target="_blank" rel="noopener noreferrer" className="social-pill">
          <span aria-hidden="true">{i.icon}</span> {i.label}
        </a>
      ))}
    </div>
  );
}

// ===== संस्थापक परिचय =====
export function FounderSection() {
  if (!founder.bio?.length) return null;
  return (
    <section className="section" id="sansthapak">
      <div className="container founder">
        {founder.photo ? (
          <img src={founder.photo} alt={founder.name} className={founder.cutout ? "founder-cutout" : "founder-photo"} />
        ) : (
          <div className="founder-photo founder-mono serif" aria-hidden="true">
            {founder.name.charAt(0)}
          </div>
        )}
        <div>
          <span className="eyebrow">संस्थापक</span>
          <h2 className="section-title">{founder.name}</h2>
          <p className="founder-title">{founder.title}</p>
          {founder.bio.map((para, i) => (
            <p key={i} className="founder-bio">
              {para}
            </p>
          ))}
          {founder.quote && <p className="founder-quote serif">{founder.quote}</p>}
        </div>
      </div>
    </section>
  );
}

// ===== विचार / फोटो गैलरी =====
export function Gallery() {
  if (!gallery.length) return null;
  return (
    <section className="section" id="gallery" style={{ paddingTop: 0 }}>
      <div className="container">
        <span className="eyebrow">विचार</span>
        <h2 className="section-title">प्रकृति पथ के विचार</h2>
        <p className="section-lead">हर विचार एक बीज है — पढ़िए, रुकिए और अपने भीतर उतारिए।</p>
        <div className="gallery-grid">
          {gallery.map((g) => (
            <a key={g.src} href={g.src} target="_blank" rel="noopener noreferrer" className="gallery-item">
              <img src={g.src} alt={g.caption || "प्रकृति पथ"} loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== एक कटोरी पानी अभियान =====
export function KatoriPani() {
  const k = katoriPani;
  if (!k) return null;
  const pledgeHref = contact.whatsapp
    ? `https://wa.me/${String(contact.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(k.pledgeMessage)}`
    : null;
  const shareHref = `https://wa.me/?text=${encodeURIComponent(k.shareMessage)}`;
  return (
    <section className="section katori" id="katori-pani">
      <div className="container">
        <div className="katori-head">
          <div className="katori-emoji" aria-hidden="true">
            🐦<span>💧</span>
          </div>
          <div>
            <span className="eyebrow">प्रकृति से जुड़ें</span>
            <h2 className="section-title">{k.title}</h2>
            <p className="katori-tagline serif">{k.tagline}</p>
          </div>
        </div>
        <div className="katori-appeal">
          {k.appeal.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <h3 className="katori-sub serif">कैसे जुड़ें?</h3>
        <div className="katori-steps">
          {k.steps.map((st, i) => (
            <div className="katori-step" key={st.title}>
              <span className="katori-num">{i + 1}</span>
              <span className="katori-icon">{st.icon}</span>
              <h4>{st.title}</h4>
              <p>{st.text}</p>
            </div>
          ))}
        </div>
        <div className="katori-cta">
          {pledgeHref && (
            <a href={pledgeHref} target="_blank" rel="noopener noreferrer" className="btn btn-haldi">
              🙏 मैं इस अभियान से जुड़ता/जुड़ती हूँ
            </a>
          )}
          <a href={shareHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
            📤 WhatsApp पर साझा करें
          </a>
        </div>
      </div>
    </section>
  );
}

// ===== संपर्क सेक्शन =====
export function ContactSection() {
  const rows = [
    contact.whatsapp && { icon: "💬", label: "WhatsApp", value: "संदेश भेजें", href: waLink(contact.whatsapp), ext: true },
    contact.phone && { icon: "📞", label: "फोन", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    contact.email && { icon: "✉️", label: "ईमेल", value: contact.email, href: `mailto:${contact.email}` },
    contact.address && { icon: "📍", label: "स्थान", value: contact.address },
  ].filter(Boolean);
  const hasSocial = social.facebook || social.instagram || social.youtube || social.whatsappChannel;
  if (!rows.length && !hasSocial) return null;
  return (
    <section className="section contact-wrap" id="sampark">
      <div className="container">
        <span className="eyebrow">संपर्क करें</span>
        <h2 className="section-title">हमसे जुड़ें</h2>
        <p className="section-lead">कोई प्रश्न, सुझाव या कार्यक्रम के बारे में जानकारी — हम आपसे सुनना चाहेंगे।</p>
        <div className="contact-grid">
          {rows.map((r) => {
            const inner = (
              <>
                <span className="contact-icon">{r.icon}</span>
                <span>
                  <span className="contact-label">{r.label}</span>
                  <span className="contact-value">{r.value}</span>
                </span>
              </>
            );
            return r.href ? (
              <a
                key={r.label}
                href={r.href}
                className="contact-card"
                {...(r.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {inner}
              </a>
            ) : (
              <div key={r.label} className="contact-card">
                {inner}
              </div>
            );
          })}
        </div>
        <SocialLinks />
      </div>
    </section>
  );
}

// ===== कोने में WhatsApp बटन =====
export function WhatsAppFloat() {
  if (!contact.whatsapp) return null;
  return (
    <a
      href={waLink(contact.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="WhatsApp पर संदेश भेजें"
    >
      💬
    </a>
  );
}
