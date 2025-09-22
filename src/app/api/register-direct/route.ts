import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Direct Supabase client with hardcoded service role key
const supabaseUrl = 'https://eddhbaovqdecryoanmik.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZGhiYW92cWRlY3J5b2FubWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTMwNjk1NiwiZXhwIjoyMDcwODgyOTU2fQ.gKOAQFWrS7z7LOxr4HfHFNhx01mFJ1CIp3rcyQMQXrw'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  telefono: z.string().optional(),
  initialRole: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN']).default('CLIENTE')
})

export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTRO DIRECTO INICIADO ===')
    
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    
    console.log('Datos validados:', {
      email: validatedData.email,
      nombre: validatedData.nombre,
      role: validatedData.initialRole
    })

    // Step 1: Create auth user
    console.log('Paso 1: Creando usuario en Auth')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      user_metadata: {
        nombre: validatedData.nombre,
        telefono: validatedData.telefono,
        initialRole: validatedData.initialRole
      }
    })

    if (authError) {
      console.error('Error en auth:', authError)
      return NextResponse.json({
        success: false,
        message: 'Error creating auth user: ' + authError.message
      }, { status: 500 })
    }

    if (!authData.user) {
      console.error('No user returned from auth')
      return NextResponse.json({
        success: false,
        message: 'No user returned from auth creation'
      }, { status: 500 })
    }

    console.log('Usuario auth creado con ID:', authData.user.id)

    // Step 2: Use custom SQL function (bypasses RLS permissions)
    console.log('Paso 2: Usando funcion SQL personalizada register_user')
    
    const { data: functionResult, error: functionError } = await supabase.rpc('register_user', {
      p_user_id: authData.user.id,
      p_email: validatedData.email,
      p_nombre: validatedData.nombre,
      p_telefono: validatedData.telefono || null,
      p_role: validatedData.initialRole
    })

    if (functionError) {
      console.error('Error llamando funcion register_user:', functionError)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({
        success: false,
        message: 'Error calling register function: ' + functionError.message
      }, { status: 500 })
    }

    console.log('Resultado de funcion register_user:', functionResult)

    // Check if function returned success
    if (!functionResult || !functionResult.success) {
      console.error('Function returned error:', functionResult)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({
        success: false,
        message: functionResult?.message || 'Unknown error from register function'
      }, { status: 500 })
    }

    console.log('Datos de usuario insertados exitosamente via funcion SQL')

    console.log('=== REGISTRO COMPLETADO EXITOSAMENTE ===')

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente. Revisa tu email para confirmar.',
      data: {
        user: {
          id: authData.user.id,
          email: validatedData.email,
          nombre: validatedData.nombre,
          telefono: validatedData.telefono
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error('=== ERROR GENERAL EN REGISTRO ===', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Datos invalidos',
        errors: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 })
  }
}
