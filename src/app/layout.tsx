import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lynkargo — Tu Socio Estratégico en Logística 3PL",
  description:
    "Intermediación logística 3PL integral. Conectamos tu empresa con proveedores certificados en la ZMG, reduciendo costos y liberando a tu equipo para crecer.",
  keywords:
    "lynkargo, logística 3PL, almacenaje México, transporte de carga, fulfillment, distribución, intermediación logística",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.lynkargo.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lynkargo",
    url: "https://www.lynkargo.com",
    description:
      "Intermediación logística 3PL - Almacenaje, transporte y distribución en México",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guadalajara",
      addressRegion: "Jalisco",
      addressCountry: "MX",
    },
    areaServed: "MX",
    serviceType: ["3PL Logistics", "Warehousing", "Transportation", "Fulfillment"],
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}

