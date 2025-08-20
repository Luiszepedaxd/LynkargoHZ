'use client'

import { useState, useEffect } from 'react'

interface TestingToolsProps {
  isDevelopment?: boolean
}

export default function TestingTools({ isDevelopment = process.env.NODE_ENV === 'development' }: TestingToolsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [performance, setPerformance] = useState<{
    dns: number;
    tcp: number;
    ttfb: number;
    domLoad: number;
    windowLoad: number;
    total: number;
  } | null>(null)
  const [errors, setErrors] = useState<Array<{
    message: string;
    filename: string;
    lineno: number;
    colno: number;
    error: Error;
    timestamp: string;
  }>>([])

  useEffect(() => {
    if (!isDevelopment) return

    // Capturar errores de JavaScript
    const handleError = (event: ErrorEvent) => {
      const error = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString()
      }
      setErrors(prev => [...prev, error])
      addLog(`❌ Error: ${event.message}`, 'error')
    }

    // Capturar errores de recursos
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLImageElement | HTMLScriptElement
      addLog(`❌ Resource Error: ${target.src || target.href}`, 'error')
    }

    // Capturar logs de consola
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args) => {
      originalLog.apply(console, args)
      addLog(`📝 ${args.join(' ')}`, 'log')
    }

    console.error = (...args) => {
      originalError.apply(console, args)
      addLog(`❌ ${args.join(' ')}`, 'error')
    }

    console.warn = (...args) => {
      originalWarn.apply(console, args)
      addLog(`⚠️ ${args.join(' ')}`, 'warn')
    }

    // Capturar performance
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            setPerformance({
              dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              tcp: navEntry.connectEnd - navEntry.connectStart,
              ttfb: navEntry.responseStart - navEntry.requestStart,
              domLoad: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              windowLoad: navEntry.loadEventEnd - navEntry.loadEventStart,
              total: navEntry.loadEventEnd - navEntry.fetchStart
            })
          }
        }
      })
      observer.observe({ entryTypes: ['navigation'] })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('error', handleResourceError, true)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('error', handleResourceError, true)
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [isDevelopment])

  const addLog = (message: string, type: 'log' | 'error' | 'warn') => {
    setLogs(prev => [...prev.slice(-99), `${new Date().toLocaleTimeString()} ${message}`])
  }

  const clearLogs = () => setLogs([])
  const clearErrors = () => setErrors([])

  const testAPI = async (endpoint: string) => {
    try {
      const start = performance.now()
      const response = await fetch(endpoint)
      const end = performance.now()
      const duration = Math.round(end - start)
      
      if (response.ok) {
        addLog(`✅ ${endpoint} - ${response.status} (${duration}ms)`, 'log')
      } else {
        addLog(`❌ ${endpoint} - ${response.status} (${duration}ms)`, 'error')
      }
    } catch {
      addLog(`❌ ${endpoint} - Error de conexión`, 'error')
    }
  }

  const runAllTests = async () => {
    addLog('🧪 Iniciando tests automáticos...', 'log')
    
    const endpoints = [
      '/api/newsletter',
      '/api/users?limit=1',
      '/api/providers?limit=1',
      '/api/orders?limit=1',
      '/api/search?query=test&limit=1'
    ]

    for (const endpoint of endpoints) {
      await testAPI(endpoint)
      await new Promise(resolve => setTimeout(resolve, 100)) // Delay entre tests
    }
    
    addLog('🎯 Tests completados', 'log')
  }

  const exportLogs = () => {
    const data = {
      timestamp: new Date().toISOString(),
      logs,
      errors,
      performance,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lynkargo-debug-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isDevelopment) return null

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Herramientas de Testing"
      >
        🧪
      </button>

      {/* Panel de herramientas */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Testing Tools</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
            {/* Controles */}
            <div className="space-y-2">
              <button
                onClick={runAllTests}
                className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
              >
                🚀 Ejecutar Tests
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clearLogs}
                  className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
                >
                  Limpiar Logs
                </button>
                <button
                  onClick={exportLogs}
                  className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  Exportar
                </button>
              </div>
            </div>

            {/* Performance */}
            {performance && (
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Performance (ms)</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>DNS: {performance.dns}</div>
                  <div>TCP: {performance.tcp}</div>
                  <div>TTFB: {performance.ttfb}</div>
                  <div>DOM: {performance.domLoad}</div>
                  <div>Load: {performance.windowLoad}</div>
                  <div>Total: {performance.total}</div>
                </div>
              </div>
            )}

            {/* Errores */}
            {errors.length > 0 && (
              <div className="bg-red-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2 text-red-800">
                  Errores ({errors.length})
                </h4>
                <button
                  onClick={clearErrors}
                  className="text-xs text-red-600 hover:text-red-800 mb-2"
                >
                  Limpiar
                </button>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {errors.slice(-5).map((error, index) => (
                    <div key={index} className="text-xs text-red-700">
                      {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logs */}
            <div>
              <h4 className="font-medium text-sm mb-2">Logs ({logs.length})</h4>
              <div className="bg-gray-900 text-green-400 p-2 rounded text-xs max-h-32 overflow-y-auto font-mono">
                {logs.slice(-20).map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
