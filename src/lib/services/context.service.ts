import { UserContext, ContextSwitchOptions, ContextValidationResult, PlatformRole, Organization } from '@/types'
import { prisma } from '@/lib/prisma'
import { BaseApiResponse } from '@/types'
import { transformDateFields } from '@/lib/utils/api.utils'

export class ContextService {
  
  // Obtener contexto actual del usuario
  async getCurrentContext(userId: string): Promise<BaseApiResponse<UserContext>> {
    try {
      const context = await prisma.userContext.findUnique({
        where: { userId },
        include: {
          user: true,
          organization: {
            include: {
              members: {
                where: { userId, activo: true },
                include: { user: true }
              }
            }
          }
        }
      })

      if (!context) {
        return {
          success: false,
          error: 'Usuario no tiene contexto activo configurado'
        }
      }

      return {
        success: true,
        data: transformDateFields(context) as unknown as UserContext
      }
    } catch {
      return {
        success: false,
        error: 'Error al obtener contexto actual'
      }
    }
  }

  // Obtener opciones de cambio de contexto
  async getContextSwitchOptions(userId: string): Promise<BaseApiResponse<ContextSwitchOptions>> {
    try {
      const [userRoles, memberships, currentContext] = await Promise.all([
        // Roles de plataforma del usuario
        prisma.userRole.findMany({
          where: { userId, activo: true },
          select: { role: true }
        }),
        // Organizaciones donde el usuario es miembro
        prisma.organizationMember.findMany({
          where: { userId, activo: true },
          include: {
            organization: {
              include: {
                profile: true
              }
            }
          }
        }),
        // Contexto actual
        this.getCurrentContext(userId)
      ])

      const availableRoles = userRoles.map(ur => ur.role) as PlatformRole[]
      const availableOrganizations = memberships.map(m => transformDateFields(m.organization) as unknown as Organization)

      return {
        success: true,
        data: {
          availableRoles,
          availableOrganizations,
          currentContext: currentContext.data!
        }
      }
    } catch {
      return {
        success: false,
        error: 'Error al obtener opciones de contexto'
      }
    }
  }

  // Cambiar contexto del usuario
  async switchContext(
    userId: string, 
    activeRole: PlatformRole, 
    activeOrganizationId?: string
  ): Promise<BaseApiResponse<UserContext>> {
    try {
      // Validar el cambio de contexto
      const validation = await this.validateContextSwitch(userId, activeRole, activeOrganizationId)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // Actualizar o crear contexto
      const context = await prisma.userContext.upsert({
        where: { userId },
        update: {
          activeRole,
          activeOrganizationId,
          lastSwitchedAt: new Date()
        },
        create: {
          userId,
          activeRole,
          activeOrganizationId,
          lastSwitchedAt: new Date()
        },
        include: {
          user: true,
          organization: {
            include: {
              profile: true
            }
          }
        }
      })

      return {
        success: true,
        data: transformDateFields(context) as unknown as UserContext,
        message: `Contexto cambiado a ${activeRole}${activeOrganizationId ? ' en organización' : ''}`
      }
    } catch {
      return {
        success: false,
        error: 'Error al cambiar contexto'
      }
    }
  }

  // Validar cambio de contexto
  private async validateContextSwitch(
    userId: string, 
    activeRole: PlatformRole, 
    activeOrganizationId?: string
  ): Promise<ContextValidationResult> {
    try {
      // Verificar que el usuario tiene el rol de plataforma
      const userRole = await prisma.userRole.findUnique({
        where: {
          userId_role: { userId, role: activeRole }
        }
      })

      if (!userRole || !userRole.activo) {
        return {
          isValid: false,
          error: `Usuario no tiene el rol ${activeRole} activo`
        }
      }

      // Si se especifica organización, verificar membresía
      if (activeOrganizationId) {
        const membership = await prisma.organizationMember.findUnique({
          where: {
            organizationId_userId: {
              organizationId: activeOrganizationId,
              userId
            }
          }
        })

        if (!membership || !membership.activo) {
          return {
            isValid: false,
            error: 'Usuario no es miembro activo de la organización especificada'
          }
        }
      }

      return { isValid: true }
    } catch {
      return {
        isValid: false,
        error: 'Error al validar cambio de contexto'
      }
    }
  }

  // Crear contexto inicial para usuario nuevo
  async createInitialContext(userId: string, initialRole: PlatformRole): Promise<BaseApiResponse<UserContext>> {
    try {
      // Crear rol de plataforma
      await prisma.userRole.create({
        data: {
          userId,
          role: initialRole,
          activo: true
        }
      })

      // Crear contexto inicial
      const context = await prisma.userContext.create({
        data: {
          userId,
          activeRole: initialRole,
          lastSwitchedAt: new Date()
        },
        include: {
          user: true
        }
      })

      return {
        success: true,
        data: transformDateFields(context) as unknown as UserContext,
        message: 'Contexto inicial creado exitosamente'
      }
    } catch {
      return {
        success: false,
        error: 'Error al crear contexto inicial'
      }
    }
  }

  // Agregar rol de plataforma a usuario
  async addPlatformRole(userId: string, role: PlatformRole): Promise<BaseApiResponse<void>> {
    try {
      await prisma.userRole.create({
        data: {
          userId,
          role,
          activo: true
        }
      })

      return {
        success: true,
        message: `Rol ${role} agregado exitosamente`
      }
    } catch {
      return {
        success: false,
        error: 'Error al agregar rol de plataforma'
      }
    }
  }

  // Remover rol de plataforma de usuario
  async removePlatformRole(userId: string, role: PlatformRole): Promise<BaseApiResponse<void>> {
    try {
      await prisma.userRole.update({
        where: {
          userId_role: { userId, role }
        },
        data: {
          activo: false
        }
      })

      return {
        success: true,
        message: `Rol ${role} removido exitosamente`
      }
    } catch {
      return {
        success: false,
        error: 'Error al remover rol de plataforma'
      }
    }
  }
}

// Factory function para crear instancias
export function createContextService(): ContextService {
  return new ContextService()
}
