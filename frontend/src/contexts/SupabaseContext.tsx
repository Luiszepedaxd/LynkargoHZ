import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface SupabaseContextType {
  supabase: typeof supabase
  user: User | null
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

          // Escuchar cambios en la autenticación
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    supabase,
    user,
    loading
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase debe ser usado dentro de SupabaseProvider')
  }
  return context
}
