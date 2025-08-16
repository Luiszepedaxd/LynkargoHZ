import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Verifica tu archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export interface Database {
  public: {
    Tables: {
      cuentas: {
        Row: {
          id: string
          created_at: string
          nombre: string
          correo: string
          nombre_empresa: string | null
          tipo_usuario: 'cliente' | 'proveedor'
          activo: boolean
        }
        Insert: {
          id: string
          created_at?: string
          nombre: string
          correo: string
          nombre_empresa?: string | null
          tipo_usuario: 'cliente' | 'proveedor'
          activo?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          nombre?: string
          correo?: string
          nombre_empresa?: string | null
          tipo_usuario?: 'cliente' | 'proveedor'
          activo?: boolean
        }
      }
    }
  }
}
