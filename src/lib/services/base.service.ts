// ===== SERVICIO BASE ABSTRACTO =====
// Implementa Dependency Inversion Principle

import { ApiResponse, PaginationParams, ApiListResponse } from '@/types'

export abstract class BaseService<T, CreateData, UpdateData> {
  protected baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Método abstracto que debe ser implementado por cada servicio
  abstract getEndpoint(): string

  // Métodos comunes para todas las entidades
  async getAll(params?: PaginationParams): Promise<ApiListResponse<T>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)

    const response = await fetch(`${this.getEndpoint()}?${searchParams}`)
    return response.json()
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.getEndpoint()}/${id}`)
    return response.json()
  }

  async create(data: CreateData): Promise<ApiResponse<T>> {
    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async update(id: string, data: UpdateData): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.getEndpoint()}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.getEndpoint()}/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  // Método protegido para manejo de errores
  protected handleError(error: unknown): ApiResponse<unknown> {
    console.error(`Error in ${this.constructor.name}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    }
  }
}
