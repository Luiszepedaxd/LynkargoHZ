import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import type { UserProfile, AuthUser } from '@/lib/supabase'

export function useAuth() {
  const { currentUser, userProfile, setUser, setProfile, setLoading } = useAuthStore()

  // Cargar perfil del usuario
  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('cuentas')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data as UserProfile)
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    }
  }, [setProfile])

  // Verificar estado de autenticación
  const checkAuthState = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user as AuthUser)
        await loadUserProfile(user.id)
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error)
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, loadUserProfile])

  // Verificar estado de autenticación al cargar
  useEffect(() => {
    checkAuthState()
  }, [checkAuthState])

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user as AuthUser)
          await loadUserProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, loadUserProfile])

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      if (!data.user) throw new Error('No se pudo iniciar sesión')

      setUser(data.user as AuthUser)
      await loadUserProfile(data.user.id)
    } finally {
      setLoading(false)
    }
  }

  // Registrar usuario
  const register = async (userData: {
    nombre: string
    email: string
    password: string
    empresa?: string
    tipo: 'cliente' | 'proveedor'
  }) => {
    try {
      setLoading(true)
      
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nombre: userData.nombre,
            nombre_empresa: userData.empresa,
            tipo_usuario: userData.tipo
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No se pudo crear el usuario')

      // Esperar un momento para que se estabilice la creación
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Insertar en tabla cuentas
      const { error: insertError } = await supabase
        .from('cuentas')
        .insert([
          {
            id: authData.user.id,
            nombre: userData.nombre,
            correo: userData.email,
            nombre_empresa: userData.empresa,
            tipo_usuario: userData.tipo
          }
        ])

      if (insertError) {
        // Si falla la inserción, intentar eliminar el usuario creado
        try {
          await supabase.auth.admin.deleteUser(authData.user.id)
        } catch (deleteError) {
          console.error('Error al eliminar usuario:', deleteError)
        }
        throw new Error('Error al guardar los datos del usuario: ' + insertError.message)
      }

      // No establecer sesión automáticamente, el usuario debe confirmar email
      return { success: true, message: 'Cuenta creada exitosamente. Revisa tu correo para confirmar.' }
    } finally {
      setLoading(false)
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    currentUser,
    userProfile,
    isLoading: useAuthStore(state => state.isLoading),
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  }
}
