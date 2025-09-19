import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { newsletterSchema } from '@/lib/utils/validation.schemas'
import {
  successResponse,
  errorResponse,
  handleGenericError
} from '@/lib/utils/api.utils'

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
        return errorResponse('Este correo ya está suscrito al newsletter', 400)
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
        
        return successResponse(
          null,
          '¡Bienvenido de vuelta! Tu suscripción ha sido reactivada.'
        )
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
    
    return successResponse(
      { id: newSubscriber.id, email: newSubscriber.email },
      '¡Gracias por suscribirte! Te notificaremos cuando estemos listos.',
      201
    )
    
  } catch (error) {
    return handleGenericError(error, 'POST /api/newsletter')
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
    
    return successResponse({
      data: subscribers,
      total: subscribers.length
    })
    
  } catch (error) {
    return handleGenericError(error, 'GET /api/newsletter')
  }
}
