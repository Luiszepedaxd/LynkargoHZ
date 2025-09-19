import { supabase } from '@/lib/supabase'
import { LoginFormData, RegisterFormData, AuthUser, UserProfile, ApiResponse } from '@/types'
import { handleServiceError, createSuccessResponse, NotFoundError } from '@/lib/utils/error.utils'

export interface AuthRepositoryInterface {
  signIn(credentials: LoginFormData): Promise<ApiResponse<AuthUser>>
  signUp(userData: RegisterFormData): Promise<ApiResponse<{ message: string }>>
  signOut(): Promise<ApiResponse<void>>
  getCurrentUser(): Promise<ApiResponse<AuthUser>>
  loadUserProfile(userId: string): Promise<ApiResponse<UserProfile>>
}

export class SupabaseAuthRepository implements AuthRepositoryInterface {
  async signIn(credentials: LoginFormData): Promise<ApiResponse<AuthUser>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) throw error
      if (!data.user) throw new Error('Login failed')

      return createSuccessResponse(
        data.user as AuthUser,
        'Login successful'
      )
    } catch (error) {
      return handleServiceError(error, 'AuthRepository.signIn')
    }
  }

  async signUp(userData: RegisterFormData): Promise<ApiResponse<{ message: string }>> {
    try {
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
      if (!authData.user) throw new Error('User creation failed')

      await new Promise(resolve => setTimeout(resolve, 2000))

      const { error: insertError } = await supabase
        .from('cuentas')
        .insert([{
          id: authData.user.id,
          nombre: userData.nombre,
          correo: userData.email,
          nombre_empresa: userData.empresa,
          tipo_usuario: userData.tipo
        }])

      if (insertError) {
        try {
          await supabase.auth.admin.deleteUser(authData.user.id)
        } catch (deleteError) {
          console.error('Error deleting user:', deleteError)
        }
        throw new Error('Error saving user data: ' + insertError.message)
      }

      return createSuccessResponse(
        { message: 'User registered successfully' },
        'Account created successfully. Check your email to confirm.'
      )
    } catch (error) {
      return handleServiceError(error, 'AuthRepository.signUp')
    }
  }

  async signOut(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      return createSuccessResponse(undefined, 'Logout successful')
    } catch (error) {
      return handleServiceError(error, 'AuthRepository.signOut')
    }
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleServiceError(new NotFoundError('No authenticated user'), 'AuthRepository.getCurrentUser')
      }

      return createSuccessResponse(user as AuthUser)
    } catch (error) {
      return handleServiceError(error, 'AuthRepository.getCurrentUser')
    }
  }

  async loadUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('cuentas')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      return createSuccessResponse(data)
    } catch (error) {
      return handleServiceError(error, 'AuthRepository.loadUserProfile')
    }
  }
}
