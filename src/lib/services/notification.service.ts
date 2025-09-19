import { ApiResponse } from '@/types'
import { NotificationProvider } from '@/lib/providers/notification.provider'

export class NotificationService {
  constructor(private notificationProvider: NotificationProvider) {}

  async sendWelcomeEmail(userEmail: string): Promise<ApiResponse<void>> {
    return this.notificationProvider.sendWelcomeEmail(userEmail)
  }

  async sendConfirmationEmail(userEmail: string): Promise<ApiResponse<void>> {
    return this.notificationProvider.sendConfirmationEmail(userEmail)
  }

  async subscribeToNewsletter(email: string): Promise<ApiResponse<void>> {
    return this.notificationProvider.subscribeToNewsletter(email)
  }
}

// Factory function para crear instancias con dependencias inyectadas
export function createNotificationService(notificationProvider: NotificationProvider): NotificationService {
  return new NotificationService(notificationProvider)
}
