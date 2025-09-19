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
          user: {
            select: {
              id: true,
              email: true,
              nombre: true,
              empresa: true
            }
          },
          servicios: {
            where: { activo: true }
          },
          ubicaciones: {
            where: { activo: true }
          },
          documentos: {
            where: { activo: true }
          },
          _count: {
            select: {
              orders: true,
              reviews: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { calificacion: 'desc' }
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
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    })
    
    if (!existingUser) {
      return errorResponse('Usuario no encontrado', 404)
    }
    
    // Verificar si ya es proveedor
    const existingProvider = await prisma.provider.findUnique({
      where: { userId: validatedData.userId }
    })
    
    if (existingProvider) {
      return errorResponse('Este usuario ya es proveedor', 400)
    }
    
    // Crear proveedor con transacción
    const newProvider = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      const provider = await tx.provider.create({
        data: {
          userId: validatedData.userId,
          nombre: validatedData.nombre,
          descripcion: validatedData.descripcion
        }
      })
      
      // Crear servicios si se proporcionan
      if (validatedData.servicios && validatedData.servicios.length > 0) {
        await tx.service.createMany({
          data: validatedData.servicios.map(servicio => ({
            providerId: provider.id,
            ...servicio
          }))
        })
      }
      
      // Crear ubicaciones si se proporcionan
      if (validatedData.ubicaciones && validatedData.ubicaciones.length > 0) {
        await tx.location.createMany({
          data: validatedData.ubicaciones.map(ubicacion => ({
            providerId: provider.id,
            ...ubicacion
          }))
        })
      }
      
      // Crear documentos si se proporcionan
      if (validatedData.documentos && validatedData.documentos.length > 0) {
        await tx.document.createMany({
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
