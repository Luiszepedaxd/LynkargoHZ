import { NextRequest } from 'next/server'
import { PrismaOrganizationRepository } from '@/lib/repositories/organization.repository'
import { createOrganizationService } from '@/lib/services/organization.service'
import { OrganizationNotificationService } from '@/lib/services/organization-notification.service'
import { NotificationService } from '@/lib/services/notification.service'
import { NotificationProvider } from '@/lib/providers/notification.provider'
import { createPermissionsService } from '@/lib/services/permissions.service'
import { createOrganizationSchema } from '@/lib/utils/validation.schemas'
import {
  successResponse,
  errorResponse,
  handleGenericError
} from '@/lib/utils/api.utils'

// Factory function para crear dependencias (Principio de Inversión de Dependencias)
function createDependencies() {
  const organizationRepository = new PrismaOrganizationRepository()
  
  // Mock notification provider para desarrollo
  const notificationProvider: NotificationProvider = {
    async sendWelcomeEmail() {
      return { success: true, message: 'Mock email sent' }
    },
    async sendConfirmationEmail() {
      return { success: true, message: 'Mock email sent' }
    },
    async subscribeToNewsletter() {
      return { success: true, message: 'Mock email sent' }
    }
  }
  
  const notificationService = new NotificationService(notificationProvider)
  const organizationNotificationService = new OrganizationNotificationService(notificationService)
  const organizationService = createOrganizationService(organizationRepository, organizationNotificationService)
  const permissionsService = createPermissionsService()
  
  return { organizationService, permissionsService }
}

// GET - Obtener organizaciones del usuario
export async function GET() {
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

    const { organizationService, permissionsService } = createDependencies()
    
    // Verificar permisos para crear organización
    const canCreate = await permissionsService.canPerformAction(userId, 'canCreateServices')
    if (!canCreate) {
      return errorResponse('No tienes permisos para crear organizaciones', 403)
    }

    const result = await organizationService.createOrganization(validatedData, userId)

    if (!result.success) {
      return errorResponse(result.error || 'Error al crear organización', 400)
    }

    return successResponse(result.data, 'Organización creada exitosamente', 201)

  } catch (error) {
    return handleGenericError(error, 'POST /api/organizations')
  }
}
