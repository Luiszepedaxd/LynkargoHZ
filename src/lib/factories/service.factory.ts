import { AuthService, createAuthService } from '@/lib/services/auth.service'
import { UserService, createUserService } from '@/lib/services/user.service'
import { NotificationService, createNotificationService } from '@/lib/services/notification.service'
import { AuthProviderService } from '@/lib/providers/auth.provider'
import { UserProviderService } from '@/lib/providers/user.provider'
import { NotificationProviderService } from '@/lib/providers/notification.provider'
import { SupabaseAuthRepository } from '@/lib/repositories/auth.repository'
import { UserRepository } from '@/lib/repositories/user.repository'
import { NotificationRepository } from '@/lib/repositories/notification.repository'

export class ServiceFactory {
  private static authRepository = new SupabaseAuthRepository()
  private static userRepository = new UserRepository()
  private static notificationRepository = new NotificationRepository()

  private static authProvider = new AuthProviderService(this.authRepository)
  private static userProvider = new UserProviderService(this.userRepository)
  private static notificationProvider = new NotificationProviderService(this.notificationRepository)

  static getAuthService(): AuthService {
    return createAuthService(this.authProvider, this.notificationProvider)
  }

  static getUserService(): UserService {
    return createUserService(this.userProvider)
  }

  static getNotificationService(): NotificationService {
    return createNotificationService(this.notificationProvider)
  }
}

// Instancias singleton para uso global
export const authService = ServiceFactory.getAuthService()
export const userService = ServiceFactory.getUserService()
export const notificationService = ServiceFactory.getNotificationService()
