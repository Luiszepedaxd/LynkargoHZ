import { NextRequest, NextResponse } from 'next/server'
import { createContextService } from '@/lib/services/context.service'
import { z } from 'zod'

const contextService = createContextService()

// Schema de validación para cambio de contexto
const switchContextSchema = z.object({
  activeRole: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN']),
  activeOrganizationId: z.string().optional()
})

// GET - Obtener contexto actual y opciones de cambio
export async function GET() {
  try {
    // TODO: Obtener userId del token de autenticación
    const userId = 'temp-user-id' // Reemplazar con autenticación real

    const [currentContext, switchOptions] = await Promise.all([
      contextService.getCurrentContext(userId),
      contextService.getContextSwitchOptions(userId)
    ])

    if (!currentContext.success) {
      return NextResponse.json(
        { success: false, message: currentContext.error },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        currentContext: currentContext.data,
        switchOptions: switchOptions.data
      }
    })

  } catch (error) {
    console.error('Error obteniendo contexto:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Cambiar contexto del usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = switchContextSchema.parse(body)
    
    // TODO: Obtener userId del token de autenticación
    const userId = 'temp-user-id' // Reemplazar con autenticación real

    const result = await contextService.switchContext(
      userId,
      validatedData.activeRole,
      validatedData.activeOrganizationId
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    })

  } catch (error) {
    console.error('Error cambiando contexto:', error)
    
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
