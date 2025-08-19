import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile, AuthUser } from '@/lib/supabase'

interface AuthState {
  // Estado
  currentUser: AuthUser | null
  userProfile: UserProfile | null
  isLoading: boolean
  
  // Acciones
  setUser: (user: AuthUser | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      currentUser: null,
      userProfile: null,
      isLoading: false,
      
      // Acciones
      setUser: (user) => set({ currentUser: user }),
      setProfile: (profile) => set({ userProfile: profile }),
      setLoading: (loading) => set({ isLoading: loading }),
      signOut: () => set({ 
        currentUser: null, 
        userProfile: null,
        isLoading: false 
      }),
    }),
    {
      name: 'auth-storage', // nombre para localStorage
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        userProfile: state.userProfile 
      }),
    }
  )
)
