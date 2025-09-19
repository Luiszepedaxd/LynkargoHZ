import { ApiResponse, PaginationParams, ApiListResponse } from '@/types'
import { HttpClient } from '@/lib/utils/http.utils'

export interface Repository<T, CreateData, UpdateData> {
  findById(id: string): Promise<ApiResponse<T>>
  findAll(params?: PaginationParams): Promise<ApiListResponse<T>>
  create(data: CreateData): Promise<ApiResponse<T>>
  update(id: string, data: UpdateData): Promise<ApiResponse<T>>
  delete(id: string): Promise<ApiResponse<void>>
}

export abstract class BaseRepository<T, CreateData, UpdateData> implements Repository<T, CreateData, UpdateData> {
  protected httpClient: HttpClient

  constructor(protected baseEndpoint: string) {
    this.httpClient = new HttpClient('/api')
  }

  async findById(id: string): Promise<ApiResponse<T>> {
    return this.httpClient.get<T>(`${this.baseEndpoint}/${id}`)
  }

  async findAll(params?: PaginationParams): Promise<ApiListResponse<T>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)

    return this.httpClient.get<ApiListResponse<T>>(`${this.baseEndpoint}?${searchParams}`)
  }

  async create(data: CreateData): Promise<ApiResponse<T>> {
    return this.httpClient.post<T>(this.baseEndpoint, data)
  }

  async update(id: string, data: UpdateData): Promise<ApiResponse<T>> {
    return this.httpClient.put<T>(`${this.baseEndpoint}/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseEndpoint}/${id}`)
  }
}
