'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import Notification from './Notification'

export default function Header() {
  const { currentUser, logout, isAuthenticated, login, register } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Lyn<span className="text-orange-500">k</span>argo
          </Link>

          {/* Navegación */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#inicio" className="text-gray-600 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <Link href="#que-es" className="text-gray-600 hover:text-blue-600 transition-colors">
              Qué es
            </Link>
            <Link href="#caracteristicas" className="text-gray-600 hover:text-blue-600 transition-colors">
              Características
            </Link>
            <Link href="#contacto" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contacto
            </Link>
          </div>

          {/* Botones de autenticación */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
                <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                  {currentUser?.user_metadata?.nombre || 'Usuario'}
                </span>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Crea tu cuenta
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Modales */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={async (data) => {
          try {
            await login(data.email, data.password)
            setIsLoginModalOpen(false)
          } catch (error) {
            throw error
          }
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={async (data) => {
          try {
            console.log('Enviando datos de registro via API directa:', data)
            
            const response = await fetch('/api/register-direct', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
            
            const result = await response.json()
            console.log('Respuesta del servidor:', result)
            
            if (result.success) {
              setNotification({ 
                message: result.message || 'Registro exitoso. Revisa tu email para confirmar tu cuenta.', 
                type: 'success' 
              })
            } else {
              throw new Error(result.message || 'Error en el registro')
            }
          } catch (error) {
            console.error('Error en registro:', error)
            setNotification({ 
              message: error instanceof Error ? error.message : 'Error al crear la cuenta', 
              type: 'error' 
            })
          }
          setIsRegisterModalOpen(false)
        }}
      />

      {/* Notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </header>
  )
}
