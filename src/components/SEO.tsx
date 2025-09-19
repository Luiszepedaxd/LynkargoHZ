interface StructuredDataProps {
  type?: 'Organization' | 'WebSite' | 'Article'
  name?: string
  description?: string
  url?: string
  logo?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export default function StructuredData({
  type = 'Organization',
  name = 'Lynkargo',
  description = 'La primera plataforma B2B que une empresas con proveedores de transporte y almacenamiento mediante tecnología inteligente de matching automático.',
  url = 'https://lynkargo.com',
  logo = 'https://lynkargo.com/logo.png',
  author = 'Lynkargo',
  publishedTime,
  modifiedTime
}: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      "name": name,
      "description": description,
      "url": url
    }

    if (type === 'Organization') {
      return {
        ...baseData,
        "logo": logo,
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
      }
    }

    if (type === 'Article') {
      return {
        ...baseData,
        "author": {
          "@type": "Person",
          "name": author
        },
        ...(publishedTime && { "datePublished": publishedTime }),
        ...(modifiedTime && { "dateModified": modifiedTime })
      }
    }

    return baseData
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  )
}
