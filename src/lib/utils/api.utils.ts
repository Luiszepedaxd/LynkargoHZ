// ===== UTILIDADES PARA APIs =====
// Elimina duplicación en manejo de respuestas y errores

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiResponse, PaginationResponse, BaseApiResponse, BasePaginatedResponse } from '@/types'

// Respuesta exitosa estándar
export function successResponse<T>(
  data?: T, 
  message?: string, 
  status: number = 200
): NextResponse {
  return NextResponse.json({
    success: true,
    message,
    data
  } as ApiResponse<T>, { status })
}

// Respuesta de error estándar
export function errorResponse(
  message: string, 
  status: number = 500, 
  errors?: unknown[]
): NextResponse {
  return NextResponse.json({
    success: false,
    message,
    errors
  } as ApiResponse, { status })
}

// Respuesta con paginación
export function paginatedResponse<T>(
  data: T[], 
  pagination: PaginationResponse, 
  message?: string
): NextResponse {
  return NextResponse.json({
    success: true,
    message,
    data,
    pagination
  }, { status: 200 })
}

// Manejo de errores de validación Zod
export function handleValidationError(error: z.ZodError): NextResponse {
  return errorResponse(
    'Datos inválidos',
    400,
    error.errors
  )
}

// Manejo genérico de errores
export function handleGenericError(error: unknown, context: string): NextResponse {
  console.error(`Error in ${context}:`, error)
  
  if (error instanceof z.ZodError) {
    return handleValidationError(error)
  }
  
  return errorResponse(
    error instanceof Error ? error.message : 'Error interno del servidor',
    500
  )
}

// Extraer parámetros de paginación
export function extractPaginationParams(searchParams: URLSearchParams) {
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    search: searchParams.get('search') || undefined
  }
}

// Calcular paginación
export function calculatePagination(
  page: number, 
  limit: number, 
  total: number
): { skip: number; pagination: PaginationResponse } {
  const skip = (page - 1) * limit
  
  return {
    skip,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

// Funciones para repositorios que devuelven objetos BaseApiResponse
export function createSuccessResponse<T>(
  data?: T, 
  message?: string
): BaseApiResponse<T> {
  return {
    success: true,
    message,
    data
  }
}

export function createErrorResponse(
  message: string,
  error?: string
): BaseApiResponse<never> {
  return {
    success: false,
    error: message,
    message
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginationResponse
): BasePaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination
  }
}

// Versión de handleGenericError para repositorios que devuelven BaseApiResponse
export function handleRepositoryError(error: unknown, context: string): BaseApiResponse<never> {
  console.error(`Error in ${context}:`, error)
  
  if (error instanceof Error) {
    return createErrorResponse(error.message)
  }
  
  return createErrorResponse('Error interno del servidor')
}

// Función para transformar objetos con campos Date a string
export function transformDateFields<T extends Record<string, any>>(obj: T): T {
  if (!obj) return obj
  
  const transformed = { ...obj }
  
  for (const key in transformed) {
    const value = transformed[key]
    
    if (value instanceof Date) {
      transformed[key] = value.toISOString() as any
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      transformed[key] = transformDateFields(value)
    } else if (Array.isArray(value)) {
      transformed[key] = value.map(item => 
        item && typeof item === 'object' ? transformDateFields(item) : item
      ) as any
    }
  }
  
  return transformed
}