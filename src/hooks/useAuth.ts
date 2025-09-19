import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/lib/factories/service.factory'
import { supabase } from '@/lib/supabase'
import type { UserProfile, AuthUser, LoginFormData, RegisterFormData } from '@/types'

export function useAuth() {
  const { currentUser, userProfile, setUser, setProfile, setLoading } = useAuthStore()

  // Cargar perfil del usuario
  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const response = await authService.loadUserProfile(userId)
      if (response.success && response.data) {
        setProfile(response.data as UserProfile)
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    }
  }, [setProfile])

  // Verificar estado de autenticación
  const checkAuthState = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authService.getCurrentUser()
      
      if (response.success && response.data) {
        setUser(response.data)
        await loadUserProfile(response.data.id)
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
      const credentials: LoginFormData = { email, password }
      const response = await authService.login(credentials)

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.data) {
        setUser(response.data)
        await loadUserProfile(response.data.id)
      }
    } finally {
      setLoading(false)
    }
  }

  // Registrar usuario
  const register = async (userData: RegisterFormData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)

      if (!response.success) {
        throw new Error(response.message)
      }

      return response
    } finally {
      setLoading(false)
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      setLoading(true)
      const response = await authService.logout()
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
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
