import { LoginFormData, RegisterFormData, AuthUser, UserProfile, ApiResponse } from '@/types'
import { AuthRepositoryInterface } from '@/lib/repositories/auth.repository'

export interface AuthProvider {
  authenticate(credentials: LoginFormData): Promise<ApiResponse<AuthUser>>
  register(userData: RegisterFormData): Promise<ApiResponse<{ message: string }>>
  logout(): Promise<ApiResponse<void>>
  getCurrentUser(): Promise<ApiResponse<AuthUser>>
  loadUserProfile(userId: string): Promise<ApiResponse<UserProfile>>
}

export class AuthProviderService implements AuthProvider {
  constructor(private authRepository: AuthRepositoryInterface) {}

  async authenticate(credentials: LoginFormData): Promise<ApiResponse<AuthUser>> {
    return this.authRepository.signIn(credentials)
  }

  async register(userData: RegisterFormData): Promise<ApiResponse<{ message: string }>> {
    return this.authRepository.signUp(userData)
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.authRepository.signOut()
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return this.authRepository.getCurrentUser()
  }

  async loadUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return this.authRepository.loadUserProfile(userId)
  }
}
