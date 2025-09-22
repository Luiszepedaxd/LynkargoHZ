import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Crear cliente admin directamente en la API route para asegurar que use las variables correctas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eddhbaovqdecryoanmik.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZGhiYW92cWRlY3J5b2FubWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTMwNjk1NiwiZXhwIjoyMDcwODgyOTU2fQ.gKOAQFWrS7z7LOxr4HfHFNhx01mFJ1CIp3rcyQMQXrw'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Schema de validación para registro
const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  telefono: z.string().optional(),
  initialRole: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN']).default('CLIENTE')
})

// POST - Registrar nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = registerSchema.parse(body)
    
    console.log('Iniciando registro con datos:', { 
      email: validatedData.email, 
      nombre: validatedData.nombre,
      role: validatedData.initialRole 
    })
    
    console.log('Usando service key:', supabaseServiceKey.substring(0, 20) + '...')

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
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
      throw new Error('Error creating auth user: ' + authError.message)
    }

    if (!authData.user) {
      throw new Error('No user returned from auth creation')
    }

    console.log('Usuario auth creado:', authData.user.id)

    // 2. Insertar en tabla users usando supabaseAdmin
    const { error: userInsertError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: authData.user.id,
        email: validatedData.email,
        nombre: validatedData.nombre,
        telefono: validatedData.telefono || null,
        activo: true
      }])

    if (userInsertError) {
      console.error('Error insertando en users:', userInsertError)
      // Cleanup: eliminar usuario de auth si falló la inserción
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error('Error saving user data: ' + userInsertError.message)
    }

    console.log('Usuario insertado en tabla users')

    // 3. Crear rol de plataforma
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert([{
        user_id: authData.user.id,
        role: validatedData.initialRole,
        activo: true
      }])

    if (roleError) {
      console.error('Error creando rol (no critico):', roleError)
    } else {
      console.log('Rol de usuario creado')
    }

    // 4. Crear contexto inicial
    const { error: contextError } = await supabaseAdmin
      .from('user_contexts')
      .insert([{
        user_id: authData.user.id,
        active_role: validatedData.initialRole,
        last_switched_at: new Date().toISOString()
      }])

    if (contextError) {
      console.error('Error creando contexto (no critico):', contextError)
    } else {
      console.log('Contexto de usuario creado')
    }

    console.log('Registro completado exitosamente')

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente. Revisa tu email para confirmar tu cuenta.',
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
    console.error('Error general en registro:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
