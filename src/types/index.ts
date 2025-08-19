// Tipos de usuario
export interface User {
  id: string
  nombre: string
  correo: string
  nombre_empresa?: string
  tipo_usuario: 'cliente' | 'proveedor'
  created_at: string
  updated_at: string
}

// Tipos de formularios
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  nombre: string
  email: string
  password: string
  empresa?: string
  tipo: 'cliente' | 'proveedor'
}

// Tipos de notificaciones
export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

// Tipos de API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Tipos de newsletter
export interface NewsletterSignup {
  email: string
  timestamp: string
}
