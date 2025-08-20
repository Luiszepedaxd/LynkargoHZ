import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseAnonKey || 'dummy-key'
)

// Tipos para la base de datos
export interface UserProfile {
  id: string
  nombre: string
  correo: string
  nombre_empresa?: string
  tipo_usuario: 'cliente' | 'proveedor'
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    nombre?: string
    nombre_empresa?: string
    tipo_usuario?: string
  }
}
