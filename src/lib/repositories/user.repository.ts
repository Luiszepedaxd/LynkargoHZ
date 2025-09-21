import { User, RegisterFormData, ApiResponse, PaginationParams, ApiListResponse } from '@/types'
import { HttpClient } from '@/lib/utils/http.utils'

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

export class UserRepository implements UserRepositoryInterface {
  private httpClient: HttpClient
  private baseEndpoint: string

  constructor() {
    this.httpClient = new HttpClient()
    this.baseEndpoint = '/users'
  }

  // Métodos públicos requeridos por la interfaz
  async findById(id: string): Promise<ApiResponse<User>> {
    return this.httpClient.get<User>(`${this.baseEndpoint}/${id}`)
  }

  async create(data: CreateUserData): Promise<ApiResponse<User>> {
    return this.httpClient.post<User>(this.baseEndpoint, data)
  }

  async update(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return this.httpClient.put<User>(`${this.baseEndpoint}/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseEndpoint}/${id}`)
  }

  async findAll(params?: PaginationParams): Promise<ApiListResponse<User>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    
    return this.httpClient.get<ApiListResponse<User>>(`${this.baseEndpoint}?${queryParams.toString()}`)
  }

  async findByEmail(email: string): Promise<ApiResponse<User[]>> {
    return this.httpClient.get<User[]>(`${this.baseEndpoint}?search=${encodeURIComponent(email)}`)
  }

  async findByType(tipo: string): Promise<ApiResponse<User[]>> {
    return this.httpClient.get<User[]>(`${this.baseEndpoint}?tipo=${tipo}`)
  }
}
