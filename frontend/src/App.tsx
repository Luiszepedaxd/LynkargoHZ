import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import RegistroPage from './components/RegistroPage'
import { SupabaseProvider } from './contexts/SupabaseContext'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <SupabaseProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registro" element={<RegistroPage />} />
        </Routes>
      </SupabaseProvider>
    </ErrorBoundary>
  )
}

export default App
