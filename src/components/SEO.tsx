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
  description = 'Intermediación logística 3PL - Almacenaje, transporte y distribución en México.',
  url = 'https://www.lynkargo.com',
  logo = 'https://www.lynkargo.com/logo.png',
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
        "alternateName": "Lynkargo Logistics",
        "logo": logo,
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
        "serviceType": ["3PL Logistics", "Warehousing", "Transportation", "Fulfillment"],
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
