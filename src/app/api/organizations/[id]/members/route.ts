import { NextRequest } from 'next/server'
import { PrismaOrganizationRepository } from '@/lib/repositories/organization.repository'
import { createOrganizationService } from '@/lib/services/organization.service'
import { OrganizationNotificationService } from '@/lib/services/organization-notification.service'
import { NotificationService } from '@/lib/services/notification.service'
import { inviteMemberSchema } from '@/lib/utils/validation.schemas'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  handleGenericError,
  extractPaginationParams
} from '@/lib/utils/api.utils'

// Factory function para crear dependencias
function createDependencies() {
  const organizationRepository = new PrismaOrganizationRepository()
  const notificationService = new NotificationService()
  const organizationNotificationService = new OrganizationNotificationService(notificationService)
  const organizationService = createOrganizationService(organizationRepository, organizationNotificationService)
  
  return { organizationService }
}

// GET - Obtener miembros de la organización
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search } = extractPaginationParams(searchParams)
    
    // TODO: Obtener userId del token de autenticación
    // const userId = 'temp-user-id' // Reemplazar con autenticación real

    const resolvedParams = await params
    const { organizationService } = createDependencies()
    const result = await organizationService.getOrganizationMembers(resolvedParams.id, { page, limit, search })

    if (!result.success) {
      return errorResponse(result.error || 'Error al obtener miembros', 500)
    }

    return paginatedResponse(result.data, result.pagination!)

  } catch (error) {
    return handleGenericError(error, 'GET /api/organizations/[id]/members')
  }
}

// POST - Invitar nuevo miembro
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    
    const resolvedParams = await params
    
    // Validar datos de entrada
    const validatedData = inviteMemberSchema.parse({
      ...body,
      organizationId: resolvedParams.id
    })
    
    // TODO: Obtener userId del token de autenticación
    const userId = 'temp-user-id' // Reemplazar con autenticación real

    const { organizationService } = createDependencies()
    const result = await organizationService.inviteMember(validatedData, userId)

    if (!result.success) {
      return errorResponse(result.error || 'Error al invitar miembro', 400)
    }

    return successResponse(result.data, 'Invitación enviada exitosamente', 201)

  } catch (error) {
    return handleGenericError(error, 'POST /api/organizations/[id]/members')
  }
}
