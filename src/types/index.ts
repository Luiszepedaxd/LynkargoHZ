// ===== ORGANIZACIÓN =====

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

// Tipos de formularios para organizaciones (importados desde validation.schemas)
export type CreateOrganizationFormData = {
  nombre: string
  tipo: OrganizationType
  profile?: {
    rfc?: string
    direccion?: string
    ciudad?: string
    estado?: string
    codigoPostal?: string
    telefono?: string
    website?: string
    descripcion?: string
    logo?: string
  }
}

export type InviteMemberFormData = {
  organizationId: string
  email: string
  nombre: string
  role: MemberRole
}

export type UpdateMemberRoleData = {
  memberId: string
  role: MemberRole
}

// ===== USUARIOS =====

export interface User {
  id: string
  email: string
  nombre: string
  createdAt: string
  updatedAt: string
  profile?: UserProfile
  memberships?: OrganizationMember[]
  orders?: Order[]
  reviews?: Review[]
  notifications?: Notification[]
}

export interface UserProfile {
  id: string
  userId: string
  telefono?: string
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

// Tipos de autenticación de Supabase
export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    nombre?: string
    organization_name?: string
    organization_type?: string
  }
}

// ===== ENUMS =====

export type OrganizationType = 'CLIENTE' | 'PROVEEDOR' | 'MIXTO'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
export type OrderStatus = 'PENDIENTE' | 'ACEPTADA' | 'EN_PROCESO' | 'EN_TRANSITO' | 'ENTREGADA' | 'CANCELADA'
export type DocumentType = 'RFC' | 'ACTA_CONSTITUTIVA' | 'COMPROBANTE_DOMICILIO' | 'SEGURO' | 'LICENCIA' | 'OTRO'
export type NotificationType = 'ORDEN' | 'ESTADO' | 'SISTEMA' | 'PROMOCION' | 'INVITACION'

// ===== TIPOS DE FORMULARIOS =====

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  nombre: string
  email: string
  password: string
  organizationName: string
  organizationType: OrganizationType
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

// Tipos específicos para estadísticas y respuestas de API
export interface OrganizationStats {
  totalMembers: number
  totalProviders: number
  activeProviders: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
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

// ===== TIPOS DE NOTIFICACIONES =====

export interface NotificationState {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

// ===== TIPOS DE MODELOS DE NEGOCIO =====

export interface Provider {
  id: string
  organizationId: string
  nombre: string
  descripcion?: string
  calificacion: number
  totalReviews: number
  activo: boolean
  createdAt: string
  updatedAt: string
  organization?: Organization
  services?: Service[]
  locations?: Location[]
  documents?: Document[]
  orders?: Order[]
  reviews?: Review[]
}

export interface Service {
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
  estado: OrderStatus
  precio?: number
  fechaEnvio?: string
  fechaEntrega?: string
  createdAt: string
  updatedAt: string
  user?: User
  organization?: Organization
  provider?: Provider
}
