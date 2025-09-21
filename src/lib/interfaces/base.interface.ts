// ===== INTERFACES BASE SIGUIENDO PRINCIPIOS SOLID =====

// Interface base para entidades con ID
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Interface base para respuestas de API
export interface BaseApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: unknown[]
}

// Interface base para paginación
export interface BasePagination {
  page: number
  limit: number
  total: number
  pages: number
}

// Interface base para respuestas paginadas
export interface BasePaginatedResponse<T> extends BaseApiResponse<T[]> {
  pagination?: BasePagination
}

// Interface base para filtros de búsqueda
export interface BaseSearchFilters {
  search?: string
  page?: number
  limit?: number
}

// Interface base para repositorios CRUD
export interface BaseRepository<T, CreateData, UpdateData, Filters = BaseSearchFilters> {
  create(data: CreateData): Promise<BaseApiResponse<T>>
  findById(id: string): Promise<BaseApiResponse<T>>
  findMany(filters?: Filters): Promise<BasePaginatedResponse<T>>
  update(id: string, data: Partial<UpdateData>): Promise<BaseApiResponse<T>>
  delete(id: string): Promise<BaseApiResponse<void>>
}

// Interface base para servicios de negocio
export interface BaseService<T, CreateData, UpdateData, Filters = BaseSearchFilters> {
  create(data: CreateData): Promise<BaseApiResponse<T>>
  getById(id: string): Promise<BaseApiResponse<T>>
  getAll(filters?: Filters): Promise<BasePaginatedResponse<T>>
  update(id: string, data: Partial<UpdateData>): Promise<BaseApiResponse<T>>
  delete(id: string): Promise<BaseApiResponse<void>>
}

// Interface base para validación de permisos
export interface BasePermissionChecker {
  canRead(userId: string, resourceId: string): Promise<boolean>
  canWrite(userId: string, resourceId: string): Promise<boolean>
  canDelete(userId: string, resourceId: string): Promise<boolean>
}

// Interface base para notificaciones
export interface BaseNotificationService {
  send(data: NotificationData): Promise<BaseApiResponse<void>>
}

export interface NotificationData {
  userId: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
}

// Interface base para auditoría
export interface BaseAuditLogger {
  log(action: string, userId: string, resourceType: string, resourceId: string, data?: unknown): Promise<void>
}

// Interface base para cache
export interface BaseCacheService {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
}
