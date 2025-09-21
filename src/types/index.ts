// ===== USUARIOS =====

export interface User {
  id: string
  email: string
  nombre: string
  telefono?: string
  activo: boolean
  createdAt: string
  updatedAt: string
  profile?: UserProfile
  memberships?: OrganizationMember[]
  orders?: Order[]
  notifications?: Notification[]
  userRoles?: UserRole[]
}

export interface UserProfile {
  id: string
  userId: string
  direccion?: string
  ciudad?: string
  estado?: string
  codigoPostal?: string
  website?: string
  descripcion?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface UserRole {
  id: string
  userId: string
  role: PlatformRole
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface UserContext {
  id: string
  userId: string
  activeRole: PlatformRole
  activeOrganizationId?: string
  lastSwitchedAt: string
  createdAt: string
  updatedAt: string
  user?: User
  organization?: Organization
}

// ===== ORGANIZACIONES =====

export interface Organization {
  id: string
  nombre: string
  tipo: OrganizationType
  activo: boolean
  createdAt: string
  updatedAt: string
  profile?: OrganizationProfile
  members?: OrganizationMember[]
  providers?: Provider[]
  orders?: Order[]
}

export interface OrganizationProfile {
  id: string
  organizationId: string
  rfc?: string
  direccion?: string
  ciudad?: string
  estado?: string
  codigoPostal?: string
  website?: string
  descripcion?: string
  logo?: string
  telefono?: string
  createdAt: string
  updatedAt: string
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: MemberRole
  activo: boolean
  joinedAt: string
  createdAt: string
  updatedAt: string
  user?: User
  organization?: Organization
}

// ===== PROVEEDORES =====

export interface Provider {
  id: string
  organizationId: string
  nombre: string
  descripcion?: string
  activo: boolean
  createdAt: string
  updatedAt: string
  organization?: Organization
  services?: ProviderService[]
  locations?: ProviderLocation[]
  documents?: ProviderDocument[]
  orders?: Order[]
}

export interface ProviderService {
  id: string
  providerId: string
  nombre: string
  descripcion?: string
  precio?: number
  unidad?: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface ProviderLocation {
  id: string
  providerId: string
  ciudad: string
  estado: string
  pais: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface ProviderDocument {
  id: string
  providerId: string
  tipo: DocumentType
  nombre: string
  url: string
  verificado: boolean
  createdAt: string
  updatedAt: string
}

// ===== ÓRDENES =====

export interface Order {
  id: string
  userId: string
  organizationId?: string
  providerId?: string
  servicio: string
  descripcion?: string
  origen: string
  destino: string
  peso?: number
  volumen?: number
  precio?: number
  estado: OrderStatus
  fechaEnvio?: string
  fechaEntrega?: string
  createdAt: string
  updatedAt: string
  user?: User
  organization?: Organization
  provider?: Provider
}

// ===== NOTIFICACIONES =====

export interface Notification {
  id: string
  userId: string
  titulo: string
  mensaje: string
  tipo: NotificationType
  leida: boolean
  accionUrl?: string
  accionTexto?: string
  createdAt: string
  updatedAt: string
}

// ===== NEWSLETTER =====

export interface NewsletterSubscriber {
  id: string
  email: string
  nombre?: string
  empresa?: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

// ===== ENUMS =====

export type OrganizationType = 'CLIENTE' | 'PROVEEDOR' | 'MIXTO'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER'
export type PlatformRole = 'CLIENTE' | 'PROVEEDOR' | 'ADMIN'
export type OrderStatus = 'PENDIENTE' | 'CONFIRMADA' | 'EN_PROCESO' | 'EN_TRANSITO' | 'ENTREGADA' | 'CANCELADA'
export type DocumentType = 'RFC' | 'ACTA_CONSTITUTIVA' | 'COMPROBANTE_DOMICILIO' | 'SEGURO' | 'LICENCIA' | 'OTRO'
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'INVITATION' | 'ROLE_CHANGE' | 'ORDER_UPDATE'

// ===== TIPOS DE FORMULARIOS =====

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  nombre: string
  email: string
  password: string
  telefono?: string
  initialRole: PlatformRole
}

export interface CreateOrganizationFormData {
  nombre: string
  tipo: OrganizationType
  profile?: {
    rfc?: string
    direccion?: string
    ciudad?: string
    estado?: string
    codigoPostal?: string
    website?: string
    descripcion?: string
    telefono?: string
  }
}

export interface InviteMemberFormData {
  organizationId: string
  email: string
  nombre: string
  role: MemberRole
}

export interface UpdateMemberRoleData {
  memberId: string
  role: MemberRole
}

export interface SwitchContextData {
  activeRole: PlatformRole
  activeOrganizationId?: string
}

export interface NewsletterFormData {
  email: string
  nombre?: string
  empresa?: string
}

// ===== TIPOS DE API =====

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: unknown[]
}

export interface BaseApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface BasePaginatedResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T[]
  pagination?: PaginationResponse
  error?: string
}

export interface BaseSearchFilters {
  page?: number
  limit?: number
  search?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

export interface PaginationResponse {
  page: number
  limit: number
  total: number
  pages: number
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationResponse
}

// ===== TIPOS ESPECÍFICOS PARA ESTADÍSTICAS =====

export interface OrganizationStats {
  totalMembers: number
  totalProviders: number
  activeProviders: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
}

export interface UserStats {
  totalOrganizations: number
  activeRoles: PlatformRole[]
  totalOrders: number
  totalNotifications: number
}

// ===== TIPOS DE NOTIFICACIONES UI =====

export interface NotificationState {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

// ===== TIPOS DE AUTENTICACIÓN =====

export interface AuthUser {
  id: string
  email: string
  nombre: string
  userRoles: PlatformRole[]
  activeContext?: UserContext
  user_metadata?: {
    nombre?: string
    organization_name?: string
    organization_type?: string
  }
}

// ===== TIPOS DE PERMISOS =====

export interface PermissionMatrix {
  [key: string]: {
    [role in MemberRole]: boolean
  }
}

export interface UserPermissions {
  canCreateServices: boolean
  canViewOrders: boolean
  canManageTeam: boolean
  canConfigurePricing: boolean
  canDeleteOrganization: boolean
  canInviteMembers: boolean
  canManageMembers: boolean
}

// ===== TIPOS DE CONTEXTO =====

export interface ContextSwitchOptions {
  availableRoles: PlatformRole[]
  availableOrganizations: Organization[]
  currentContext: UserContext
}

export interface ContextValidationResult {
  isValid: boolean
  error?: string
  requiredFields?: string[]
}