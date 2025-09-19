import { BaseRepository } from './base.repository'
import { User, RegisterFormData, ApiResponse, PaginationParams, ApiListResponse } from '@/types'

export interface CreateUserData extends Omit<RegisterFormData, 'password'> {
  profile?: {
    telefono?: string
    direccion?: string
    ciudad?: string
    estado?: string
    codigoPostal?: string
    rfc?: string
    website?: string
    descripcion?: string
    logo?: string
  }
}

export type UpdateUserData = Partial<CreateUserData>

export interface UserRepositoryInterface {
  findById(id: string): Promise<ApiResponse<User>>
  findAll(params?: PaginationParams): Promise<ApiListResponse<User>>
  create(data: CreateUserData): Promise<ApiResponse<User>>
  update(id: string, data: UpdateUserData): Promise<ApiResponse<User>>
  delete(id: string): Promise<ApiResponse<void>>
  findByEmail(email: string): Promise<ApiResponse<User[]>>
  findByType(tipo: string): Promise<ApiResponse<User[]>>
}

export class UserRepository extends BaseRepository<User, CreateUserData, UpdateUserData> implements UserRepositoryInterface {
  constructor() {
    super('/users')
  }

  async findByEmail(email: string): Promise<ApiResponse<User[]>> {
    return this.httpClient.get<User[]>(`${this.baseEndpoint}?search=${encodeURIComponent(email)}`)
  }

  async findByType(tipo: string): Promise<ApiResponse<User[]>> {
    return this.httpClient.get<User[]>(`${this.baseEndpoint}?tipo=${tipo}`)
  }
}
