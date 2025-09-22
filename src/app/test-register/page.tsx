'use client'

import { useState } from 'react'

export default function TestRegister() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testRegistration = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('=== INICIANDO TEST DE REGISTRO ===')
      
      const testData = {
        nombre: 'Test User',
        email: `test${Date.now()}@test.com`,
        password: 'test123456',
        telefono: '1234567890',
        initialRole: 'CLIENTE'
      }
      
      console.log('Datos de prueba:', testData)
      
      const response = await fetch('/api/register-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      const data = await response.json()
      console.log('Response data:', data)
      
      setResult(JSON.stringify(data, null, 2))
      
    } catch (error) {
      console.error('Error en test:', error)
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test de Registro Directo</h1>
      
      <button 
        onClick={testRegistration}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Probando...' : 'Probar Registro'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Resultado:</h3>
        <pre style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '5px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {result || 'Haz clic en &quot;Probar Registro&quot; para ver el resultado'}
        </pre>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Instrucciones:</strong></p>
        <ol>
          <li>Abre las Developer Tools (F12) y ve a la pestaña Console</li>
          <li>Haz clic en &quot;Probar Registro&quot;</li>
          <li>Observa los logs detallados en la consola</li>
          <li>Ve el resultado aquí abajo</li>
        </ol>
      </div>
    </div>
  )
}
