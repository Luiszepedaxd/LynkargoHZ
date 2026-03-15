import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lynkargo - Intermediación Logística 3PL | Almacenaje y Transporte en México",
  description: "Lynkargo ofrece servicios integrales de intermediación logística 3PL: almacenaje, transporte nacional e internacional, fulfillment y distribución. Soluciones personalizadas para tu empresa en México.",
  keywords: "lynkargo, logística 3PL, almacenaje México, transporte de carga, fulfillment, distribución, intermediación logística, warehouse, fletes nacionales",
  authors: [{ name: "Lynkargo" }],
  creator: "Lynkargo",
  publisher: "Lynkargo",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://www.lynkargo.com",
    title: "Lynkargo - Intermediación Logística 3PL | Almacenaje y Transporte en México",
    description: "Lynkargo ofrece servicios integrales de intermediación logística 3PL: almacenaje, transporte nacional e internacional, fulfillment y distribución. Soluciones personalizadas para tu empresa en México.",
    siteName: "Lynkargo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lynkargo - Intermediación Logística 3PL"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@lynkargo",
    creator: "@lynkargo",
    title: "Lynkargo - Intermediación Logística 3PL | Almacenaje y Transporte en México",
    description: "Lynkargo ofrece servicios integrales de intermediación logística 3PL: almacenaje, transporte nacional e internacional, fulfillment y distribución. Soluciones personalizadas para tu empresa en México.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#2563eb" }
    ]
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.lynkargo.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Lynkargo",
    "alternateName": "Lynkargo Logistics",
    "url": "https://www.lynkargo.com",
    "logo": "https://www.lynkargo.com/logo.png",
    "description": "Intermediación logística 3PL - Almacenaje, transporte y distribución en México",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Guadalajara",
      "addressRegion": "Jalisco",
      "addressCountry": "MX"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.6597,
      "longitude": -103.3496
    },
    "areaServed": "MX",
    "serviceType": ["3PL Logistics", "Warehousing", "Transportation", "Fulfillment"]
  };

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
