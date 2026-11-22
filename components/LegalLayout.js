import { site, contact } from "@/data/content";

export default function LegalLayout({ title, updated, children }) {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="/" className="logo serif">
            <img src="/images/logo-mark.webp" alt="" className="logo-img" />
            {site.name}
          </a>
          <a href="/" className="btn btn-outline">
            होम
          </a>
        </div>
      </header>
      <main className="legal">
        <div className="container">
          <h1 className="serif">{title}</h1>
          <p className="legal-updated">अंतिम अपडेट: {updated}</p>
          {children}
          <p className="legal-contact">
            प्रश्न या अनुरोध के लिए संपर्क करें: <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </div>
      </main>
    </>
  );
}
