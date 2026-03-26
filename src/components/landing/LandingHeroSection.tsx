import WhatsAppIcon from "@/components/landing/icons/WhatsAppIcon";
import { hero } from "@/components/landing/landing.data";
import { useEffect, useState } from "react";

export default function LandingHeroSection() {
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveLine((prev) => (prev + 1) % hero.rotatingLines.length);
    }, 2500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            {hero.badge}
          </div>

          <h1 className="hero-title">
            <span className="hero-title-fixed">{hero.headlineFixed}</span>
            <span className="hero-rotator-wrap">
              {hero.rotatingLines.map((line, idx) => (
                <span
                  key={line}
                  className={`hero-rotator-line ${idx === activeLine ? "is-active" : ""}`}
                  aria-hidden={idx !== activeLine}
                >
                  {line}
                </span>
              ))}
            </span>
          </h1>

          <p className="hero-sub">{hero.subtitle}</p>

          <div className="hero-btns">
            <a
              href={hero.cta.whatsappHref}
              className="btn-wa"
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon className="wa-svg" size={22} />
              {hero.cta.whatsappLabel}
            </a>

            <a href={hero.cta.secondaryHref} className="btn-outline">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                focusable="false"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {hero.cta.secondaryLabel}
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <article className="tracking-card" aria-label={hero.trackingPanel.title}>
            <h3 className="tracking-title">{hero.trackingPanel.title}</h3>
            <div className="tracking-list">
              {hero.trackingPanel.items.map((item) => (
                <div className="tracking-row" key={item.label}>
                  <span className={`tracking-dot ${item.dot}`} aria-hidden="true"></span>
                  <span className="tracking-label">{item.label}</span>
                  <span className="tracking-status">{item.status}</span>
                </div>
              ))}
            </div>
            <div className="tracking-progress">
              <span className="tracking-progress-bar"></span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

