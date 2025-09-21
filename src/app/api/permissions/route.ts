import { NextRequest, NextResponse } from 'next/server'
import { createPermissionsService } from '@/lib/services/permissions.service'

const permissionsService = createPermissionsService()

// GET - Obtener permisos del usuario en contexto actual
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    
    // TODO: Obtener userId del token de autenticación
    const userId = 'temp-user-id' // Reemplazar con autenticación real

    const result = await permissionsService.getUserPermissions(
      userId,
      organizationId || undefined
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    console.error('Error obteniendo permisos:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Verificar permiso específico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { permission, organizationId } = body
    
    if (!permission) {
      return NextResponse.json(
        { success: false, message: 'Permiso requerido' },
        { status: 400 }
      )
    }
    
    // TODO: Obtener userId del token de autenticación
    const userId = 'temp-user-id' // Reemplazar con autenticación real

    const result = await permissionsService.checkRoutePermission(
      userId,
      permission,
      organizationId
    )

    return NextResponse.json({
      success: result.success,
      message: result.error || 'Permiso verificado',
      data: result.data
    })

  } catch (error) {
    console.error('Error verificando permiso:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
