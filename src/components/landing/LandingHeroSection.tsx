import WhatsAppIcon from "@/components/landing/icons/WhatsAppIcon";
import { hero } from "@/components/landing/landing.data";

export default function LandingHeroSection() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            {hero.badge}
          </div>

          <h1>
            Tu <span className="accent-blue">cadena de<br />suministro,</span>
            <br />
            en manos <span className="accent-orange">expertas.</span>
          </h1>

          <p className="hero-sub">
            {hero.subtitlePrefix}
            <strong style={{ color: "#fff" }}>{hero.subtitleHighlight}</strong>
            {hero.subtitleSuffix}
          </p>

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
          {hero.visualCards.map((card, idx) => (
            <div key={idx} className="vis-card">
              <div className={`vis-ico ${card.variant}`}>{card.icon}</div>
              <div>
                <div className="vis-title">{card.title}</div>
                <div className="vis-desc">{card.description}</div>
              </div>
              <div className="vis-badge">{card.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

