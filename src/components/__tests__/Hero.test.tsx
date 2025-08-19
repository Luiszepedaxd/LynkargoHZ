import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from '../Hero'

// Mock del hook useAuth
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }),
}))

// Mock de fetch para la API
global.fetch = jest.fn()

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders hero section with title and subtitle', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Conectando la Logística del Futuro/i)).toBeInTheDocument()
    expect(screen.getByText(/La primera plataforma B2B/i)).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Comenzar Ahora/i)).toBeInTheDocument()
    expect(screen.getByText(/Ver Demo/i)).toBeInTheDocument()
  })

  it('renders newsletter form', () => {
    render(<Hero />)
    
    expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument()
    expect(screen.getByText(/Suscribirse/i)).toBeInTheDocument()
  })

  it('renders statistics section', () => {
    render(<Hero />)
    
    expect(screen.getByText(/500\+/i)).toBeInTheDocument()
    expect(screen.getByText(/Empresas/i)).toBeInTheDocument()
    expect(screen.getByText(/1000\+/i)).toBeInTheDocument()
    expect(screen.getByText(/Envíos/i)).toBeInTheDocument()
    expect(screen.getByText(/50\+/i)).toBeInTheDocument()
    expect(screen.getByText(/Ciudades/i)).toBeInTheDocument()
  })

  it('handles newsletter form submission successfully', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Suscripción exitosa' }),
    } as Response)

    render(<Hero />)
    
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i)
    const submitButton = screen.getByText(/Suscribirse/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    })
  })

  it('handles newsletter form submission error', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, message: 'Error en la suscripción' }),
    } as Response)

    render(<Hero />)
    
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i)
    const submitButton = screen.getByText(/Suscribirse/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('validates email format', async () => {
    render(<Hero />)
    
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i)
    const submitButton = screen.getByText(/Suscribirse/i)
    
    // Email inválido
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    // No debería hacer fetch con email inválido
    expect(fetch).not.toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<Hero />)
    
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i)
    const submitButton = screen.getByText(/Suscribirse/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    // Debería mostrar estado de loading
    expect(screen.getByText(/Suscribiendo/i)).toBeInTheDocument()
  })

  it('resets form after successful submission', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Suscripción exitosa' }),
    } as Response)

    render(<Hero />)
    
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i)
    const submitButton = screen.getByText(/Suscribirse/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(emailInput).toHaveValue('')
    })
  })
})
