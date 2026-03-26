"use client";

import WhatsAppIcon from "@/components/landing/icons/WhatsAppIcon";
import { hero } from "@/components/landing/landing.data";
import { useEffect, useState } from "react";

export default function LandingHeroSection() {
  const [activeLine, setActiveLine] = useState(0);
  const activeSlide = hero.headlineVariants[activeLine];
  const activeBg = hero.backgroundImages[activeLine % hero.backgroundImages.length];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveLine((prev) => (prev + 1) % hero.headlineVariants.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div
        key={activeBg}
        className="hero-bg"
        style={{ backgroundImage: `url("${activeBg}")` }}
        aria-hidden="true"
      ></div>
      <div className="hero-grid">
        <div className="hero-glass">
          {hero.badge ? (
            <div className="hero-badge">
              <span className="badge-dot"></span>
              {hero.badge}
            </div>
          ) : null}

          <h1 className="hero-title">
            <span key={activeLine} className="hero-rotating-copy">
              <span className="hero-copy-lead">{activeSlide.lead} </span>
              <span className="hero-copy-highlight">{activeSlide.highlight}</span>
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
      </div>
    </section>
  );
}

