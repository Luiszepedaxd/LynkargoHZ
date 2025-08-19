import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para el newsletter
const newsletterSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  nombre: z.string().optional(),
  empresa: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = newsletterSchema.parse(body)
    
    // Verificar si el email ya existe
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingSubscriber) {
      if (existingSubscriber.activo) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Este correo ya está suscrito al newsletter' 
          },
          { status: 400 }
        )
      } else {
        // Reactivar suscripción
        await prisma.newsletterSubscriber.update({
          where: { id: existingSubscriber.id },
          data: { 
            activo: true,
            nombre: validatedData.nombre,
            empresa: validatedData.empresa,
            updatedAt: new Date()
          }
        })
        
        return NextResponse.json({
          success: true,
          message: '¡Bienvenido de vuelta! Tu suscripción ha sido reactivada.'
        })
      }
    }
    
    // Crear nueva suscripción
    const newSubscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: validatedData.email,
        nombre: validatedData.nombre,
        empresa: validatedData.empresa
      }
    })
    
    return NextResponse.json({
      success: true,
      message: '¡Gracias por suscribirte! Te notificaremos cuando estemos listos.',
      data: {
        id: newSubscriber.id,
        email: newSubscriber.email
      }
    })
    
  } catch (error) {
    console.error('Error en newsletter API:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Datos inválidos', 
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { activo: true },
      select: {
        id: true,
        email: true,
        nombre: true,
        empresa: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({
      success: true,
      data: subscribers,
      total: subscribers.length
    })
    
  } catch (error) {
    console.error('Error obteniendo suscriptores:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}
