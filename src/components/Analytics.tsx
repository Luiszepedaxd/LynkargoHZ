'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Configuración de Google Analytics
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Función para enviar pageview a GA
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    })
  }
}

// Función para enviar eventos personalizados
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Función para tracking de conversiones
export const trackConversion = (conversionId: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
    })
  }
}

// Función para tracking de newsletter
export const trackNewsletterSignup = (email: string) => {
  event({
    action: 'newsletter_signup',
    category: 'engagement',
    label: email,
  })
}

// Función para tracking de registro
export const trackRegistration = (userType: string) => {
  event({
    action: 'user_registration',
    category: 'engagement',
    label: userType,
  })
}

// Función para tracking de login
export const trackLogin = (method: string) => {
  event({
    action: 'user_login',
    category: 'engagement',
    label: method,
  })
}

// Función para tracking de búsquedas
export const trackSearch = (query: string, results: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: query,
    value: results,
  })
}

// Función para tracking de clicks en botones
export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'button_click',
    category: 'engagement',
    label: `${buttonName}_${location}`,
  })
}

// Hook para tracking automático de navegación
export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = searchParams?.size 
        ? `${pathname}?${searchParams.toString()}`
        : pathname
      
      pageview(url)
    }
  }, [pathname, searchParams])
}

// Componente principal de Analytics
export default function Analytics() {
  usePageTracking()

  // Cargar Google Analytics
  useEffect(() => {
    if (!GA_TRACKING_ID) return

    // Cargar script de GA
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    script.async = true
    document.head.appendChild(script)

    // Configurar gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // Cargar Google Tag Manager si está configurado
  useEffect(() => {
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
    if (!GTM_ID) return

    // Cargar GTM
    const script = document.createElement('script')
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `
    document.head.appendChild(script)

    // Cargar noscript de GTM
    const noscript = document.createElement('noscript')
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.display = 'none'
    iframe.style.visibility = 'hidden'
    noscript.appendChild(iframe)
    document.body.appendChild(noscript)

    return () => {
      document.head.removeChild(script)
      document.body.removeChild(noscript)
    }
  }, [])

  return null
}

// Componente para tracking de performance
export function PerformanceTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Tracking de Core Web Vitals
    const trackCLS = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              const cls = (entry as PerformanceEntry & { value?: number }).value
              if (cls !== undefined) {
                event({
                  action: 'layout_shift',
                  category: 'performance',
                  value: Math.round(cls * 1000) / 1000,
                })
              }
            }
          }
        })
        observer.observe({ entryTypes: ['layout-shift'] })
      }
    }

    const trackFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'first-input') {
              const fidEntry = entry as PerformanceEntry & { processingStart: number; startTime: number }
              const fid = fidEntry.processingStart - fidEntry.startTime
              event({
                action: 'first_input_delay',
                category: 'performance',
                value: Math.round(fid),
              })
            }
          }
        })
        observer.observe({ entryTypes: ['first-input'] })
      }
    }

    const trackLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              const lcp = entry.startTime
              event({
                action: 'largest_contentful_paint',
                category: 'performance',
                value: Math.round(lcp),
              })
            }
          }
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      }
    }

    trackCLS()
    trackFID()
    trackLCP()
  }, [])

  return null
}

// Tipos para TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}
