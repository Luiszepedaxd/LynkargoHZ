import { services } from "@/components/landing/landing.data";

export default function LandingServicesSection() {
  return (
    <section className="services" id="servicios">
      <div className="sec-inner">
        <div className="srv-header fade-in">
          <div className="sec-tag">Servicios</div>
          <h2>
            Soluciones 3PL integrales
            <br />
            para tu empresa
          </h2>
          <p className="sec-sub">
            Desde el almacén hasta la puerta de tu cliente. Gestionamos toda la
            operación logística para que tú te enfoques en lo que mejor haces.
          </p>
        </div>

        <div className="srv-grid">
          {services.map((srv, idx) => (
            <div key={idx} className="srv-card fade-in">
              <div className="srv-ico">{srv.icon}</div>
              <h3>{srv.title}</h3>
              <p>{srv.description}</p>
              <div className="srv-tags">
                {srv.tags.map((t) => (
                  <span key={t} className="srv-t">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

