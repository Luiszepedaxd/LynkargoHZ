import { ApiResponse } from '@/types'
import { NotificationRepositoryInterface } from '@/lib/repositories/notification.repository'

export interface NotificationProvider {
  sendWelcomeEmail(userEmail: string): Promise<ApiResponse<void>>
  sendConfirmationEmail(userEmail: string): Promise<ApiResponse<void>>
  subscribeToNewsletter(email: string): Promise<ApiResponse<void>>
}

export class NotificationProviderService implements NotificationProvider {
  constructor(private notificationRepository: NotificationRepositoryInterface) {}

  async sendWelcomeEmail(userEmail: string): Promise<ApiResponse<void>> {
    return this.notificationRepository.sendWelcomeEmail(userEmail)
  }

  async sendConfirmationEmail(userEmail: string): Promise<ApiResponse<void>> {
    return this.notificationRepository.sendConfirmationEmail(userEmail)
  }

  async subscribeToNewsletter(email: string): Promise<ApiResponse<void>> {
    return this.notificationRepository.subscribeToNewsletter(email)
  }
}
