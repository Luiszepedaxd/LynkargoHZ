import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { PrismaClient, UserType } from '@prisma/client'
import { createUserSchema } from '@/lib/utils/validation.schemas'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  handleGenericError,
  extractPaginationParams,
  calculatePagination
} from '@/lib/utils/api.utils'

// GET - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search } = extractPaginationParams(searchParams)
    const tipo = searchParams.get('tipo')

    const { skip } = calculatePagination(page, limit, 0)

    // Construir filtros
    const where: {
      tipo?: UserType;
      OR?: Array<{
        nombre?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        empresa?: { contains: string; mode: 'insensitive' };
      }>;
    } = {}
    
    if (tipo) where.tipo = tipo as UserType
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { empresa: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Obtener usuarios con paginación
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          profile: true,
          _count: {
            select: {
              orders: true,
              reviews: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    const finalPagination = calculatePagination(page, limit, total).pagination

    return paginatedResponse(users, finalPagination)

  } catch (error) {
    return handleGenericError(error, 'GET /api/users')
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = createUserSchema.parse(body)
    
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return errorResponse('Este correo ya está registrado', 400)
    }
    
    // Crear usuario con transacción
    const newUser = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          nombre: validatedData.nombre,
          empresa: validatedData.empresa,
          tipo: validatedData.tipo
        }
      })
      
      // Crear perfil si se proporciona
      if (validatedData.profile) {
        await tx.userProfile.create({
          data: {
            userId: user.id,
            ...validatedData.profile
          }
        })
      }
      
      return user
    })
    
    return successResponse(
      { id: newUser.id, email: newUser.email },
      'Usuario creado exitosamente',
      201
    )
    
  } catch (error) {
    return handleGenericError(error, 'POST /api/users')
  }
}
