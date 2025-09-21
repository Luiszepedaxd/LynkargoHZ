import { BaseRepository } from './base.repository'
import { OrganizationRepositoryInterface } from '@/lib/interfaces/organization.interface'
import { 
  Organization, 
  OrganizationMember, 
  CreateOrganizationFormData, 
  InviteMemberFormData, 
  UpdateMemberRoleData,
  BaseApiResponse,
  BasePaginatedResponse,
  BaseSearchFilters,
  OrganizationStats
} from '@/types'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleGenericError } from '@/lib/utils/api.utils'
import { Prisma } from '@prisma/client'

export class PrismaOrganizationRepository 
  extends BaseRepository<Organization, CreateOrganizationFormData, CreateOrganizationFormData, BaseSearchFilters>
  implements OrganizationRepositoryInterface {

  protected modelName = 'Organization'

  protected getPrismaModel() {
    return prisma.organization
  }

  protected buildWhereClause(filters?: BaseSearchFilters): Prisma.OrganizationWhereInput {
    const where: Prisma.OrganizationWhereInput = {}
    
    if (filters?.search) {
      where.nombre = {
        contains: filters.search,
        mode: 'insensitive'
      }
    }
    
    return where
  }

  // Implementación de métodos específicos de organizaciones
  async create(data: CreateOrganizationFormData, ownerId: string): Promise<BaseApiResponse<Organization>> {
    try {
      const organization = await prisma.$transaction(async (tx) => {
        // Crear la organización
        const org = await tx.organization.create({
          data: {
            nombre: data.nombre,
            tipo: data.tipo,
            ...(data.profile && {
              profile: {
                create: data.profile
              }
            })
          },
          include: {
            profile: true,
            members: {
              include: {
                user: {
                  include: {
                    profile: true
                  }
                }
              }
            }
          }
        })

        // Agregar al creador como OWNER
        await tx.organizationMember.create({
          data: {
            organizationId: org.id,
            userId: ownerId,
            role: 'OWNER'
          }
        })

        return org
      })

      return successResponse(organization, 'Organización creada exitosamente')
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.create')
    }
  }

  async findByUserId(userId: string): Promise<BasePaginatedResponse<Organization>> {
    try {
      const memberships = await prisma.organizationMember.findMany({
        where: { userId },
        include: {
          organization: {
            include: {
              profile: true,
              _count: {
                select: {
                  members: true,
                  providers: true,
                  orders: true
                }
              }
            }
          }
        }
      })

      const organizations = memberships.map(membership => membership.organization)

      return successResponse(organizations, 'Organizaciones obtenidas exitosamente')
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.findByUserId')
    }
  }

  // Métodos específicos para miembros
  async getMembers(
    organizationId: string, 
    filters?: BaseSearchFilters
  ): Promise<BasePaginatedResponse<OrganizationMember>> {
    try {
      const { page, limit, search } = this.extractPaginationParams(filters)
      const { skip } = this.calculatePagination(page, limit, 0)

      const where: Prisma.OrganizationMemberWhereInput = { organizationId }
      
      if (search) {
        where.user = {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }
      }

      const [members, total] = await Promise.all([
        prisma.organizationMember.findMany({
          where,
          include: {
            user: {
              include: {
                profile: true
              }
            },
            organization: true
          },
          skip,
          take: limit,
          orderBy: { joinedAt: 'desc' }
        }),
        prisma.organizationMember.count({ where })
      ])

      const pagination = this.calculatePagination(page, limit, total).pagination

      return this.paginatedResponse(members, pagination)
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.getMembers')
    }
  }

  async inviteMember(
    data: InviteMemberFormData, 
    inviterId: string
  ): Promise<BaseApiResponse<OrganizationMember>> {
    try {
      // Verificar que el usuario que invita tenga permisos
      const inviterMembership = await prisma.organizationMember.findFirst({
        where: {
          organizationId: data.organizationId,
          userId: inviterId,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      })

      if (!inviterMembership) {
        return errorResponse('No tienes permisos para invitar miembros', 403)
      }

      // Buscar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      })

      let userId: string

      if (existingUser) {
        // Verificar si ya es miembro
        const existingMembership = await prisma.organizationMember.findUnique({
          where: {
            organizationId_userId: {
              organizationId: data.organizationId,
              userId: existingUser.id
            }
          }
        })

        if (existingMembership) {
          return errorResponse('Este usuario ya es miembro de la organización', 400)
        }

        userId = existingUser.id
      } else {
        // Crear usuario temporal (se activará cuando acepte la invitación)
        const newUser = await prisma.user.create({
          data: {
            email: data.email,
            nombre: data.nombre
          }
        })
        userId = newUser.id
      }

      // Crear la membresía
      const membership = await prisma.organizationMember.create({
        data: {
          organizationId: data.organizationId,
          userId,
          role: data.role
        },
        include: {
          user: {
            include: {
              profile: true
            }
          },
          organization: true
        }
      })

      return successResponse(membership, 'Invitación enviada exitosamente')
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.inviteMember')
    }
  }

  async updateMemberRole(
    data: UpdateMemberRoleData, 
    requesterId: string
  ): Promise<BaseApiResponse<OrganizationMember>> {
    try {
      // Verificar permisos del solicitante
      const requesterMembership = await prisma.organizationMember.findFirst({
        where: {
          userId: requesterId,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      })

      if (!requesterMembership) {
        return errorResponse('No tienes permisos para cambiar roles', 403)
      }

      const membership = await prisma.organizationMember.update({
        where: { id: data.memberId },
        data: { role: data.role },
        include: {
          user: {
            include: {
              profile: true
            }
          },
          organization: true
        }
      })

      return successResponse(membership, 'Rol actualizado exitosamente')
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.updateMemberRole')
    }
  }

  async removeMember(memberId: string, requesterId: string): Promise<BaseApiResponse<void>> {
    try {
      // Verificar permisos
      const requesterMembership = await prisma.organizationMember.findFirst({
        where: {
          userId: requesterId,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      })

      if (!requesterMembership) {
        return errorResponse('No tienes permisos para remover miembros', 403)
      }

      await prisma.organizationMember.delete({
        where: { id: memberId }
      })

      return successResponse(undefined, 'Miembro removido exitosamente')
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.removeMember')
    }
  }

  async acceptInvitation(
    memberId: string, 
    userId: string
  ): Promise<BaseApiResponse<OrganizationMember>> {
    try {
      const membership = await prisma.organizationMember.findUnique({
        where: { id: memberId }
      })

      if (!membership || membership.userId !== userId) {
        return errorResponse('Invitación no encontrada', 404)
      }

      const updatedMembership = await prisma.organizationMember.update({
        where: { id: memberId },
        data: { activo: true },
        include: {
          user: {
            include: {
              profile: true
            }
          },
          organization: true
        }
      })

      return successResponse(updatedMembership, 'Invitación aceptada exitosamente')
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.acceptInvitation')
    }
  }

  async getStats(organizationId: string): Promise<BaseApiResponse<OrganizationStats>> {
    try {
      const [
        totalMembers,
        totalProviders,
        activeProviders,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue
      ] = await Promise.all([
        prisma.organizationMember.count({
          where: { organizationId, activo: true }
        }),
        prisma.provider.count({
          where: { organizationId }
        }),
        prisma.provider.count({
          where: { organizationId, activo: true }
        }),
        prisma.order.count({
          where: { organizationId }
        }),
        prisma.order.count({
          where: { organizationId, estado: 'PENDIENTE' }
        }),
        prisma.order.count({
          where: { organizationId, estado: 'ENTREGADA' }
        }),
        prisma.order.aggregate({
          where: { 
            organizationId, 
            estado: 'ENTREGADA',
            precio: { not: null }
          },
          _sum: { precio: true }
        })
      ])

      const stats: OrganizationStats = {
        totalMembers,
        totalProviders,
        activeProviders,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue._sum.precio || 0
      }

      return successResponse(stats)
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.getStats')
    }
  }

  async getUserRole(userId: string, organizationId: string): Promise<BaseApiResponse<string>> {
    try {
      const membership = await prisma.organizationMember.findFirst({
        where: {
          userId,
          organizationId,
          activo: true
        }
      })

      if (!membership) {
        return errorResponse('Usuario no es miembro de esta organización', 404)
      }

      return successResponse(membership.role)
    } catch (error) {
      return handleGenericError(error, 'OrganizationRepository.getUserRole')
    }
  }

  // Métodos auxiliares privados para reutilizar funcionalidad común
  private extractPaginationParams(filters?: BaseSearchFilters) {
    return {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      search: filters?.search
    }
  }

  private calculatePagination(page: number, limit: number, total: number) {
    const pages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    return {
      pagination: {
        page,
        limit,
        total,
        pages
      },
      skip
    }
  }

  private paginatedResponse<T>(data: T[], pagination: { page: number; limit: number; total: number; pages: number }) {
    return {
      success: true,
      data,
      pagination
    }
  }
}
