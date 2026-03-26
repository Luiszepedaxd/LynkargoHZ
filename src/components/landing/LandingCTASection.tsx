import PhoneIcon from "@/components/landing/icons/PhoneIcon";
import WhatsAppIcon from "@/components/landing/icons/WhatsAppIcon";
import { cta } from "@/components/landing/landing.data";

export default function LandingCTASection() {
  return (
    <section className="cta-sec" id="contacto">
      <div className="sec-inner">
        <div className="cta-inn fade-in">
          <div className="sec-tag sec-tag-dark" style={{ margin: "0 auto 20px" }}>
            {cta.tag}
          </div>
          <h2>
            {cta.titleLines[0]}
            <br />
            {cta.titleLines[1]}
          </h2>
          <p>{cta.subtitle}</p>

          <div className="cta-btns">
            <a
              href={cta.whatsappHref}
              className="btn-wa-lg"
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={22} />
              {cta.whatsappLabel}
            </a>

            <a href={cta.telHref} className="btn-call-lg">
              <PhoneIcon size={20} />
              {cta.telLabel}
            </a>
          </div>

          <p className="cta-info">{cta.location}</p>
        </div>
      </div>
    </section>
  );
}

