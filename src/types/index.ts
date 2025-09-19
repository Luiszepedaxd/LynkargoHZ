// ===== TIPOS BASE =====

// Tipos de usuario (consolidados con Prisma)
export interface User {
  id: string
  email: string
  nombre: string
  empresa?: string
  tipo: UserType
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  userId: string
  telefono?: string
  direccion?: string
  ciudad?: string
  estado?: string
  codigoPostal?: string
  rfc?: string
  website?: string
  descripcion?: string
  logo?: string
  createdAt: string
  updatedAt: string
}

// Tipos de autenticación de Supabase
export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    nombre?: string
    nombre_empresa?: string
    tipo_usuario?: string
  }
}

// ===== ENUMS =====

export type UserType = 'CLIENTE' | 'PROVEEDOR' | 'ADMIN'
export type OrderStatus = 'PENDIENTE' | 'ACEPTADA' | 'EN_PROCESO' | 'EN_TRANSITO' | 'ENTREGADA' | 'CANCELADA'
export type DocumentType = 'RFC' | 'ACTA_CONSTITUTIVA' | 'COMPROBANTE_DOMICILIO' | 'SEGURO' | 'LICENCIA' | 'OTRO'
export type NotificationType = 'ORDEN' | 'ESTADO' | 'SISTEMA' | 'PROMOCION'

// ===== TIPOS DE FORMULARIOS =====

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  nombre: string
  email: string
  password: string
  empresa?: string
  tipo: 'cliente' | 'proveedor'
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
  userId: string
  nombre: string
  descripcion?: string
  calificacion: number
  totalReviews: number
  activo: boolean
  createdAt: string
  updatedAt: string
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
}
