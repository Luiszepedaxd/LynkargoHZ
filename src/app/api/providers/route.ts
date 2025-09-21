import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { PrismaClient } from '@prisma/client'
import { createProviderSchema } from '@/lib/utils/validation.schemas'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  handleGenericError,
  extractPaginationParams,
  calculatePagination
} from '@/lib/utils/api.utils'

// GET - Obtener todos los proveedores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search } = extractPaginationParams(searchParams)
    const ciudad = searchParams.get('ciudad')
    const estado = searchParams.get('estado')
    const servicio = searchParams.get('servicio')

    const { skip } = calculatePagination(page, limit, 0)

    // Construir filtros
    const where: {
      activo: boolean;
      ubicaciones?: { some: { ciudad?: { contains: string; mode: 'insensitive' }; estado?: { contains: string; mode: 'insensitive' } } };
      servicios?: { some: { nombre: { contains: string; mode: 'insensitive' } } };
      OR?: Array<{ nombre?: { contains: string; mode: 'insensitive' }; descripcion?: { contains: string; mode: 'insensitive' } }>;
    } = { activo: true }
    
    if (ciudad || estado) {
      where.ubicaciones = {
        some: {}
      }
      if (ciudad) where.ubicaciones.some.ciudad = { contains: ciudad, mode: 'insensitive' }
      if (estado) where.ubicaciones.some.estado = { contains: estado, mode: 'insensitive' }
    }
    
    if (servicio) {
      where.servicios = {
        some: {
          nombre: { contains: servicio, mode: 'insensitive' }
        }
      }
    }
    
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Obtener proveedores con paginación
    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              nombre: true,
              tipo: true
            }
          },
          services: {
            where: { activo: true }
          },
          locations: {
            where: { activo: true }
          },
          documents: {
            where: { verificado: true }
          },
          _count: {
            select: {
              orders: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.provider.count({ where })
    ])

    const finalPagination = calculatePagination(page, limit, total).pagination
    return paginatedResponse(providers, finalPagination)

  } catch (error) {
    return handleGenericError(error, 'GET /api/providers')
  }
}

// POST - Crear nuevo proveedor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = createProviderSchema.parse(body)
    
    // TODO: Obtener userId del token de autenticación
    const userId = 'temp-user-id' // Reemplazar con autenticación real
    
    // Verificar si la organización existe
    const existingOrganization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId }
    })
    
    if (!existingOrganization) {
      return errorResponse('Organización no encontrada', 404)
    }
    
    // Verificar si ya existe un proveedor con ese nombre en la organización
    const existingProvider = await prisma.provider.findFirst({
      where: { 
        organizationId: validatedData.organizationId,
        nombre: validatedData.nombre
      }
    })
    
    if (existingProvider) {
      return errorResponse('Ya existe un proveedor con este nombre en la organización', 400)
    }
    
    // Crear proveedor con transacción
    const newProvider = await prisma.$transaction(async (tx) => {
      const provider = await tx.provider.create({
        data: {
          organizationId: validatedData.organizationId,
          nombre: validatedData.nombre,
          descripcion: validatedData.descripcion
        }
      })
      
      // Crear servicios si se proporcionan
      if (validatedData.servicios && validatedData.servicios.length > 0) {
        await tx.providerService.createMany({
          data: validatedData.servicios.map(servicio => ({
            providerId: provider.id,
            ...servicio
          }))
        })
      }
      
      // Crear ubicaciones si se proporcionan
      if (validatedData.ubicaciones && validatedData.ubicaciones.length > 0) {
        await tx.providerLocation.createMany({
          data: validatedData.ubicaciones.map(ubicacion => ({
            providerId: provider.id,
            ...ubicacion
          }))
        })
      }
      
      // Crear documentos si se proporcionan
      if (validatedData.documentos && validatedData.documentos.length > 0) {
        await tx.providerDocument.createMany({
          data: validatedData.documentos.map(documento => ({
            providerId: provider.id,
            ...documento
          }))
        })
      }
      
      return provider
    })
    
    return successResponse(
      { id: newProvider.id, nombre: newProvider.nombre },
      'Proveedor creado exitosamente',
      201
    )
    
  } catch (error) {
    return handleGenericError(error, 'POST /api/providers')
  }
}
