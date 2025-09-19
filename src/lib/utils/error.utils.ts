import { ApiResponse } from '@/types'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors: unknown[] = []) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export function handleServiceError<T = unknown>(error: unknown, context: string): ApiResponse<T> {
  console.error(`Error in ${context}:`, error)
  
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      error: error.code
    } as ApiResponse<T>
  }
  
  if (error instanceof Error) {
    return {
      success: false,
      message: error.message
    } as ApiResponse<T>
  }
  
  return {
    success: false,
    message: 'Error interno del servidor'
  } as ApiResponse<T>
}

export function createSuccessResponse<T>(
  data: T, 
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    message,
    data
  }
}
