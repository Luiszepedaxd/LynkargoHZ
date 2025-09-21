'use client'

import { useState, useEffect } from 'react'
import { UserPermissions } from '@/types'

interface UsePermissionsReturn {
  permissions: UserPermissions | null
  loading: boolean
  error: string | null
  hasPermission: (permission: keyof UserPermissions) => boolean
  canPerformAction: (permission: keyof UserPermissions) => boolean
  refreshPermissions: () => Promise<void>
}

export function usePermissions(organizationId?: string): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL('/api/permissions', window.location.origin)
      if (organizationId) {
        url.searchParams.set('organizationId', organizationId)
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Error al obtener permisos')
      }

      setPermissions(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching permissions:', err)
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!permissions) return false
    return permissions[permission] === true
  }

  const canPerformAction = (permission: keyof UserPermissions): boolean => {
    return hasPermission(permission)
  }

  const refreshPermissions = async () => {
    await fetchPermissions()
  }

  useEffect(() => {
    fetchPermissions()
  }, [organizationId, fetchPermissions])

  return {
    permissions,
    loading,
    error,
    hasPermission,
    canPerformAction,
    refreshPermissions,
  }
}
