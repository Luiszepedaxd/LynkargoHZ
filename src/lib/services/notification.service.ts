import { ApiResponse } from '@/types'
import { NotificationProvider } from '@/lib/providers/notification.provider'
import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

interface CreateNotificationData {
  userId: string
  tipo: NotificationType
  titulo: string
  mensaje: string
  accionUrl?: string
  accionTexto?: string
  leida?: boolean
}

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

  async create(data: CreateNotificationData): Promise<ApiResponse<void>> {
    try {
      await prisma.notification.create({
        data: {
          userId: data.userId,
          tipo: data.tipo,
          titulo: data.titulo,
          mensaje: data.mensaje,
          accionUrl: data.accionUrl,
          accionTexto: data.accionTexto,
          leida: data.leida || false
        }
      })

      return { success: true, message: 'Notificación creada exitosamente' }
    } catch {
      return { 
        success: false, 
        error: 'Error al crear notificación' 
      }
    }
  }
}

// Factory function para crear instancias con dependencias inyectadas
export function createNotificationService(notificationProvider: NotificationProvider): NotificationService {
  return new NotificationService(notificationProvider)
}
