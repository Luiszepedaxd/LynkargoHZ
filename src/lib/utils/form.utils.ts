import { useState } from 'react'

export interface FormState {
  isLoading: boolean
  error: string
}

export function useFormState() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const setLoading = (loading: boolean) => setIsLoading(loading)
  const setErrorMsg = (errorMsg: string) => setError(errorMsg)
  const clearError = () => setError('')

  const handleSubmit = async <T>(
    submitFn: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: Error) => void
  ): Promise<void> => {
    try {
      setIsLoading(true)
      clearError()
      const result = await submitFn()
      onSuccess?.(result)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error inesperado'
      setError(errorMsg)
      onError?.(err instanceof Error ? err : new Error(errorMsg))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    setLoading,
    setErrorMsg,
    clearError,
    handleSubmit
  }
}
