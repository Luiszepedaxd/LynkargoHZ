import { prisma } from '@/lib/prisma'
import { 
  BaseApiResponse, 
  BasePaginatedResponse, 
  BaseSearchFilters 
} from '@/lib/interfaces/base.interface'
import { 
  successResponse, 
  errorResponse, 
  paginatedResponse, 
  handleGenericError,
  extractPaginationParams,
  calculatePagination 
} from '@/lib/utils/api.utils'
import { Prisma } from '@prisma/client'

// Clase base abstracta para repositorios siguiendo principios SOLID
export abstract class BaseRepository<T, CreateData, UpdateData, Filters = BaseSearchFilters> {
  protected abstract modelName: string

  // Método abstracto que debe ser implementado por las clases hijas
  protected abstract getPrismaModel(): Prisma.OrganizationDelegate | Prisma.OrganizationMemberDelegate

  // Métodos comunes reutilizables
  protected async findById(id: string, include?: Prisma.OrganizationInclude | Prisma.OrganizationMemberInclude): Promise<BaseApiResponse<T>> {
    try {
      const model = this.getPrismaModel()
      const result = await model.findUnique({
        where: { id },
        include
      })

      if (!result) {
        return errorResponse(`${this.modelName} no encontrado`, 404)
      }

      return successResponse(result)
    } catch (error) {
      return handleGenericError(error, `${this.modelName}Repository.findById`)
    }
  }

  protected async findMany(
    filters?: Filters, 
    include?: Prisma.OrganizationInclude | Prisma.OrganizationMemberInclude,
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationMemberOrderByWithRelationInput
  ): Promise<BasePaginatedResponse<T>> {
    try {
      const { page, limit } = extractPaginationParams(filters)
      const { skip } = calculatePagination(page, limit, 0)

      const model = this.getPrismaModel()
      
      // Construir filtros de búsqueda
      const where = this.buildWhereClause(filters)

      const [results, total] = await Promise.all([
        model.findMany({
          where,
          include,
          skip,
          take: limit,
          orderBy: orderBy || { createdAt: 'desc' }
        }),
        model.count({ where })
      ])

      const pagination = calculatePagination(page, limit, total).pagination

      return paginatedResponse(results, pagination)
    } catch (error) {
      return handleGenericError(error, `${this.modelName}Repository.findMany`)
    }
  }

  protected async create(data: CreateData, include?: Prisma.OrganizationInclude | Prisma.OrganizationMemberInclude): Promise<BaseApiResponse<T>> {
    try {
      const model = this.getPrismaModel()
      const result = await model.create({
        data,
        include
      })

      return successResponse(result, `${this.modelName} creado exitosamente`)
    } catch (error) {
      return handleGenericError(error, `${this.modelName}Repository.create`)
    }
  }

  protected async update(
    id: string, 
    data: Partial<UpdateData>, 
    include?: Prisma.OrganizationInclude | Prisma.OrganizationMemberInclude
  ): Promise<BaseApiResponse<T>> {
    try {
      const model = this.getPrismaModel()
      const result = await model.update({
        where: { id },
        data,
        include
      })

      return successResponse(result, `${this.modelName} actualizado exitosamente`)
    } catch (error) {
      return handleGenericError(error, `${this.modelName}Repository.update`)
    }
  }

  protected async delete(id: string): Promise<BaseApiResponse<void>> {
    try {
      const model = this.getPrismaModel()
      await model.delete({
        where: { id }
      })

      return successResponse(undefined, `${this.modelName} eliminado exitosamente`)
    } catch (error) {
      return handleGenericError(error, `${this.modelName}Repository.delete`)
    }
  }

  // Método abstracto para construir cláusulas WHERE específicas
  protected abstract buildWhereClause(filters?: Filters): Prisma.OrganizationWhereInput | Prisma.OrganizationMemberWhereInput

  // Método para verificar existencia de un registro
  protected async exists(id: string): Promise<boolean> {
    try {
      const model = this.getPrismaModel()
      const count = await model.count({
        where: { id }
      })
      return count > 0
    } catch {
      return false
    }
  }

  // Método para contar registros con filtros
  protected async count(filters?: Filters): Promise<number> {
    try {
      const model = this.getPrismaModel()
      const where = this.buildWhereClause(filters)
      return await model.count({ where })
    } catch {
      return 0
    }
  }

  // Método para operaciones en transacción
  protected async executeTransaction<R>(
    callback: (tx: Prisma.TransactionClient) => Promise<R>
  ): Promise<BaseApiResponse<R>> {
    try {
      const result = await prisma.$transaction(callback)
      return successResponse(result)
    } catch (error) {
      return handleGenericError(error, `${this.modelName}Repository.transaction`)
    }
  }
}