import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para crear proveedor
const createProviderSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  servicios: z.array(z.object({
    nombre: z.string().min(2, 'Nombre del servicio requerido'),
    descripcion: z.string().optional(),
    precio: z.number().positive('El precio debe ser positivo').optional(),
    unidad: z.string().optional()
  })).optional(),
  ubicaciones: z.array(z.object({
    ciudad: z.string().min(2, 'Ciudad requerida'),
    estado: z.string().min(2, 'Estado requerido'),
    pais: z.string().default('México')
  })).optional(),
  documentos: z.array(z.object({
    tipo: z.enum(['RFC', 'ACTA_CONSTITUTIVA', 'COMPROBANTE_DOMICILIO', 'SEGURO', 'LICENCIA', 'OTRO']),
    nombre: z.string().min(2, 'Nombre del documento requerido'),
    url: z.string().url('URL del documento inválida')
  })).optional()
})

// GET - Obtener todos los proveedores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const ciudad = searchParams.get('ciudad')
    const estado = searchParams.get('estado')
    const servicio = searchParams.get('servicio')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: {
      activo: boolean;
      ubicaciones?: { some: { ciudad?: { contains: string; mode: 'insensitive' }; estado?: { contains: string; mode: 'insensitive' } } };
      servicios?: { some: { nombre: { contains: string; mode: 'insensitive' } } };
      OR?: Array<{ nombre: { contains: string; mode: 'insensitive' }; descripcion: { contains: string; mode: 'insensitive' } }>;
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

    return NextResponse.json({
      success: true,
      data: providers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo proveedores:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
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
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar si ya es proveedor
    const existingProvider = await prisma.provider.findUnique({
      where: { userId: validatedData.userId }
    })
    
    if (existingProvider) {
      return NextResponse.json(
        { success: false, message: 'Este usuario ya es proveedor' },
        { status: 400 }
      )
    }
    
    // Crear proveedor con transacción
    const newProvider = await prisma.$transaction(async (tx) => {
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
    
    return NextResponse.json({
      success: true,
      message: 'Proveedor creado exitosamente',
      data: { id: newProvider.id, nombre: newProvider.nombre }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creando proveedor:', error)
    
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
