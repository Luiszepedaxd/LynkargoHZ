'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/utils/validation.schemas'
import { useFormState } from '@/lib/utils/form.utils'
import Modal from '@/components/ui/Modal'
import { InputField, SelectField } from '@/components/ui/FormField'
import Button from '@/components/ui/Button'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onRegister: (data: RegisterFormData) => Promise<void>
}

const organizationTypeOptions = [
  { value: 'CLIENTE', label: 'Cliente' },
  { value: 'PROVEEDOR', label: 'Proveedor' },
  { value: 'MIXTO', label: 'Cliente y Proveedor' }
]

export default function RegisterModal({ isOpen, onClose, onRegister }: RegisterModalProps) {
  const { isLoading, error, handleSubmit } = useFormState()

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    await handleSubmit(
      () => onRegister(data),
      () => {
        reset()
        onClose()
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Cuenta">
      <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            {...register('nombre')}
            type="text"
            id="nombre"
            label="Nombre completo"
            placeholder="Tu nombre completo"
            error={errors.nombre}
            required
          />

          <InputField
            {...register('organizationName')}
            type="text"
            id="organizationName"
            label="Nombre de la empresa"
            placeholder="Nombre de tu empresa"
            error={errors.organizationName}
            required
          />
        </div>

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

        <SelectField
          {...register('organizationType')}
          id="organizationType"
          label="Tipo de organización"
          options={organizationTypeOptions}
          placeholder="Selecciona el tipo de organización..."
          error={errors.organizationType}
          required
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-600">
            Al crear tu cuenta, también crearás una organización que podrás gestionar junto con tu equipo.
          </p>
        </div>

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
          Crear Cuenta
        </Button>
      </form>
    </Modal>
  )
}
