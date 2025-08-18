import { useState } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { FormularioRegistro, AuthError } from '../types'
import { Eye, EyeOff, Building2, User, Mail, Lock, ArrowLeft, LogIn, UserPlus } from 'lucide-react'

export default function RegistroPage() {
  const { supabase } = useSupabase()
  const [isLoginMode, setIsLoginMode] = useState(false)
  const [formData, setFormData] = useState<FormularioRegistro>({
    nombre: '',
    correo: '',
    password: '',
    nombre_empresa: '',
    tipo_usuario: 'cliente'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (error?.field === name) {
      setError(null)
    }
  }

  const validateForm = (): boolean => {
    if (!isLoginMode) {
      if (!formData.nombre.trim()) {
        setError({ message: 'El nombre es requerido', field: 'nombre' })
        return false
      }
      if (formData.tipo_usuario === 'proveedor' && !formData.nombre_empresa?.trim()) {
        setError({ message: 'El nombre de empresa es requerido para proveedores', field: 'nombre_empresa' })
        return false
      }
    }
    if (!formData.correo.trim()) {
      setError({ message: 'El correo es requerido', field: 'correo' })
      return false
    }
    if (!formData.password || formData.password.length < 6) {
      setError({ message: 'La contraseña debe tener al menos 6 caracteres', field: 'password' })
      return false
    }
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.correo,
        password: formData.password,
      })

      if (authError) throw authError

      if (data.user) {
        setSuccess(true)
        // Redirigir o mostrar mensaje de éxito
      }
    } catch (error: any) {
      console.error('Error en login:', error)
      setError({ 
        message: error.message || 'Error al iniciar sesión. Verifica tus credenciales.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.correo,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            nombre_empresa: formData.nombre_empresa,
            tipo_usuario: formData.tipo_usuario
          }
        }
      })

      if (authError) throw authError

      if (authData.user && authData.user.id) {
        // Esperar un momento para asegurar que el usuario esté completamente creado
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 2. Insertar datos en la tabla cuentas
        const { error: dbError } = await supabase
          .from('cuentas')
          .insert({
            id: authData.user.id,
            nombre: formData.nombre,
            correo: formData.correo,
            nombre_empresa: formData.nombre_empresa,
            tipo_usuario: formData.tipo_usuario
          })

        if (dbError) {
          console.error('Error al insertar en cuentas:', dbError)
          // Si falla la inserción en cuentas, intentar eliminar el usuario de auth
          try {
            await supabase.auth.admin.deleteUser(authData.user.id)
          } catch (cleanupError) {
            console.error('Error al limpiar usuario:', cleanupError)
          }
          throw new Error('Error al guardar los datos del usuario en la base de datos')
        }

        setSuccess(true)
        // Limpiar formulario
        setFormData({
          nombre: '',
          correo: '',
          password: '',
          nombre_empresa: '',
          tipo_usuario: 'cliente'
        })
      } else {
        throw new Error('No se pudo crear el usuario correctamente')
      }
    } catch (error: any) {
      console.error('Error en registro:', error)
      setError({ 
        message: error.message || 'Error al crear la cuenta. Intenta de nuevo.' 
      })
      
      // Implementar cooldown para evitar spam
      if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
        setCooldown(30)
        const interval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError(null)
    setFormData({
      nombre: '',
      correo: '',
      password: '',
      nombre_empresa: '',
      tipo_usuario: 'cliente'
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isLoginMode ? '¡Sesión iniciada exitosamente!' : '¡Cuenta creada exitosamente!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isLoginMode 
              ? 'Has iniciado sesión correctamente. Redirigiendo...'
              : `Hemos enviado un correo de confirmación a ${formData.correo}. Por favor verifica tu cuenta para continuar.`
            }
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {isLoginMode ? 'Continuar' : 'Crear otra cuenta'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <a 
            href="/index.htm" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLoginMode ? 'Inicia sesión' : 'Crea tu cuenta'}
          </h1>
          <p className="text-gray-600">
            {isLoginMode 
              ? 'Accede a tu cuenta de Lynkargo'
              : 'Únete a Lynkargo y revoluciona tu logística'
            }
          </p>
        </div>

        {/* Toggle entre registro e inicio de sesión */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLoginMode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Registrarse
          </button>
          <button
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLoginMode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Iniciar sesión
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={isLoginMode ? handleLogin : handleSubmit} className="space-y-6">
          {/* Nombre - solo en modo registro */}
          {!isLoginMode && (
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    error?.field === 'nombre' ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre completo"
                />
              </div>
              {error?.field === 'nombre' && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
              )}
            </div>
          )}

          {/* Correo */}
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error?.field === 'correo' ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@empresa.com"
              />
            </div>
            {error?.field === 'correo' && (
              <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error?.field === 'password' ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error?.field === 'password' && (
              <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
          </div>

          {/* Tipo de usuario - solo en modo registro */}
          {!isLoginMode && (
            <div>
              <label htmlFor="tipo_usuario" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de cuenta
              </label>
              <select
                id="tipo_usuario"
                name="tipo_usuario"
                value={formData.tipo_usuario}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="cliente">Cliente - Necesito servicios logísticos</option>
                <option value="proveedor">Proveedor - Ofrezco servicios logísticos</option>
              </select>
            </div>
          )}

          {/* Nombre de empresa (solo para proveedores en modo registro) */}
          {!isLoginMode && formData.tipo_usuario === 'proveedor' && (
            <div>
              <label htmlFor="nombre_empresa" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la empresa
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="nombre_empresa"
                  name="nombre_empresa"
                  value={formData.nombre_empresa}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    error?.field === 'nombre_empresa' ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre de tu empresa"
                />
              </div>
              {error?.field === 'nombre_empresa' && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
              )}
            </div>
          )}

          {/* Error general */}
          {error && !error.field && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}

          {/* Cooldown message */}
          {cooldown > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-600">
                Demasiados intentos. Espera {cooldown} segundos antes de intentar de nuevo.
              </p>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                </div>
                {isLoginMode ? 'Iniciando sesión...' : 'Creando cuenta...'}
              </div>
            ) : (
              isLoginMode ? 'Iniciar sesión' : 'Crear cuenta'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {isLoginMode ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLoginMode ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
