import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import type { OrderStatus } from '@prisma/client'

// Schema de validación para crear orden
const createOrderSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  providerId: z.string().optional(),
  servicio: z.string().min(2, 'Servicio requerido'),
  descripcion: z.string().optional(),
  origen: z.string().min(2, 'Origen requerido'),
  destino: z.string().min(2, 'Destino requerido'),
  peso: z.number().positive('El peso debe ser positivo').optional(),
  volumen: z.number().positive('El volumen debe ser positivo').optional(),
  precio: z.number().positive('El precio debe ser positivo').optional(),
  fechaEnvio: z.string().datetime().optional(),
  fechaEntrega: z.string().datetime().optional()
})

// GET - Obtener todas las órdenes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')
    const providerId = searchParams.get('providerId')
    const estado = searchParams.get('estado')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: { 
      userId?: string; 
      providerId?: string; 
      estado?: OrderStatus;
      OR?: Array<{
        servicio?: { contains: string; mode: 'insensitive' };
        descripcion?: { contains: string; mode: 'insensitive' };
        origen?: { contains: string; mode: 'insensitive' };
        destino?: { contains: string; mode: 'insensitive' };
      }>;
    } = {}
    
    if (userId) where.userId = userId
    if (providerId) where.providerId = providerId
    if (estado) where.estado = estado as OrderStatus
    
    if (search) {
      where.OR = [
        { servicio: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
        { origen: { contains: search, mode: 'insensitive' } },
        { destino: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Obtener órdenes con paginación
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
              email: true,
              empresa: true
            }
          },
          provider: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              organization: {
                select: {
                  nombre: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = createOrderSchema.parse(body)
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar si el proveedor existe (si se proporciona)
    if (validatedData.providerId) {
      const existingProvider = await prisma.provider.findUnique({
        where: { id: validatedData.providerId }
      })
      
      if (!existingProvider) {
        return NextResponse.json(
          { success: false, message: 'Proveedor no encontrado' },
          { status: 404 }
        )
      }
    }
    
    // Crear orden
    const newOrder = await prisma.order.create({
      data: {
        userId: validatedData.userId,
        providerId: validatedData.providerId,
        servicio: validatedData.servicio,
        descripcion: validatedData.descripcion,
        origen: validatedData.origen,
        destino: validatedData.destino,
        peso: validatedData.peso,
        volumen: validatedData.volumen,
        precio: validatedData.precio,
        fechaEnvio: validatedData.fechaEnvio ? new Date(validatedData.fechaEnvio) : null,
        fechaEntrega: validatedData.fechaEntrega ? new Date(validatedData.fechaEntrega) : null
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Orden creada exitosamente',
      data: { 
        id: newOrder.id, 
        servicio: newOrder.servicio,
        estado: newOrder.estado
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creando orden:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
