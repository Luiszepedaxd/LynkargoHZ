import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export default function SEO({
  title = 'Lynkargo - Conectando la Logística del Futuro',
  description = 'La primera plataforma B2B que une empresas con proveedores de transporte y almacenamiento mediante tecnología inteligente de matching automático.',
  keywords = 'logística, transporte, almacenamiento, B2B, México, proveedores, servicios logísticos',
  image = '/og-image.jpg',
  url = 'https://lynkargo.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Lynkargo'
}: SEOProps) {
  const fullTitle = title === 'Lynkargo - Conectando la Logística del Futuro' 
    ? title 
    : `${title} | Lynkargo`

  return (
    <Head>
      {/* Meta tags básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="es" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Lynkargo" />
      <meta property="og:locale" content="es_MX" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:site" content="@lynkargo" />
      
      {/* Artículos específicos */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Meta tags adicionales para SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preconnect para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://eddhbaovqdecryoanmik.supabase.co" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data / JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Lynkargo",
            "url": "https://lynkargo.com",
            "logo": "https://lynkargo.com/logo.png",
            "description": description,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "MX",
              "addressRegion": "México"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "contacto@lynkargo.com"
            },
            "sameAs": [
              "https://twitter.com/lynkargo",
              "https://linkedin.com/company/lynkargo",
              "https://facebook.com/lynkargo"
            ]
          })
        }}
      />
    </Head>
  )
}
