import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/utils/validation.schemas'
import {
  successResponse,
  errorResponse,
  handleGenericError
} from '@/lib/utils/api.utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    await prisma.contactRequest.create({
      data: {
        nombre: validatedData.nombre,
        empresa: validatedData.empresa ?? null,
        email: validatedData.email,
        telefono: validatedData.telefono ?? null,
        tipoServicio: (validatedData.tipoServicio && validatedData.tipoServicio !== '') ? validatedData.tipoServicio : null,
        mensaje: validatedData.mensaje ?? null
      }
    })

    return successResponse(
      null,
      'Gracias por tu solicitud. Nos pondremos en contacto contigo a la brevedad.',
      201
    )
  } catch (error) {
    return handleGenericError(error, 'POST /api/contact')
  }
}
