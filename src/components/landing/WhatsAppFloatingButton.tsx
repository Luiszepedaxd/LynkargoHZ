import WhatsAppIcon from "@/components/landing/icons/WhatsAppIcon";

export default function WhatsAppFloatingButton({
  href,
}: {
  href: string;
}) {
  return (
    <a
      href={href}
      className="float-wa"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Lynkargo"
    >
      <WhatsAppIcon size={30} fill="white" />
    </a>
  );
}

