'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/utils/validation.schemas'
import Modal from '@/components/ui/Modal'
import { InputField } from '@/components/ui/FormField'
import Button from '@/components/ui/Button'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (data: LoginFormData) => Promise<void>
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError('')
      await onLogin(data)
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Sesión">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          {...register('email')}
          type="email"
          id="email"
          label="Correo electrónico"
          placeholder="tu@empresa.com"
          error={errors.email}
          required
        />

        <InputField
          {...register('password')}
          type="password"
          id="password"
          label="Contraseña"
          placeholder="••••••••"
          error={errors.password}
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          Iniciar Sesión
        </Button>
      </form>
    </Modal>
  )
}
