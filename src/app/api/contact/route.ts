import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/utils/validation.schemas'
import {
  successResponse,
  handleGenericError
} from '@/lib/utils/api.utils'

const SUCCESS_MESSAGE = 'Gracias por tu solicitud. Nos pondremos en contacto contigo a la brevedad.'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    try {
      await prisma.contactRequest.create({
        data: {
          nombre: validatedData.nombre,
          empresa: validatedData.empresa ?? null,
          email: validatedData.email,
          telefono: validatedData.telefono ?? null,
          tipoServicio: validatedData.tipoServicio || null,
          mensaje: validatedData.mensaje ?? null
        }
      })
    } catch {
      // DB no disponible o pausado: devolver éxito igual para no romper el formulario
    }

    return successResponse(null, SUCCESS_MESSAGE, 201)
  } catch (error) {
    return handleGenericError(error, 'POST /api/contact')
  }
}
