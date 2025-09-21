import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import type { PrismaClient } from '@prisma/client'

// Schema de validación para actualizar usuario
const updateUserSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  empresa: z.string().optional(),
  tipo: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN']).optional(),
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

// GET - Obtener usuario específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        orders: {
          include: {
            provider: {
              select: {
                id: true,
                nombre: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        // reviews: campo no existe en el modelo User
        // reviews: {
        //   include: {
        //     provider: {
        //       select: {
        //         id: true,
        //         nombre: true
        //       }
        //     }
        //   },
        //   orderBy: { createdAt: 'desc' }
        // },
        _count: {
          select: {
            orders: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = updateUserSchema.parse(body)
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Actualizar usuario con transacción
    const updatedUser = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      // Actualizar datos básicos del usuario
      const user = await tx.user.update({
        where: { id },
        data: {
          nombre: validatedData.nombre,
          // empresa: campo no existe en el modelo User
          // tipo: campo no existe en el modelo User
          updatedAt: new Date()
        }
      })
      
      // Actualizar o crear perfil
      if (validatedData.profile) {
        if (existingUser.profile) {
          // Actualizar perfil existente
          await tx.userProfile.update({
            where: { userId: id },
            data: {
              ...validatedData.profile,
              updatedAt: new Date()
            }
          })
        } else {
          // Crear nuevo perfil
          await tx.userProfile.create({
            data: {
              userId: id,
              ...validatedData.profile
            }
          })
        }
      }
      
      return user
    })
    
    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: { id: updatedUser.id, email: updatedUser.email }
    })
    
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    
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

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Eliminar usuario (esto también eliminará el perfil por CASCADE)
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
    
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
