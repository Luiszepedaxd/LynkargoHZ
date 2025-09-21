'use client'

import { useState, useEffect } from 'react'
import { UserContext, ContextSwitchOptions, PlatformRole } from '@/types'

interface UseContextReturn {
  currentContext: UserContext | null
  switchOptions: ContextSwitchOptions | null
  loading: boolean
  error: string | null
  switchContext: (role: PlatformRole, organizationId?: string) => Promise<void>
  refreshContext: () => Promise<void>
}

export function useContext(): UseContextReturn {
  const [currentContext, setCurrentContext] = useState<UserContext | null>(null)
  const [switchOptions, setSwitchOptions] = useState<ContextSwitchOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContext = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/context')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Error al obtener contexto')
      }

      setCurrentContext(data.data.currentContext)
      setSwitchOptions(data.data.switchOptions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching context:', err)
    } finally {
      setLoading(false)
    }
  }

  const switchContext = async (role: PlatformRole, organizationId?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activeRole: role,
          activeOrganizationId: organizationId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Error al cambiar contexto')
      }

      // Actualizar el contexto actual
      setCurrentContext(data.data)
      
      // Recargar opciones de cambio
      await fetchContext()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error switching context:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshContext = async () => {
    await fetchContext()
  }

  useEffect(() => {
    fetchContext()
  }, [])

  return {
    currentContext,
    switchOptions,
    loading,
    error,
    switchContext,
    refreshContext,
  }
}
