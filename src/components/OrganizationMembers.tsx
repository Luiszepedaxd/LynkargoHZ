'use client'

import { useState } from 'react'
import { OrganizationMember, InviteMemberFormData, MemberRole } from '@/types'
import { inviteMemberSchema } from '@/lib/utils/validation.schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal from '@/components/ui/Modal'
import { InputField, SelectField } from '@/components/ui/FormField'
import Button from '@/components/ui/Button'

interface OrganizationMembersProps {
  organizationId: string
  members: OrganizationMember[]
  currentUserRole: MemberRole
  onInviteMember: (data: InviteMemberFormData) => Promise<void>
  onUpdateRole: (memberId: string, role: MemberRole) => Promise<void>
  onRemoveMember: (memberId: string) => Promise<void>
}

const roleOptions = [
  { value: 'OWNER', label: 'Propietario' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'MANAGER', label: 'Gerente' },
  { value: 'EMPLOYEE', label: 'Empleado' }
]

export default function OrganizationMembers({
  organizationId,
  members,
  currentUserRole,
  onInviteMember,
  onUpdateRole,
  onRemoveMember
}: OrganizationMembersProps) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canInvite = ['OWNER', 'ADMIN'].includes(currentUserRole)
  const canManageRoles = ['OWNER', 'ADMIN'].includes(currentUserRole)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema)
  })

  const onSubmitInvite = async (data: InviteMemberFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await onInviteMember({
        ...data,
        organizationId
      })
      reset()
      setShowInviteModal(false)
    } catch (err) {
      setError('Error al enviar invitación')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: MemberRole) => {
    setIsLoading(true)
    try {
      await onUpdateRole(memberId, newRole)
    } catch (err) {
      setError('Error al actualizar rol')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('¿Estás seguro de que quieres remover a este miembro?')) {
      return
    }

    setIsLoading(true)
    try {
      await onRemoveMember(memberId)
    } catch (err) {
      setError('Error al remover miembro')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Miembros del Equipo</h2>
        {canInvite && (
          <Button onClick={() => setShowInviteModal(true)}>
            Invitar Miembro
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miembro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Ingreso
                </th>
                {canManageRoles && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {member.user?.nombre.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.user?.nombre || 'Usuario'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.user?.email || 'Sin email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {canManageRoles && member.role !== 'OWNER' ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as MemberRole)}
                        className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                      >
                        {roleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {roleOptions.find(r => r.value === member.role)?.label || member.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.activo ? 'Activo' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  {canManageRoles && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {member.role !== 'OWNER' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          Remover
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invitar Miembro">
          <form onSubmit={handleSubmit(onSubmitInvite)} className="space-y-4">
            <InputField
              {...register('email')}
              type="email"
              id="email"
              label="Correo electrónico"
              placeholder="miembro@empresa.com"
              error={errors.email}
              required
            />

            <InputField
              {...register('nombre')}
              type="text"
              id="nombre"
              label="Nombre completo"
              placeholder="Nombre del miembro"
              error={errors.nombre}
              required
            />

            <SelectField
              {...register('role')}
              id="role"
              label="Rol"
              options={roleOptions.filter(r => r.value !== 'OWNER')}
              placeholder="Selecciona un rol..."
              error={errors.role}
              required
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowInviteModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isLoading}
              >
                Enviar Invitación
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
