import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import type { NotificationType } from '@prisma/client'

// Schema de validación para crear notificación
const createNotificationSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  tipo: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'INVITATION', 'ROLE_CHANGE', 'ORDER_UPDATE']),
  titulo: z.string().min(2, 'Título requerido'),
  mensaje: z.string().min(5, 'Mensaje requerido'),
  accionUrl: z.string().optional(),
  accionTexto: z.string().optional(),
  leida: z.boolean().default(false)
})

// GET - Obtener notificaciones del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const tipo = searchParams.get('tipo')
    const leida = searchParams.get('leida')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario requerido' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Construir filtros
    const where: { userId: string; tipo?: NotificationType; leida?: boolean } = { userId }
    if (tipo) where.tipo = tipo as NotificationType
    if (leida !== null) where.leida = leida === 'true'

    // Obtener notificaciones con paginación
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva notificación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = createNotificationSchema.parse(body)
    
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
    
    // Crear notificación
    const newNotification = await prisma.notification.create({
      data: {
        userId: validatedData.userId,
        tipo: validatedData.tipo,
        titulo: validatedData.titulo,
        mensaje: validatedData.mensaje,
        accionUrl: validatedData.accionUrl,
        accionTexto: validatedData.accionTexto,
        leida: validatedData.leida
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Notificación creada exitosamente',
      data: { 
        id: newNotification.id, 
        titulo: newNotification.titulo,
        tipo: newNotification.tipo
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creando notificación:', error)
    
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

// PUT - Marcar notificación como leída
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, leida } = body
    
    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: 'ID de notificación requerido' },
        { status: 400 }
      )
    }
    
    // Actualizar notificación
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { leida: leida !== undefined ? leida : true }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Notificación actualizada exitosamente',
      data: { 
        id: updatedNotification.id, 
        leida: updatedNotification.leida
      }
    })
    
  } catch (error) {
    console.error('Error actualizando notificación:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
