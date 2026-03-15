'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { unsplash } from '@/lib/constants/unsplash'

const ctaFormSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  empresa: z.string().optional(),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  mensaje: z.string().optional()
})
type CtaFormData = z.infer<typeof ctaFormSchema>

const services = [
  {
    title: 'Almacenaje y Gestión de Inventarios',
    items: [
      'Almacenamiento temporal y de largo plazo',
      'Administración completa de inventarios',
      'Instalaciones certificadas y seguras',
      'Manejo de mercancía especializada'
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    )
  },
  {
    title: 'Transporte y Distribución',
    items: [
      'Fletes nacionales e internacionales',
      'Transporte intermodal',
      'Distribución last-mile',
      'Optimización de rutas'
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  },
  {
    title: 'Operaciones 3PL',
    items: [
      'Carga y descarga de mercancías',
      'Maniobras especializadas',
      'Etiquetado y reempaque',
      'Armado de pedidos (picking & packing)'
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    )
  },
  {
    title: 'Fulfillment y E-commerce',
    items: [
      'Recepción de mercancía',
      'Almacenaje dinámico',
      'Procesamiento de órdenes',
      'Empaque y envío directo'
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M7.5 4.21l4.5 2.6 4.5-2.6M12 22V12" />
      </svg>
    )
  },
  {
    title: 'Servicios Especializados',
    items: [
      'Verificación y auditoría de productos',
      'Control de calidad',
      'Destrucción certificada de mercancías',
      'Disposición conforme a normativas'
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Consultoría Logística (próximamente)',
    items: [
      'Asesoría en certificaciones (ISO, etc.)',
      'Optimización de cadena de suministro',
      'Cumplimiento normativo',
      'Auditorías logísticas'
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    )
  }
]

export default function Features() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CtaFormData>({
    resolver: zodResolver(ctaFormSchema)
  })

  const onSubmitCta = async (data: CtaFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (result.success) {
        setMessageType('success')
        setSubmitMessage(result.message)
        reset()
      } else {
        setMessageType('error')
        setSubmitMessage(result.message ?? 'Error al enviar.')
      }
    } catch {
      setMessageType('error')
      setSubmitMessage('Hubo un error. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(''), 5000)
    }
  }

  return (
    <>
      {/* Qué es Lynkargo */}
      <section id="que-es" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              <Image
                src={unsplash.aboutLogistics}
                alt="Logística y almacenaje - operaciones 3PL"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
                Qué es Lynkargo
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Soluciones Logísticas Integrales para tu Empresa
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Somos intermediarios especializados en servicios 3PL. Gestionamos todas tus necesidades logísticas: desde almacenaje hasta distribución final, liberando a tu equipo para enfocarse en el core de tu negocio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="caracteristicas" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
              Servicios
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir Lynkargo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experiencia, servicio personalizado y una red de socios estratégicos para soluciones logísticas a medida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <ul className="text-gray-600 leading-relaxed space-y-2">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA con formulario */}
          <div id="contacto" className="text-center mt-16 scroll-mt-24">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-10 text-white text-left">
              <h3 className="text-2xl font-bold mb-2 text-center">
                ¿Listo para optimizar tu logística?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-center">
                Contáctanos hoy y recibe una cotización personalizada sin compromiso. Nuestro equipo de expertos analizará tus necesidades y diseñará la solución logística perfecta para tu empresa.
              </p>
              <form onSubmit={handleSubmit(onSubmitCta)} className="max-w-xl mx-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cta-nombre" className="block text-sm font-medium text-white/90 mb-1">Nombre</label>
                    <input
                      {...register('nombre')}
                      id="cta-nombre"
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                    {errors.nombre && <p className="mt-1 text-sm text-red-200">{errors.nombre.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="cta-empresa" className="block text-sm font-medium text-white/90 mb-1">Empresa</label>
                    <input
                      {...register('empresa')}
                      id="cta-empresa"
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent"
                      placeholder="Tu empresa"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cta-email" className="block text-sm font-medium text-white/90 mb-1">Email</label>
                    <input
                      {...register('email')}
                      id="cta-email"
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent"
                      placeholder="correo@empresa.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-200">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="cta-telefono" className="block text-sm font-medium text-white/90 mb-1">Teléfono</label>
                    <input
                      {...register('telefono')}
                      id="cta-telefono"
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent"
                      placeholder="(55) 1234 5678"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cta-mensaje" className="block text-sm font-medium text-white/90 mb-1">Mensaje</label>
                  <textarea
                    {...register('mensaje')}
                    id="cta-mensaje"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="Cuéntanos tus necesidades"
                  />
                </div>
                {submitMessage && (
                  <p className={`text-sm ${messageType === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                    {submitMessage}
                  </p>
                )}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Cotización Gratis'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
