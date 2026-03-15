import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from '../Hero'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }),
}))

global.fetch = jest.fn()

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders hero section with title and subtitle', () => {
    render(<Hero />)
    expect(screen.getByText(/Intermediación logística integral/i)).toBeInTheDocument()
    expect(screen.getByText(/Tu socio estratégico en soluciones 3PL/i)).toBeInTheDocument()
    expect(screen.getByText(/Conectamos tu empresa con las mejores soluciones de almacenaje, transporte y logística en México/i)).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    render(<Hero />)
    expect(screen.getByText(/Solicitar Cotización/i)).toBeInTheDocument()
    expect(screen.getByText(/Conocer Más/i)).toBeInTheDocument()
  })

  it('opens contact modal when clicking Solicitar Cotización', () => {
    render(<Hero />)
    const contactModal = document.getElementById('contact-modal')
    expect(contactModal?.classList.contains('hidden')).toBe(true)
    fireEvent.click(screen.getByText(/Solicitar Cotización/i))
    expect(contactModal?.classList.contains('hidden')).toBe(false)
  })

  it('renders contact form in modal', () => {
    render(<Hero />)
    fireEvent.click(screen.getByText(/Solicitar Cotización/i))
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Empresa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email corporativo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument()
    expect(screen.getByText(/Enviar Solicitud/i)).toBeInTheDocument()
  })

  it('renders statistics section', () => {
    render(<Hero />)
    expect(screen.getByText(/\+25/)).toBeInTheDocument()
    expect(screen.getByText(/Años de Experiencia Combinada/i)).toBeInTheDocument()
    expect(screen.getByText(/\+50/)).toBeInTheDocument()
    expect(screen.getByText(/Proveedores Certificados en Red/i)).toBeInTheDocument()
    expect(screen.getByText(/15\+/)).toBeInTheDocument()
    expect(screen.getByText(/Estados de Cobertura/i)).toBeInTheDocument()
    expect(screen.getByText(/99\.5%/)).toBeInTheDocument()
    expect(screen.getByText(/Tasa de Satisfacción/i)).toBeInTheDocument()
  })

  it('handles contact form submission successfully', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Gracias por tu solicitud.' }),
    } as Response)

    render(<Hero />)
    fireEvent.click(screen.getByText(/Solicitar Cotización/i))
    fireEvent.change(screen.getByPlaceholderText(/Tu nombre/), { target: { value: 'Juan Pérez' } })
    fireEvent.change(screen.getByPlaceholderText(/correo@empresa\.com/), { target: { value: 'juan@empresa.com' } })
    fireEvent.click(screen.getByText(/Enviar Solicitud/i))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      })
    })
  })

  it('validates required fields and does not submit when invalid', async () => {
    render(<Hero />)
    fireEvent.click(screen.getByText(/Solicitar Cotización/i))
    fireEvent.click(screen.getByText(/Enviar Solicitud/i))
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled()
    })
  })
})
