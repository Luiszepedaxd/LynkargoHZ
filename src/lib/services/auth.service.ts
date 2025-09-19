import { LoginFormData, RegisterFormData, AuthUser, UserProfile, ApiResponse } from '@/types'
import { AuthProvider } from '@/lib/providers/auth.provider'
import { NotificationProvider } from '@/lib/providers/notification.provider'

export class AuthService {
  constructor(
    private authProvider: AuthProvider,
    private notificationProvider: NotificationProvider
  ) {}

  async login(credentials: LoginFormData): Promise<ApiResponse<AuthUser>> {
    const result = await this.authProvider.authenticate(credentials)
    
    if (result.success && result.data) {
      // Enviar email de bienvenida después del login exitoso
      await this.notificationProvider.sendWelcomeEmail(result.data.email)
    }
    
    return result
  }

  async register(userData: RegisterFormData): Promise<ApiResponse<{ message: string }>> {
    const result = await this.authProvider.register(userData)
    
    if (result.success) {
      // Enviar email de confirmación después del registro exitoso
      await this.notificationProvider.sendConfirmationEmail(userData.email)
    }
    
    return result
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.authProvider.logout()
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return this.authProvider.getCurrentUser()
  }

  async loadUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return this.authProvider.loadUserProfile(userId)
  }
}

// Factory function para crear instancias con dependencias inyectadas
export function createAuthService(
  authProvider: AuthProvider,
  notificationProvider: NotificationProvider
): AuthService {
  return new AuthService(authProvider, notificationProvider)
}
