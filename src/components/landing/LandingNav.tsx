import WhatsAppIcon from "@/components/landing/icons/WhatsAppIcon";
import type { NavItem } from "@/components/landing/landing.data";

export default function LandingNav({
  navItems,
  whatsappHref,
}: {
  navItems: NavItem[];
  whatsappHref: string;
}) {
  return (
    <nav aria-label="Navegación principal">
      <a href="#" className="logo">
        Lyn<span className="k">k</span>argo
      </a>

      <div className="nav-links" aria-label="Secciones">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="nav-link">
            {item.label}
          </a>
        ))}
      </div>

      <a
        href={whatsappHref}
        className="btn-nav"
        target="_blank"
        rel="noreferrer"
      >
        <WhatsAppIcon size={20} />
        Cotizar Ahora
      </a>
    </nav>
  );
}

