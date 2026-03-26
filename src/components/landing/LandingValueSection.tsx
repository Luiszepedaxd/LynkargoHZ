import { value } from "@/components/landing/landing.data";

export default function LandingValueSection() {
  return (
    <section className="value" id="nosotros">
      <div className="sec-inner">
        <div className="val-inner">
          <div className="fade-in">
            <div className="sec-tag sec-tag-dark">{value.tag}</div>
            <h2 className="dark">{value.title}</h2>
            <p className="sec-sub dark">{value.subtitle}</p>

            <ul className="val-list">
              {value.list.map((item) => (
                <li key={item.bold}>
                  <span className="chk">✓</span>
                  <span>
                    <strong style={{ color: "#fff" }}>{item.bold}</strong>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="val-grid fade-in">
            {value.metrics.map((m) => (
              <div key={m.value + m.label} className="val-card">
                <div className="val-n">{m.value}</div>
                <div className="val-l">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

