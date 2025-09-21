import { NextRequest, NextResponse } from 'next/server'
import { createContextService } from '@/lib/services/context.service'
import { createOrganizationService } from '@/lib/services/organization.service'
import { RegisterFormData, PlatformRole } from '@/types'
import { z } from 'zod'

const contextService = createContextService()

// Schema de validación para registro
const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  telefono: z.string().optional(),
  initialRole: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN']).default('CLIENTE')
})

// POST - Registrar nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = registerSchema.parse(body)
    
    // TODO: Implementar creación de usuario con Supabase
    // Por ahora simulamos la creación
    const newUser = {
      id: 'temp-user-id-' + Date.now(),
      email: validatedData.email,
      nombre: validatedData.nombre,
      telefono: validatedData.telefono,
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Crear contexto inicial
    const contextResult = await contextService.createInitialContext(
      newUser.id,
      validatedData.initialRole
    )

    if (!contextResult.success) {
      return NextResponse.json(
        { success: false, message: 'Error al crear contexto inicial' },
        { status: 500 }
      )
    }

    // Si el usuario se registra como proveedor, crear organización por defecto
    let organization = null
    if (validatedData.initialRole === 'PROVEEDOR') {
      // TODO: Crear organización por defecto para proveedores
      organization = {
        id: 'temp-org-id-' + Date.now(),
        nombre: `${validatedData.nombre} - Servicios`,
        tipo: 'PROVEEDOR' as const
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: newUser,
        context: contextResult.data,
        organization
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error registrando usuario:', error)
    
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
