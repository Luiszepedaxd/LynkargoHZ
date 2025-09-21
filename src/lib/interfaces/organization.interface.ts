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

// Interface específica para repositorio de organizaciones
export interface OrganizationRepositoryInterface {
  create(data: CreateOrganizationFormData, ownerId: string): Promise<BaseApiResponse<Organization>>
  findById(id: string): Promise<BaseApiResponse<Organization>>
  findByUserId(userId: string): Promise<BasePaginatedResponse<Organization>>
  update(id: string, data: Partial<CreateOrganizationFormData>): Promise<BaseApiResponse<Organization>>
  delete(id: string): Promise<BaseApiResponse<void>>
  
  // Métodos específicos para miembros
  getMembers(organizationId: string, filters?: BaseSearchFilters): Promise<BasePaginatedResponse<OrganizationMember>>
  inviteMember(data: InviteMemberFormData, inviterId: string): Promise<BaseApiResponse<OrganizationMember>>
  updateMemberRole(data: UpdateMemberRoleData, requesterId: string): Promise<BaseApiResponse<OrganizationMember>>
  removeMember(memberId: string, requesterId: string): Promise<BaseApiResponse<void>>
  acceptInvitation(memberId: string, userId: string): Promise<BaseApiResponse<OrganizationMember>>
  
  // Métodos específicos para estadísticas
  getStats(organizationId: string): Promise<BaseApiResponse<any>>
  getUserRole(userId: string, organizationId: string): Promise<BaseApiResponse<string>>
}

// Interface específica para servicio de organizaciones
export interface OrganizationServiceInterface {
  createOrganization(data: CreateOrganizationFormData, ownerId: string): Promise<BaseApiResponse<Organization>>
  getOrganization(id: string): Promise<BaseApiResponse<Organization>>
  getUserOrganizations(userId: string): Promise<BasePaginatedResponse<Organization>>
  updateOrganization(id: string, data: Partial<CreateOrganizationFormData>): Promise<BaseApiResponse<Organization>>
  deleteOrganization(id: string): Promise<BaseApiResponse<void>>
  
  // Gestión de miembros
  getOrganizationMembers(organizationId: string, filters?: BaseSearchFilters): Promise<BasePaginatedResponse<OrganizationMember>>
  inviteMember(data: InviteMemberFormData, inviterId: string): Promise<BaseApiResponse<OrganizationMember>>
  updateMemberRole(data: UpdateMemberRoleData, requesterId: string): Promise<BaseApiResponse<OrganizationMember>>
  removeMember(memberId: string, requesterId: string): Promise<BaseApiResponse<void>>
  
  // Estadísticas y reportes
  getOrganizationStats(organizationId: string): Promise<BaseApiResponse<any>>
}

// Interface específica para validación de permisos de organización
export interface OrganizationPermissionCheckerInterface {
  canManageOrganization(userId: string, organizationId: string): Promise<boolean>
  canInviteMembers(userId: string, organizationId: string): Promise<boolean>
  canManageMembers(userId: string, organizationId: string): Promise<boolean>
  canViewOrganization(userId: string, organizationId: string): Promise<boolean>
  canDeleteOrganization(userId: string, organizationId: string): Promise<boolean>
}

// Interface específica para notificaciones de organización
export interface OrganizationNotificationInterface {
  sendInvitationNotification(memberData: OrganizationMember): Promise<BaseApiResponse<void>>
  sendRoleChangeNotification(memberData: OrganizationMember, newRole: string): Promise<BaseApiResponse<void>>
  sendMemberRemovedNotification(userId: string, organizationName: string): Promise<BaseApiResponse<void>>
}
