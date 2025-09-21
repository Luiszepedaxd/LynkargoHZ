import { OrganizationServiceInterface } from '@/lib/interfaces/organization.interface'
import { OrganizationNotificationInterface } from '@/lib/interfaces/organization.interface'
import { 
  Organization, 
  OrganizationMember, 
  CreateOrganizationFormData, 
  InviteMemberFormData, 
  UpdateMemberRoleData,
  BaseApiResponse,
  BasePaginatedResponse,
  BaseSearchFilters 
} from '@/types'

export class OrganizationService implements OrganizationServiceInterface {
  constructor(
    private organizationRepository: any, // Inyección de dependencia
    private notificationService: OrganizationNotificationInterface
  ) {}

  async createOrganization(
    data: CreateOrganizationFormData, 
    ownerId: string
  ): Promise<BaseApiResponse<Organization>> {
    return this.organizationRepository.create(data, ownerId)
  }

  async getOrganization(id: string): Promise<BaseApiResponse<Organization>> {
    return this.organizationRepository.findById(id)
  }

  async getUserOrganizations(userId: string): Promise<BasePaginatedResponse<Organization>> {
    return this.organizationRepository.findByUserId(userId)
  }

  async updateOrganization(
    id: string, 
    data: Partial<CreateOrganizationFormData>
  ): Promise<BaseApiResponse<Organization>> {
    return this.organizationRepository.update(id, data)
  }

  async deleteOrganization(id: string): Promise<BaseApiResponse<void>> {
    return this.organizationRepository.delete(id)
  }

  async getOrganizationMembers(
    organizationId: string,
    filters?: BaseSearchFilters
  ): Promise<BasePaginatedResponse<OrganizationMember>> {
    return this.organizationRepository.getMembers(organizationId, filters)
  }

  async inviteMember(
    data: InviteMemberFormData,
    inviterId: string
  ): Promise<BaseApiResponse<OrganizationMember>> {
    // Crear la invitación
    const result = await this.organizationRepository.inviteMember(data, inviterId)
    
    if (result.success && result.data) {
      // Enviar notificación de invitación
      await this.notificationService.sendInvitationNotification(result.data)
    }

    return result
  }

  async updateMemberRole(
    data: UpdateMemberRoleData,
    requesterId: string
  ): Promise<BaseApiResponse<OrganizationMember>> {
    const result = await this.organizationRepository.updateMemberRole(data, requesterId)
    
    if (result.success && result.data) {
      // Enviar notificación de cambio de rol
      await this.notificationService.sendRoleChangeNotification(result.data, data.role)
    }

    return result
  }

  async removeMember(
    memberId: string,
    requesterId: string
  ): Promise<BaseApiResponse<void>> {
    // Obtener información del miembro antes de removerlo
    const memberResult = await this.organizationRepository.getMembers(requesterId)
    const member = memberResult.data?.find((m: OrganizationMember) => m.id === memberId)
    
    const result = await this.organizationRepository.removeMember(memberId, requesterId)
    
    if (result.success && member) {
      // Enviar notificación de remoción
      await this.notificationService.sendMemberRemovedNotification(
        member.userId, 
        member.organization?.nombre || 'Organización'
      )
    }

    return result
  }

  async getOrganizationStats(organizationId: string): Promise<BaseApiResponse<any>> {
    return this.organizationRepository.getStats(organizationId)
  }
}

// Factory function para crear instancias con dependencias inyectadas
export function createOrganizationService(
  organizationRepository: any,
  notificationService: OrganizationNotificationInterface
): OrganizationService {
  return new OrganizationService(organizationRepository, notificationService)
}
