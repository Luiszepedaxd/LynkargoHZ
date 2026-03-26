import { footer } from "@/components/landing/landing.data";

export default function LandingFooter() {
  return (
    <footer>
      <div className="ft-inner">
        <div>
          <div className="ft-logo">
            Lyn<span className="k">k</span>argo
          </div>
          <p className="ft-tagline">{footer.tagline}</p>
        </div>

        <div>
          <div className="ft-title">Servicios</div>
          <ul className="ft-links">
            {footer.services.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="ft-title">Contacto</div>
          <ul className="ft-links">
            {footer.contact.map((l) => (
              <li key={l.label}>
                <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noreferrer" : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ft-bottom">
        <span className="ft-copy">{footer.copyright}</span>
        <span className="ft-family">{footer.family}</span>
      </div>
    </footer>
  );
}

