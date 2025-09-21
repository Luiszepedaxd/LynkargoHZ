import { supabase, supabaseAdmin } from '@/lib/supabase'
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

      // Convertir usuario de Supabase al tipo AuthUser personalizado
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        nombre: data.user.user_metadata?.nombre || data.user.email?.split('@')[0] || '',
        userRoles: data.user.user_metadata?.userRoles || ['CLIENTE'],
        activeContext: data.user.user_metadata?.activeContext,
        user_metadata: data.user.user_metadata
      }

      return createSuccessResponse(
        authUser,
        'Login successful'
      )
    } catch (error) {
      return handleServiceError<AuthUser>(error, 'AuthRepository.signIn')
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
            telefono: userData.telefono,
            initialRole: userData.initialRole
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      await new Promise(resolve => setTimeout(resolve, 2000))

      // Insertar usuario en la tabla users usando cliente administrativo
      const { error: userInsertError } = await supabaseAdmin
        .from('users')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          nombre: userData.nombre,
          telefono: userData.telefono,
          activo: true
        }])

      if (userInsertError) {
        try {
          await supabase.auth.admin.deleteUser(authData.user.id)
        } catch (deleteError) {
          console.error('Error deleting user:', deleteError)
        }
        throw new Error('Error saving user data: ' + userInsertError.message)
      }

      // Crear rol de plataforma inicial usando cliente administrativo
      const { error: roleInsertError } = await supabaseAdmin
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role: userData.initialRole,
          activo: true
        }])

      if (roleInsertError) {
        console.error('Error creating user role:', roleInsertError)
        // No fallar el registro por esto, el contexto se puede crear después
      }

      // Crear contexto inicial usando cliente administrativo
      const { error: contextInsertError } = await supabaseAdmin
        .from('user_contexts')
        .insert([{
          user_id: authData.user.id,
          active_role: userData.initialRole,
          last_switched_at: new Date().toISOString()
        }])

      if (contextInsertError) {
        console.error('Error creating user context:', contextInsertError)
        // No fallar el registro por esto, el contexto se puede crear después
      }

      return createSuccessResponse(
        { message: 'User registered successfully' },
        'Account created successfully. Check your email to confirm.'
      )
    } catch (error) {
      return handleServiceError<{ message: string }>(error, 'AuthRepository.signUp')
    }
  }

  async signOut(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      return createSuccessResponse(undefined, 'Logout successful')
    } catch (error) {
      return handleServiceError<void>(error, 'AuthRepository.signOut')
    }
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleServiceError<AuthUser>(new NotFoundError('No authenticated user'), 'AuthRepository.getCurrentUser')
      }

      // Convertir usuario de Supabase al tipo AuthUser personalizado
      const authUser: AuthUser = {
        id: user.id,
        email: user.email || '',
        nombre: user.user_metadata?.nombre || user.email?.split('@')[0] || '',
        userRoles: user.user_metadata?.userRoles || ['CLIENTE'],
        activeContext: user.user_metadata?.activeContext,
        user_metadata: user.user_metadata
      }

      return createSuccessResponse(authUser)
    } catch (error) {
      return handleServiceError<AuthUser>(error, 'AuthRepository.getCurrentUser')
    }
  }

  async loadUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          user_profiles(*),
          user_roles(role, activo),
          user_contexts(active_role, active_organization_id)
        `)
        .eq('id', userId)
        .single()

      if (error) throw error

      return createSuccessResponse(data)
    } catch (error) {
      return handleServiceError<UserProfile>(error, 'AuthRepository.loadUserProfile')
    }
  }
}
