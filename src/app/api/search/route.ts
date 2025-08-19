import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para búsqueda
const searchSchema = z.object({
  query: z.string().min(1, 'Término de búsqueda requerido'),
  tipo: z.enum(['PROVEEDOR', 'SERVICIO', 'UBICACION']).optional(),
  ciudad: z.string().optional(),
  estado: z.string().optional(),
  servicio: z.string().optional(),
  precioMin: z.number().min(0).optional(),
  precioMax: z.number().min(0).optional(),
  calificacion: z.number().min(0).max(5).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10)
})

// GET - Búsqueda avanzada
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extraer parámetros de búsqueda
    const query = searchParams.get('query') || ''
    const tipo = searchParams.get('tipo') as any
    const ciudad = searchParams.get('ciudad')
    const estado = searchParams.get('estado')
    const servicio = searchParams.get('servicio')
    const precioMin = searchParams.get('precioMin') ? parseFloat(searchParams.get('precioMin')!) : undefined
    const precioMax = searchParams.get('precioMax') ? parseFloat(searchParams.get('precioMax')!) : undefined
    const calificacion = searchParams.get('calificacion') ? parseFloat(searchParams.get('calificacion')!) : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // Validar parámetros
    const validatedParams = searchSchema.parse({
      query,
      tipo,
      ciudad,
      estado,
      servicio,
      precioMin,
      precioMax,
      calificacion,
      page,
      limit
    })

    let results: any = {}
    let total = 0

    // Búsqueda por tipo específico
    if (tipo === 'PROVEEDOR') {
      const where: any = {
        activo: true,
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { descripcion: { contains: query, mode: 'insensitive' } }
        ]
      }

      if (ciudad || estado) {
        where.ubicaciones = {
          some: {}
        }
        if (ciudad) where.ubicaciones.some.ciudad = { contains: ciudad, mode: 'insensitive' }
        if (estado) where.ubicaciones.some.estado = { contains: estado, mode: 'insensitive' }
      }

      if (servicio) {
        where.servicios = {
          some: {
            nombre: { contains: servicio, mode: 'insensitive' }
          }
        }
      }

      if (calificacion) {
        where.calificacion = { gte: calificacion }
      }

      const [providers, providerCount] = await Promise.all([
        prisma.provider.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            servicios: {
              where: { activo: true }
            },
            ubicaciones: {
              where: { activo: true }
            },
            _count: {
              select: {
                orders: true,
                reviews: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { calificacion: 'desc' }
        }),
        prisma.provider.count({ where })
      ])

      results.proveedores = providers
      total = providerCount

    } else if (tipo === 'SERVICIO') {
      const where: any = {
        activo: true,
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { descripcion: { contains: query, mode: 'insensitive' } }
        ]
      }

      if (precioMin !== undefined || precioMax !== undefined) {
        where.precio = {}
        if (precioMin !== undefined) where.precio.gte = precioMin
        if (precioMax !== undefined) where.precio.lte = precioMax
      }

      const [services, serviceCount] = await Promise.all([
        prisma.service.findMany({
          where,
          include: {
            provider: {
              include: {
                user: {
                  select: {
                    id: true,
                    nombre: true,
                    email: true
                  }
                },
                ubicaciones: {
                  where: { activo: true }
                }
              }
            }
          },
          skip,
          take: limit,
          orderBy: { precio: 'asc' }
        }),
        prisma.service.count({ where })
      ])

      results.servicios = services
      total = serviceCount

    } else if (tipo === 'UBICACION') {
      const where: any = {
        activo: true,
        OR: [
          { ciudad: { contains: query, mode: 'insensitive' } },
          { estado: { contains: query, mode: 'insensitive' } }
        ]
      }

      if (ciudad) where.ciudad = { contains: ciudad, mode: 'insensitive' }
      if (estado) where.estado = { contains: estado, mode: 'insensitive' }

      const [locations, locationCount] = await Promise.all([
        prisma.location.findMany({
          where,
          include: {
            provider: {
              include: {
                user: {
                  select: {
                    id: true,
                    nombre: true,
                    email: true
                  }
                },
                servicios: {
                  where: { activo: true }
                }
              }
            }
          },
          skip,
          take: limit,
          orderBy: { ciudad: 'asc' }
        }),
        prisma.location.count({ where })
      ])

      results.ubicaciones = locations
      total = locationCount

    } else {
      // Búsqueda general en todos los tipos
      const [providers, services, locations] = await Promise.all([
        prisma.provider.findMany({
          where: {
            activo: true,
            OR: [
              { nombre: { contains: query, mode: 'insensitive' } },
              { descripcion: { contains: query, mode: 'insensitive' } }
            ]
          },
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            servicios: {
              where: { activo: true }
            },
            ubicaciones: {
              where: { activo: true }
            }
          },
          take: Math.ceil(limit / 3),
          orderBy: { calificacion: 'desc' }
        }),
        prisma.service.findMany({
          where: {
            activo: true,
            OR: [
              { nombre: { contains: query, mode: 'insensitive' } },
              { descripcion: { contains: query, mode: 'insensitive' } }
            ]
          },
          include: {
            provider: {
              include: {
                user: {
                  select: {
                    id: true,
                    nombre: true,
                    email: true
                  }
                }
              }
            }
          },
          take: Math.ceil(limit / 3),
          orderBy: { precio: 'asc' }
        }),
        prisma.location.findMany({
          where: {
            activo: true,
            OR: [
              { ciudad: { contains: query, mode: 'insensitive' } },
              { estado: { contains: query, mode: 'insensitive' } }
            ]
          },
          include: {
            provider: {
              include: {
                user: {
                  select: {
                    id: true,
                    nombre: true,
                    email: true
                  }
                }
              }
            }
          },
          take: Math.ceil(limit / 3),
          orderBy: { ciudad: 'asc' }
        })
      ])

      results = {
        proveedores: providers,
        servicios: services,
        ubicaciones: locations
      }
      total = providers.length + services.length + locations.length
    }

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      query: validatedParams
    })

  } catch (error) {
    console.error('Error en búsqueda:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Parámetros de búsqueda inválidos', errors: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
