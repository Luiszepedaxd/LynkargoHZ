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

    // Step 2: Insert into users table
    console.log('Paso 2: Insertando en tabla users')
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: validatedData.email,
        nombre: validatedData.nombre,
        telefono: validatedData.telefono || null,
        activo: true
      }])

    if (userError) {
      console.error('Error insertando usuario:', userError)
      // Cleanup auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({
        success: false,
        message: 'Error saving user: ' + userError.message
      }, { status: 500 })
    }

    console.log('Usuario insertado en tabla users')

    // Step 3: Create user role
    console.log('Paso 3: Creando rol de usuario')
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([{
        user_id: authData.user.id,
        role: validatedData.initialRole,
        activo: true
      }])

    if (roleError) {
      console.error('Error creando rol:', roleError)
    } else {
      console.log('Rol creado exitosamente')
    }

    // Step 4: Create user context
    console.log('Paso 4: Creando contexto de usuario')
    const { error: contextError } = await supabase
      .from('user_contexts')
      .insert([{
        user_id: authData.user.id,
        active_role: validatedData.initialRole,
        last_switched_at: new Date().toISOString()
      }])

    if (contextError) {
      console.error('Error creando contexto:', contextError)
    } else {
      console.log('Contexto creado exitosamente')
    }

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
