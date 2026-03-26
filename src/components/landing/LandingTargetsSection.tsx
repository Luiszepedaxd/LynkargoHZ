import { targets } from "@/components/landing/landing.data";

export default function LandingTargetsSection() {
  return (
    <section className="targets" id="clientes">
      <div className="sec-inner">
        <div className="tgt-header fade-in">
          <div className="sec-tag">Clientes Ideales</div>
          <h2>¿Tu empresa es candidata?</h2>
          <p
            className="sec-sub"
            style={{ margin: "14px auto 0", textAlign: "center" }}
          >
            Trabajamos con empresas mexicanas que buscan escalar sin invertir
            en infraestructura propia.
          </p>
        </div>

        <div className="tgt-grid">
          {targets.map((t) => (
            <div
              key={t.title}
              className="tgt-card fade-in"
              data-e={t.emoji}
            >
              <h3>{t.title}</h3>
              <p>{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

