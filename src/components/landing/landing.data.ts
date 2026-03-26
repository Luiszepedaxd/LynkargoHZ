export type NavItem = {
  href: string;
  label: string;
};

export type ServiceCard = {
  icon: string;
  title: string;
  description: string;
  tags: string[];
};

export type ValueListItem = {
  bold: string;
  text: string;
};

export type ValueMetric = {
  value: string;
  label: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type TargetCard = {
  emoji: string;
  title: string;
  description: string;
};

export type FooterLink = {
  href: string;
  label: string;
};

export const navItems: NavItem[] = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#clientes", label: "Clientes" },
];

export const whatsappContactHref = "https://wa.me/523321847482?text=Hola%2C%20quiero%20cotizar%20un%20servicio%20log%C3%ADstico%20con%20Lynkargo.";
export const whatsappHeroHref =
  "https://wa.me/523321847482?text=Hola%2C%20me%20interesa%20una%20cotizaci%C3%B3n%20para%20servicios%20log%C3%ADsticos%20con%20Lynkargo.";
export const whatsappSectionHeroHref =
  "https://wa.me/523321847482?text=Hola%2C%20me%20interesa%20una%20cotizaci%C3%B3n%20para%20servicios%20log%C3%ADsticos%20con%20Lynkargo.";

export const hero = {
  badge: "25+ a\u00f1os de experiencia log\u00edstica",
  titleLines: [
    [{ text: "Tu " }],
    [{ text: "cadena de\n", className: "accent-blue" }, { text: "suministro,", className: "accent-blue" }],
    [{ text: "en manos " }],
    [{ text: "expertas.", className: "accent-orange" }],
  ] as Array<Array<{ text: string; className?: string }>>,
  subtitlePrefix:
    "Intermediaci\u00f3n log\u00edstica 3PL integral. Conectamos tu empresa con proveedores certificados en la ZMG de Jalisco, reduciendo costos hasta ",
  subtitleHighlight: "30%",
  subtitleSuffix:
    " y liberando a tu equipo para crecer.",
  stats: [
    { num: "30", suffix: "%", label: "Reducci\u00f3n\nde costos" },
    { num: "15", suffix: "+", label: "Estados\ncubiertos" },
    { num: "99", suffix: "%", label: "Satisfacci\u00f3n\ndel cliente" },
  ],
  visualCards: [
    {
      variant: "b" as const,
      icon: "📦",
      title: "Almacenaje en Red",
      description: "15+ estados. WMS integrado, inventario en tiempo real.",
      badge: "Activo",
    },
    {
      variant: "o" as const,
      icon: "🚛",
      title: "Transporte Nacional e Internacional",
      description: "Fletes multimodales con seguimiento 24/7.",
      badge: "En tr\u00e1nsito",
    },
    {
      variant: "g" as const,
      icon: "🔄",
      title: "Fulfillment E-commerce",
      description: "Picking, packing y env\u00edo directo al cliente final.",
      badge: "Integrado",
    },
  ],
  cta: {
    whatsappHref: whatsappHeroHref,
    whatsappLabel: "Cotiza por WhatsApp",
    secondaryHref: "#servicios",
    secondaryLabel: "Ver Servicios",
  },
};

export const services: ServiceCard[] = [
  {
    icon: "🏭",
    title: "Almacenaje & Gesti\u00f3n de Inventarios",
    description:
      "Almacenamiento temporal y de largo plazo en instalaciones certificadas. WMS integrado y reportes peri\u00f3dicos.",
    tags: ["Corto plazo", "Largo plazo", "WMS"],
  },
  {
    icon: "🚛",
    title: "Transporte & Distribuci\u00f3n",
    description:
      "Fletes nacionales e internacionales. Transporte intermodal (terrestre, mar\u00edtimo, a\u00e9reo) con rutas optimizadas.",
    tags: ["Nacional", "Internacional", "Last-mile"],
  },
  {
    icon: "📬",
    title: "Fulfillment E-commerce",
    description:
      "Recepci\u00f3n, almacenaje din\u00e1mico, procesamiento de \u00f3rdenes y env\u00edo directo al cliente. Integraci\u00f3n con plataformas digitales.",
    tags: ["Picking", "Packing", "Integraciones"],
  },
  {
    icon: "⚙️",
    title: "Operaciones 3PL Completas",
    description:
      "Carga y descarga, maniobras especializadas, etiquetado, re-empaque, armado de pedidos y cross-docking.",
    tags: ["Maniobras", "Cross-docking", "Maquila Ligera"],
  },
  {
    icon: "🔍",
    title: "Control de Calidad & Destrucci\u00f3n",
    description:
      "Verificaci\u00f3n y auditor\u00eda de productos, control de calidad riguroso y destrucci\u00f3n certificada conforme a normativas.",
    tags: ["Auditor\u00eda", "Certificado", "Normativo"],
  },
  {
    icon: "📊",
    title: "Consultor\u00eda Log\u00edstica",
    description:
      "Optim\u00edzaci\u00f3n de cadena de suministro, asesor\u00eda ISO, cumplimiento aduanal y estrategias de reducci\u00f3n de costos.",
    tags: ["ISO", "Aduanas", "Optimizaci\u00f3n"],
  },
];

