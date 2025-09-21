'use client'

import { useState, useEffect } from 'react'
import { UserContext, ContextSwitchOptions, PlatformRole, Organization } from '@/types'
import Button from '@/components/ui/Button'

interface ContextSwitcherProps {
  currentContext: UserContext
  switchOptions: ContextSwitchOptions
  onContextChange: (role: PlatformRole, organizationId?: string) => Promise<void>
  loading?: boolean
}

export default function ContextSwitcher({
  currentContext,
  switchOptions,
  onContextChange,
  loading = false
}: ContextSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<PlatformRole>(currentContext.activeRole)
  const [selectedOrg, setSelectedOrg] = useState<string | undefined>(currentContext.activeOrganizationId)

  const handleRoleChange = (role: PlatformRole) => {
    setSelectedRole(role)
    // Reset organization when role changes to non-provider
    if (role !== 'PROVEEDOR') {
      setSelectedOrg(undefined)
    }
  }

  const handleOrganizationChange = (orgId: string | undefined) => {
    setSelectedOrg(orgId)
  }

  const handleSwitch = async () => {
    await onContextChange(selectedRole, selectedOrg)
    setIsOpen(false)
  }

  const getRoleLabel = (role: PlatformRole) => {
    switch (role) {
      case 'CLIENTE':
        return 'Cliente'
      case 'PROVEEDOR':
        return 'Proveedor'
      case 'ADMIN':
        return 'Administrador'
      default:
        return role
    }
  }

  const getRoleIcon = (role: PlatformRole) => {
    switch (role) {
      case 'CLIENTE':
        return '🛒'
      case 'PROVEEDOR':
        return '🚚'
      case 'ADMIN':
        return '⚙️'
      default:
        return '👤'
    }
  }

  const currentOrganization = switchOptions.availableOrganizations.find(
    org => org.id === currentContext.activeOrganizationId
  )

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className="flex items-center space-x-2"
        disabled={loading}
      >
        <span>{getRoleIcon(currentContext.activeRole)}</span>
        <div className="text-left">
          <div className="text-sm font-medium">
            {getRoleLabel(currentContext.activeRole)}
          </div>
          {currentOrganization && (
            <div className="text-xs text-gray-500">
              {currentOrganization.nombre}
            </div>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Cambiar Contexto</h3>
            
            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol de Plataforma
              </label>
              <div className="space-y-2">
                {switchOptions.availableRoles.map((role) => (
                  <label
                    key={role}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRole === role
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={() => handleRoleChange(role)}
                      className="sr-only"
                    />
                    <span className="text-lg">{getRoleIcon(role)}</span>
                    <div>
                      <div className="font-medium">{getRoleLabel(role)}</div>
                      <div className="text-sm text-gray-500">
                        {role === 'CLIENTE' && 'Solicitar servicios logísticos'}
                        {role === 'PROVEEDOR' && 'Ofrecer servicios logísticos'}
                        {role === 'ADMIN' && 'Administrar la plataforma'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Organization Selection (only for PROVEEDOR role) */}
            {selectedRole === 'PROVEEDOR' && switchOptions.availableOrganizations.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organización
                </label>
                <select
                  value={selectedOrg || ''}
                  onChange={(e) => handleOrganizationChange(e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar organización...</option>
                  {switchOptions.availableOrganizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSwitch}
                loading={loading}
                disabled={
                  selectedRole === currentContext.activeRole &&
                  selectedOrg === currentContext.activeOrganizationId
                }
              >
                Cambiar Contexto
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
