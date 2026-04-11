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
  badge: "",
  backgroundImages: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=80",
  ],
  headlineVariants: [
    {
      lead: "La log\u00edstica que tu empresa necesita,",
      highlight: "sin complicaciones.",
    },
    {
      lead: "Con Lynkargo obtienes una operaci\u00f3n",
      highlight: "con seguimiento continuo.",
    },
    {
      lead: "Conectamos tu operaci\u00f3n",
      highlight: "desde Guadalajara con alcance en ZMG y Monterrey.",
    },
    {
      lead: "Tu cadena de suministro respaldada por",
      highlight: "25 a\u00f1os de experiencia.",
    },
    {
      lead: "Dise\u00f1amos tu estrategia para lograr",
      highlight: "una operaci\u00f3n log\u00edstica m\u00e1s eficiente.",
    },
    {
      lead: "Tienes acompa\u00f1amiento directo con",
      highlight: "un ejecutivo dedicado.",
    },
    {
      lead: "Integramos operaciones",
      highlight: "terrestres, mar\u00edtimas y a\u00e9reas.",
    },
    {
      lead: "Tu empresa avanza con",
      highlight: "red de proveedores certificados.",
    },
  ],
  subtitle:
    "Somos tu aliado 3PL en la Zona Metropolitana de Guadalajara. Conectamos tu empresa con proveedores log\u00edsticos certificados para que t\u00fa te enfoques en crecer.",
  cta: {
    whatsappHref: whatsappHeroHref,
    whatsappLabel: "Habla con un asesor",
    secondaryHref: "#servicios",
    secondaryLabel: "Conoce nuestros servicios",
  },
};

export const services: ServiceCard[] = [
  {
    icon: "🏭",
    title: "Almacenaje & Gesti\u00f3n de Inventarios",
    description:
      "Almacenamiento temporal, y de largo plazo para mercanc\u00edas nacionales, nacionalizadas o ya sea bajo la figura de dep\u00f3sito fiscal o programa IMMEX en instalaciones certificadas en ZMG y Monterrey. WMS integrado para la adecuada administraci\u00f3n de los inventarios y reportes peri\u00f3dicos.",
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
      "Recepci\u00f3n, almacenaje din\u00e1mico en ZMG y Monterrey, procesamiento de \u00f3rdenes y env\u00edo directo al cliente. Integraci\u00f3n con plataformas digitales.",
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
    title:
      "Control de Calidad & Destrucci\u00f3n de mercanc\u00edas, conforme a normativas fiscales y sanitarias",
    description:
      "Verificaci\u00f3n y auditor\u00eda de productos, control de calidad riguroso y destrucci\u00f3n de mercanc\u00edas, conforme a normativas fiscales y sanitarias.",
    tags: ["Auditor\u00eda", "Certificado", "Normativo"],
  },
  {
    icon: "📊",
    title: "Consultor\u00eda Log\u00edstica",
    description:
      "Optim\u00edzaci\u00f3n de cadena de suministro, asesor\u00eda ISO, BASC y C-TPAT, cumplimiento aduanal y estrategias de reducci\u00f3n de costos.",
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
      bold: "Red de proveedores certificados",
      text: " — Proveedores verificados con seguros, capacidad y est\u00e1ndares probados en la ZMG.",
    },
    {
      bold: "Ejecutivo dedicado",
      text: " — Un punto de contacto \u00fanico para toda tu operaci\u00f3n log\u00edstica.",
    },
    {
      bold: "Transparencia operativa",
      text: " — Reportes detallados, seguimiento continuo y trazabilidad clara.",
    },
    {
      bold: "Empresa familiar mexicana",
      text: " — 25+ a\u00f1os de experiencia y relaciones de largo plazo. Conocemos el mercado.",
    },
  ] as ValueListItem[],
  metrics: [
    { value: "Eficiencia", label: "Optimizaci\u00f3n de costos log\u00edsticos" },
    { value: "Cobertura", label: "Presencia operativa ZMG y Monterrey" },
    { value: "Calidad", label: "Proveedores certificados en la red" },
    { value: "Control", label: "Seguimiento y trazabilidad operativa" },
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
      "Monitoreo continuo, reportes de la operaci\u00f3n, BMR del proyecto (Business Monthly Review), optimizaci\u00f3n constante para maximizaci\u00f3n de los resultados.",
  },
];

export const targets: TargetCard[] = [
  {
    emoji: "🏭",
    title: "PyMEs Manufactureras",
    description:
      "Empresas manufactureras con producci\u00f3n nacional que necesitan outsourcing log\u00edstico profesional para escalar.",
  },
  {
    emoji: "🛒",
    title: "E-commerce en Crecimiento",
    description:
      "Negocios en crecimiento que buscan fulfillment profesional y quieren crecer sin almacén e infraestructuras propias.",
  },
  {
    emoji: "🗺️",
    title: "Distribuidores Regionales",
    description:
      "Operan en m\u00faltiples regiones y necesitan almacenes estrat\u00e9gicos en ZMG y Monterrey para optimizar costos de distribuci\u00f3n.",
  },
  {
    emoji: "✈️",
    title: "Importadores y Exportadores",
    description:
      "Empresas que requieren almacenaje aduanal en ZMG y Monterrey, gesti\u00f3n de inventarios y transporte multimodal integrado.",
  },
];

export const cta = {
  tag: "Empecemos",
  titleLines: ["\u00bfListo para optimizar", "tu log\u00edstica?"],
  subtitle:
    "Escr\u00edbenos por WhatsApp y te compartiremos una propuesta personalizada para tu operaci\u00f3n. Sin compromisos.",
  whatsappHref:
    "https://wa.me/523321847482?text=Hola%2C%20quiero%20una%20cotizaci%C3%B3n%20personalizada%20para%20mi%20empresa%20con%20Lynkargo.",
  whatsappLabel: "Escribir por WhatsApp",
  telHref: "tel:+523321847482",
  telLabel: "Llamar ahora",
  location: "📍 Guadalajara, Jalisco \u00a0\u00b7\u00a0 Cobertura ZMG y Monterrey \u00a0\u00b7\u00a0 contacto@lynkargo.com",
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