export const value = {
  tag: "\u00bfPor qu\u00e9 Lynkargo?",
  title: "El socio log\u00edstico que tu empresa necesita",
  subtitle:
    "Combinamos d\u00e9cadas de experiencia familiar con metodolog\u00edas modernas. El servicio personalizado de una empresa familiar con la red de una gran operaci\u00f3n log\u00edstica.",
  list: [
    {
      bold: "Red certificada al 100%",
      text: " — Proveedores verificados con seguros, capacidad y est\u00e1ndares probados en la ZMG de Jalisco.",
    },
    {
      bold: "Ejecutivo dedicado",
      text: " — Un punto de contacto \u00fanico para toda tu operaci\u00f3n log\u00edstica.",
    },
    {
      bold: "Transparencia total",
      text: " — Reportes detallados, seguimiento en tiempo real y trazabilidad completa.",
    },
    {
      bold: "Empresa familiar mexicana",
      text: " — 25+ a\u00f1os de experiencia y relaciones de largo plazo. Conocemos el mercado.",
    },
  ] as ValueListItem[],
  metrics: [
    { value: "30%", label: "Reducci\u00f3n promedio en costos log\u00edsticos" },
    { value: "15+", label: "Estados con cobertura nacional" },
    { value: "100%", label: "Proveedores certificados en la red" },
    { value: "24/7", label: "Seguimiento en tiempo real" },
  ] as ValueMetric[],
};

export const processSteps: ProcessStep[] = [
  {
    number: "1",
    title: "Diagn\u00f3stico",
    description:
      "Analizamos tu operaci\u00f3n actual, costos y necesidades espec\u00edficas para dise\u00f1ar la soluci\u00f3n ideal.",
  },
  {
    number: "2",
    title: "Propuesta",
    description:
      "Dise\u00f1amos un plan personalizado con proveedores certificados y ejecutivo dedicado para tu cuenta.",
  },
  {
    number: "3",
    title: "Implementaci\u00f3n",
    description:
      "Activamos la operaci\u00f3n con integraci\u00f3n a tus sistemas y onboarding completo para tu equipo.",
  },
  {
    number: "4",
    title: "Seguimiento",
    description:
      "Monitoreo continuo, reportes peri\u00f3dicos y optimizaci\u00f3n constante para maximizar resultados.",
  },
];

export const targets: TargetCard[] = [
  {
    emoji: "🏭",
    title: "PyMEs Manufactureras",
    description:
      "50\u2013500 empleados con producci\u00f3n nacional que necesitan outsourcing log\u00edstico profesional para escalar.",
  },
  {
    emoji: "🛒",
    title: "E-commerce en Crecimiento",
    description:
      "+100 \u00f3rdenes mensuales que buscan fulfillment profesional y quieren crecer sin bodega propia.",
  },
  {
    emoji: "🗺️",
    title: "Distribuidores Regionales",
    description:
      "Operan en 5\u201315 estados y necesitan almacenes estrat\u00e9gicos para optimizar costos de distribuci\u00f3n.",
  },
  {
    emoji: "✈️",
    title: "Importadores y Exportadores",
    description:
      "Empresas que requieren almacenaje aduanal, gesti\u00f3n de inventarios y transporte multimodal integrado.",
  },
];

export const cta = {
  tag: "Empecemos",
  titleLines: ["\u00bfListo para optimizar", "tu log\u00edstica?"],
  subtitle:
    "Escr\u00edbenos por WhatsApp y en menos de 24 horas tendr\u00e1s una propuesta personalizada para tu operaci\u00f3n. Sin compromisos.",
  whatsappHref:
    "https://wa.me/523321847482?text=Hola%2C%20quiero%20una%20cotizaci%C3%B3n%20personalizada%20para%20mi%20empresa%20con%20Lynkargo.",
  whatsappLabel: "Escribir por WhatsApp",
  telHref: "tel:+523321847482",
  telLabel: "Llamar ahora",
  location: "📍 Guadalajara, Jalisco \u00a0\u00b7\u00a0 Cobertura Nacional \u00a0\u00b7\u00a0 contacto@lynkargo.com",
};

export const footer = {
  services: [
    { href: "#servicios", label: "Almacenaje" },
    { href: "#servicios", label: "Transporte" },
    { href: "#servicios", label: "Fulfillment" },
    { href: "#servicios", label: "Consultor\u00eda" },
    { href: "#servicios", label: "Control de Calidad" },
  ] as FooterLink[],
  contact: [
    {
      href: "https://wa.me/523321847482",
      label: "WhatsApp: +52 33 2184 7482",
    },
    { href: "tel:+523321847482", label: "Llamar: +52 33 2184 7482" },
    { href: "mailto:contacto@lynkargo.com", label: "contacto@lynkargo.com" },
    { href: "#", label: "LinkedIn" },
    { href: "#", label: "Guadalajara, Jalisco, MX" },
  ] as FooterLink[],
  copyright: "\u00a9 2026 Lynkargo. Todos los derechos reservados.",
  family: "Una empresa de la Familia Zepeda-Lozano",
  tagline:
    "Tu socio estrat\u00e9gico en soluciones 3PL. Una empresa de la Familia Zepeda-Lozano con d\u00e9cadas de experiencia en log\u00edstica mexicana.",
};

