import { processSteps } from "@/components/landing/landing.data";

export default function LandingProcessSection() {
  return (
    <section id="proceso">
      <div className="sec-inner">
        <div className="proc-header fade-in">
          <div className="sec-tag">Cómo Trabajamos</div>
          <h2>Simple para ti, complejo para nosotros</h2>
          <p
            className="sec-sub"
            style={{ margin: "14px auto 0", textAlign: "center" }}
          >
            Nos encargamos de toda la complejidad operativa para que tú solo veas
            resultados.
          </p>
        </div>

        <div className="steps">
          {processSteps.map((step) => (
            <div key={step.number} className="step fade-in">
              <div className="step-n">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

