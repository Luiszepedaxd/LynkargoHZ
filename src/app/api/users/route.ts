import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para crear usuario
const createUserSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  empresa: z.string().optional(),
  tipo: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN']),
  profile: z.object({
    telefono: z.string().optional(),
    direccion: z.string().optional(),
    ciudad: z.string().optional(),
    estado: z.string().optional(),
    codigoPostal: z.string().optional(),
    rfc: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    descripcion: z.string().optional(),
    logo: z.string().optional()
  }).optional()
})

// Schema de validación para actualizar usuario (comentado por ahora)
// const updateUserSchema = z.object({
//   nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
//   empresa: z.string().optional(),
//   tipo: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN']).optional(),
//   profile: z.object({
//     telefono: z.string().optional(),
//     direccion: z.string().optional(),
//     ciudad: z.string().optional(),
//     estado: z.string().optional(),
//     codigoPostal: z.string().optional(),
//     rfc: z.string().optional(),
//     website: z.string().url().optional().or(z.literal('')),
//     descripcion: z.string().optional(),
//     logo: z.string().optional()
//   }).optional()
// })

// GET - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tipo = searchParams.get('tipo')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: {
      tipo?: string;
      OR?: Array<{
        nombre: { contains: string; mode: 'insensitive' };
        email: { contains: string; mode: 'insensitive' };
        empresa: { contains: string; mode: 'insensitive' };
      }>;
    } = {}
    if (tipo) where.tipo = tipo
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

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
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
      return NextResponse.json(
        { success: false, message: 'Este correo ya está registrado' },
        { status: 400 }
      )
    }
    
    // Crear usuario con transacción
    const newUser = await prisma.$transaction(async (tx) => {
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
    
    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: { id: newUser.id, email: newUser.email }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creando usuario:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
