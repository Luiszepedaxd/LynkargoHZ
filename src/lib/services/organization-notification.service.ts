import { OrganizationNotificationInterface } from '@/lib/interfaces/organization.interface'
import { BaseApiResponse } from '@/lib/interfaces/base.interface'
import { OrganizationMember } from '@/types'
import { NotificationService } from './notification.service'

export class OrganizationNotificationService implements OrganizationNotificationInterface {
  constructor(private notificationService: NotificationService) {}

  async sendInvitationNotification(memberData: OrganizationMember): Promise<BaseApiResponse<void>> {
    try {
      await this.notificationService.create({
        userId: memberData.userId,
        tipo: 'INVITACION',
        titulo: 'Invitación a organización',
        mensaje: `Has sido invitado a unirte a la organización ${memberData.organization?.nombre}`,
        datos: {
          organizationId: memberData.organizationId,
          role: memberData.role,
          memberId: memberData.id
        }
      })

      return { success: true, message: 'Notificación de invitación enviada' }
    } catch (error) {
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
        tipo: 'SISTEMA',
        titulo: 'Cambio de rol en organización',
        mensaje: `Tu rol en la organización ${memberData.organization?.nombre} ha sido cambiado a ${newRole}`,
        datos: {
          organizationId: memberData.organizationId,
          oldRole: memberData.role,
          newRole,
          memberId: memberData.id
        }
      })

      return { success: true, message: 'Notificación de cambio de rol enviada' }
    } catch (error) {
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
        tipo: 'SISTEMA',
        titulo: 'Removido de organización',
        mensaje: `Has sido removido de la organización ${organizationName}`,
        datos: {
          organizationName,
          action: 'removed'
        }
      })

      return { success: true, message: 'Notificación de remoción enviada' }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error al enviar notificación de remoción' 
      }
    }
  }
}
