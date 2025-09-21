import { UserPermissions, MemberRole, PlatformRole } from '@/types'
import { prisma } from '@/lib/prisma'
import { BaseApiResponse } from '@/types'

export class PermissionsService {
  
  // Obtener permisos del usuario en contexto actual
  async getUserPermissions(
    userId: string, 
    organizationId?: string
  ): Promise<BaseApiResponse<UserPermissions>> {
    try {
      // Obtener contexto actual
      const context = await prisma.userContext.findUnique({
        where: { userId },
        include: {
          organization: true
        }
      })

      if (!context) {
        return {
          success: false,
          error: 'Usuario no tiene contexto activo'
        }
      }

      // Determinar el rol organizacional si hay organización
      let memberRole: MemberRole | null = null
      if (organizationId || context.activeOrganizationId) {
        const membership = await prisma.organizationMember.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organizationId || context.activeOrganizationId!,
              userId
            }
          }
        })
        memberRole = membership?.role || null
      }

      // Calcular permisos basados en rol de plataforma y organizacional
      const permissions = this.calculatePermissions(context.activeRole, memberRole)

      return {
        success: true,
        data: permissions
      }
    } catch {
      return {
        success: false,
        error: 'Error al obtener permisos del usuario'
      }
    }
  }

  // Calcular permisos basados en roles
  private calculatePermissions(
    platformRole: PlatformRole, 
    memberRole: MemberRole | null
  ): UserPermissions {
    const permissions: UserPermissions = {
      canCreateServices: false,
      canViewOrders: false,
      canManageTeam: false,
      canConfigurePricing: false,
      canDeleteOrganization: false,
      canInviteMembers: false,
      canManageMembers: false
    }

    // Permisos por rol de plataforma
    switch (platformRole) {
      case 'ADMIN':
        // Admin tiene todos los permisos
        Object.keys(permissions).forEach(key => {
          permissions[key as keyof UserPermissions] = true
        })
        break

      case 'CLIENTE':
        // Cliente solo puede ver órdenes
        permissions.canViewOrders = true
        break

      case 'PROVEEDOR':
        // Proveedor tiene permisos básicos
        permissions.canViewOrders = true
        
        // Permisos adicionales basados en rol organizacional
        if (memberRole) {
          switch (memberRole) {
            case 'OWNER':
              Object.keys(permissions).forEach(key => {
                permissions[key as keyof UserPermissions] = true
              })
              break
            case 'ADMIN':
              permissions.canCreateServices = true
              permissions.canManageTeam = true
              permissions.canConfigurePricing = true
              permissions.canInviteMembers = true
              permissions.canManageMembers = true
              break
            case 'MANAGER':
              permissions.canCreateServices = true
              permissions.canConfigurePricing = true
              permissions.canManageMembers = true
              break
            case 'OPERATOR':
              permissions.canCreateServices = true
              break
            case 'VIEWER':
              // Solo lectura, no permisos adicionales
              break
          }
        }
        break
    }

    return permissions
  }

  // Verificar si usuario puede realizar una acción específica
  async canPerformAction(
    userId: string, 
    action: keyof UserPermissions,
    organizationId?: string
  ): Promise<boolean> {
    try {
      const permissionsResult = await this.getUserPermissions(userId, organizationId)
      
      if (!permissionsResult.success || !permissionsResult.data) {
        return false
      }

      return permissionsResult.data[action]
    } catch {
      return false
    }
  }

  // Obtener matriz de permisos para referencia
  getPermissionMatrix(): { [key: string]: { [role in MemberRole]: boolean } } {
    return {
      canCreateServices: {
        OWNER: true,
        ADMIN: true,
        MANAGER: true,
        OPERATOR: true,
        VIEWER: false
      },
      canViewOrders: {
        OWNER: true,
        ADMIN: true,
        MANAGER: true,
        OPERATOR: true,
        VIEWER: true
      },
      canManageTeam: {
        OWNER: true,
        ADMIN: true,
        MANAGER: false,
        OPERATOR: false,
        VIEWER: false
      },
      canConfigurePricing: {
        OWNER: true,
        ADMIN: true,
        MANAGER: true,
        OPERATOR: false,
        VIEWER: false
      },
      canDeleteOrganization: {
        OWNER: true,
        ADMIN: false,
        MANAGER: false,
        OPERATOR: false,
        VIEWER: false
      },
      canInviteMembers: {
        OWNER: true,
        ADMIN: true,
        MANAGER: false,
        OPERATOR: false,
        VIEWER: false
      },
      canManageMembers: {
        OWNER: true,
        ADMIN: true,
        MANAGER: true,
        OPERATOR: false,
        VIEWER: false
      }
    }
  }

  // Middleware para verificar permisos en rutas
  async checkRoutePermission(
    userId: string,
    requiredPermission: keyof UserPermissions,
    organizationId?: string
  ): Promise<BaseApiResponse<boolean>> {
    try {
      const hasPermission = await this.canPerformAction(userId, requiredPermission, organizationId)
      
      if (!hasPermission) {
        return {
          success: false,
          error: 'Usuario no tiene permisos para realizar esta acción'
        }
      }

      return {
        success: true,
        data: true
      }
    } catch {
      return {
        success: false,
        error: 'Error al verificar permisos'
      }
    }
  }

  // Obtener roles disponibles para invitar a organización
  async getAvailableRolesForInvitation(
    inviterUserId: string,
    organizationId: string
  ): Promise<BaseApiResponse<MemberRole[]>> {
    try {
      // Verificar que el usuario puede invitar miembros
      const canInvite = await this.canPerformAction(inviterUserId, 'canInviteMembers', organizationId)
      
      if (!canInvite) {
        return {
          success: false,
          error: 'Usuario no tiene permisos para invitar miembros'
        }
      }

      // Obtener rol del usuario que invita
      const inviterMembership = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: inviterUserId
          }
        }
      })

      if (!inviterMembership) {
        return {
          success: false,
          error: 'Usuario no es miembro de la organización'
        }
      }

      // Determinar roles disponibles basados en el rol del invitador
      let availableRoles: MemberRole[] = []
      
      switch (inviterMembership.role) {
        case 'OWNER':
          availableRoles = ['ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER']
          break
        case 'ADMIN':
          availableRoles = ['MANAGER', 'OPERATOR', 'VIEWER']
          break
        case 'MANAGER':
          availableRoles = ['OPERATOR', 'VIEWER']
          break
        default:
          availableRoles = []
      }

      return {
        success: true,
        data: availableRoles
      }
    } catch {
      return {
        success: false,
        error: 'Error al obtener roles disponibles'
      }
    }
  }
}

// Factory function para crear instancias
export function createPermissionsService(): PermissionsService {
  return new PermissionsService()
}
