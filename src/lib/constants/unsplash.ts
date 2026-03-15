/**
 * URLs de imágenes Unsplash para Lynkargo.
 * Formato: https://images.unsplash.com/photo-{id}?w={ancho}&q=80
 * Ver: https://unsplash.com (atribución recomendada en UI o footer)
 */

const BASE = 'https://images.unsplash.com'

export const unsplash = {
  /** Hero: almacén/logística (fondo del banner principal) */
  heroBackground: `${BASE}/photo-1586528116311-ad8dd3c8310d?w=1920&q=80`,
  /** Sección "Qué es Lynkargo": transporte o almacén */
  aboutLogistics: `${BASE}/photo-1545324418-cc1a3fa10c00?w=800&q=80`,
  /** Opcional: camión o distribución */
  transport: `${BASE}/photo-1605743308617-7bb2b2c1e2f5?w=800&q=80`,
} as const
