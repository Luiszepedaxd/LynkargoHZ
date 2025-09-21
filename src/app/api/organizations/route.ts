import { NextRequest } from 'next/server'
import { PrismaOrganizationRepository } from '@/lib/repositories/organization.repository'
import { createOrganizationService } from '@/lib/services/organization.service'
import { OrganizationNotificationService } from '@/lib/services/organization-notification.service'
import { NotificationService } from '@/lib/services/notification.service'
import { createOrganizationSchema } from '@/lib/utils/validation.schemas'
import {
  successResponse,
  errorResponse,
  handleGenericError
} from '@/lib/utils/api.utils'

// Factory function para crear dependencias (Principio de Inversión de Dependencias)
function createDependencies() {
  const organizationRepository = new PrismaOrganizationRepository()
  const notificationService = new NotificationService()
  const organizationNotificationService = new OrganizationNotificationService(notificationService)
  const organizationService = createOrganizationService(organizationRepository, organizationNotificationService)
  
  return { organizationService }
}

// GET - Obtener organizaciones del usuario
export async function GET(_request: NextRequest) {
  try {
    // TODO: Obtener userId del token de autenticación
    const userId = 'temp-user-id' // Reemplazar con autenticación real

    const { organizationService } = createDependencies()
    const result = await organizationService.getUserOrganizations(userId)

    if (!result.success) {
      return errorResponse(result.error || 'Error al obtener organizaciones', 500)
    }

    return successResponse(result.data, 'Organizaciones obtenidas exitosamente')

  } catch (error) {
    return handleGenericError(error, 'GET /api/organizations')
  }
}

// POST - Crear nueva organización
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = createOrganizationSchema.parse(body)
    
    // TODO: Obtener userId del token de autenticación
    const userId = 'temp-user-id' // Reemplazar con autenticación real

    const { organizationService } = createDependencies()
    const result = await organizationService.createOrganization(validatedData, userId)

    if (!result.success) {
      return errorResponse(result.error || 'Error al crear organización', 400)
    }

    return successResponse(result.data, 'Organización creada exitosamente', 201)

  } catch (error) {
    return handleGenericError(error, 'POST /api/organizations')
  }
}
