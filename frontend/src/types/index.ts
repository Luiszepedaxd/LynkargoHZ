export interface Usuario {
  id: string
  nombre: string
  correo: string
  nombre_empresa?: string
  tipo_usuario: 'cliente' | 'proveedor'
  activo: boolean
  created_at: string
}

export interface FormularioRegistro {
  nombre: string
  correo: string
  password: string
  nombre_empresa?: string
  tipo_usuario: 'cliente' | 'proveedor'
}

export interface AuthError {
  message: string
  field?: string
}
