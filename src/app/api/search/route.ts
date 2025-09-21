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
    const tipo = searchParams.get('tipo') as string | null
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

    let results: { 
      proveedores?: Array<{
        id: string;
        nombre: string;
        descripcion?: string | null;
        organization: { id: string; nombre: string; tipo: string };
        services: Array<{ id: string; nombre: string; precio?: number | null }>;
        locations: Array<{ id: string; ciudad: string; estado: string }>;
        _count: { orders: number };
      }>;
      servicios?: Array<{
        id: string;
        nombre: string;
        descripcion?: string | null;
        precio?: number | null;
        provider: {
          id: string;
          nombre: string;
          organization: { id: string; nombre: string; tipo: string };
          locations: Array<{ id: string; ciudad: string; estado: string }>;
        };
      }>;
      ubicaciones?: Array<{
        id: string;
        ciudad: string;
        estado: string;
        provider: {
          id: string;
          nombre: string;
          organization: { id: string; nombre: string; tipo: string };
          services: Array<{ id: string; nombre: string; precio?: number | null }>;
        };
      }>;
    } = {}
    let total = 0

    // Búsqueda por tipo específico
    if (tipo === 'PROVEEDOR') {
      const where: {
        activo: boolean;
        OR: Array<{ nombre?: { contains: string; mode: 'insensitive' }; descripcion?: { contains: string; mode: 'insensitive' } }>;
        ubicaciones?: { some: { ciudad?: { contains: string; mode: 'insensitive' }; estado?: { contains: string; mode: 'insensitive' } } };
        servicios?: { some: { nombre: { contains: string; mode: 'insensitive' } } };
        calificacion?: { gte: number };
      } = {
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

      // Campo calificacion no existe en el modelo Provider
      // if (calificacion) {
      //   where.calificacion = { gte: calificacion }
      // }

      const [providers, providerCount] = await Promise.all([
        prisma.provider.findMany({
          where,
          include: {
            organization: {
              select: {
                id: true,
                nombre: true,
                tipo: true
              }
            },
            services: {
              where: { activo: true }
            },
            locations: {
              where: { activo: true }
            },
            _count: {
              select: {
                orders: true,
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.provider.count({ where })
      ])

      results.proveedores = providers
      total = providerCount

    } else if (tipo === 'SERVICIO') {
      const where: {
        activo: boolean;
        OR: Array<{ nombre?: { contains: string; mode: 'insensitive' }; descripcion?: { contains: string; mode: 'insensitive' } }>;
        precio?: { gte?: number; lte?: number };
      } = {
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
        prisma.providerService.findMany({
          where,
          include: {
            provider: {
              include: {
                organization: {
                  select: {
                    id: true,
                    nombre: true,
                    tipo: true
                  }
                },
                locations: {
                  where: { activo: true }
                }
              }
            }
          },
          skip,
          take: limit,
          orderBy: { precio: 'asc' }
        }),
        prisma.providerService.count({ where })
      ])

      results.servicios = services
      total = serviceCount

    } else if (tipo === 'UBICACION') {
      const where: {
        activo: boolean;
        OR: Array<{ ciudad?: { contains: string; mode: 'insensitive' }; estado?: { contains: string; mode: 'insensitive' } }>;
        ciudad?: { contains: string; mode: 'insensitive' };
        estado?: { contains: string; mode: 'insensitive' };
      } = {
        activo: true,
        OR: [
          { ciudad: { contains: query, mode: 'insensitive' } },
          { estado: { contains: query, mode: 'insensitive' } }
        ]
      }

      if (ciudad) where.ciudad = { contains: ciudad, mode: 'insensitive' }
      if (estado) where.estado = { contains: estado, mode: 'insensitive' }

      const [locations, locationCount] = await Promise.all([
        prisma.providerLocation.findMany({
          where,
          include: {
            provider: {
              include: {
                organization: {
                  select: {
                    id: true,
                    nombre: true,
                    tipo: true
                  }
                },
                services: {
                  where: { activo: true }
                }
              }
            }
          },
          skip,
          take: limit,
          orderBy: { ciudad: 'asc' }
        }),
        prisma.providerLocation.count({ where })
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
            organization: {
              select: {
                id: true,
                nombre: true,
                tipo: true
              }
            },
            services: {
              where: { activo: true }
            },
            locations: {
              where: { activo: true }
            },
            _count: {
              select: {
                orders: true,
              }
            }
          },
          take: Math.ceil(limit / 3),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.providerService.findMany({
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
                organization: {
                  select: {
                    id: true,
                    nombre: true,
                    tipo: true
                  }
                },
                locations: {
                  where: { activo: true }
                }
              }
            }
          },
          take: Math.ceil(limit / 3),
          orderBy: { precio: 'asc' }
        }),
        prisma.providerLocation.findMany({
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
                organization: {
                  select: {
                    id: true,
                    nombre: true,
                    tipo: true
                  }
                },
                services: {
                  where: { activo: true }
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
