import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lynkargo - Conectando la Logística del Futuro",
  description: "Plataforma B2B que conecta empresas con necesidades logísticas con proveedores de transporte y almacenamiento. Próximamente.",
  keywords: "logística, transporte, almacenamiento, B2B, México, proveedores, servicios logísticos",
  authors: [{ name: "Lynkargo" }],
  creator: "Lynkargo",
  publisher: "Lynkargo",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://lynkargo.com",
    title: "Lynkargo - Conectando la Logística del Futuro",
    description: "La primera plataforma B2B que une empresas con proveedores de transporte y almacenamiento mediante tecnología inteligente de matching automático.",
    siteName: "Lynkargo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lynkargo - Plataforma Logística B2B"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@lynkargo",
    creator: "@lynkargo",
    title: "Lynkargo - Conectando la Logística del Futuro",
    description: "La primera plataforma B2B que une empresas con proveedores de transporte y almacenamiento mediante tecnología inteligente de matching automático.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://lynkargo.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
