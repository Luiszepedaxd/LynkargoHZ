import { OrganizationNotificationInterface } from '@/lib/interfaces/organization.interface'
import { BaseApiResponse } from '@/lib/interfaces/base.interface'
import { OrganizationMember } from '@/types'
import { NotificationService } from './notification.service'
import { NotificationType } from '@prisma/client'

export class OrganizationNotificationService implements OrganizationNotificationInterface {
  constructor(private notificationService: NotificationService) {}

  async sendInvitationNotification(memberData: OrganizationMember): Promise<BaseApiResponse<void>> {
    try {
      await this.notificationService.create({
        userId: memberData.userId,
        tipo: 'INVITATION' as NotificationType,
        titulo: 'Invitación a organización',
        mensaje: `Has sido invitado a unirte a la organización ${memberData.organization?.nombre}`,
        accionUrl: `/organizations/${memberData.organizationId}`,
        accionTexto: 'Ver organización'
      })

      return { success: true, message: 'Notificación de invitación enviada' }
    } catch {
      return { 
        success: false, 
        error: 'Error al enviar notificación de invitación' 
      }
    }
  }

  async sendRoleChangeNotification(
    memberData: OrganizationMember, 
    newRole: string
  ): Promise<BaseApiResponse<void>> {
    try {
      await this.notificationService.create({
        userId: memberData.userId,
        tipo: 'ROLE_CHANGE' as NotificationType,
        titulo: 'Cambio de rol en organización',
        mensaje: `Tu rol en la organización ${memberData.organization?.nombre} ha sido cambiado a ${newRole}`,
        accionUrl: `/organizations/${memberData.organizationId}`,
        accionTexto: 'Ver organización'
      })

      return { success: true, message: 'Notificación de cambio de rol enviada' }
    } catch {
      return { 
        success: false, 
        error: 'Error al enviar notificación de cambio de rol' 
      }
    }
  }

  async sendMemberRemovedNotification(
    userId: string, 
    organizationName: string
  ): Promise<BaseApiResponse<void>> {
    try {
      await this.notificationService.create({
        userId,
        tipo: 'WARNING' as NotificationType,
        titulo: 'Removido de organización',
        mensaje: `Has sido removido de la organización ${organizationName}`,
        accionTexto: 'Ver organizaciones'
      })

      return { success: true, message: 'Notificación de remoción enviada' }
    } catch {
      return { 
        success: false, 
        error: 'Error al enviar notificación de remoción' 
      }
    }
  }
}
