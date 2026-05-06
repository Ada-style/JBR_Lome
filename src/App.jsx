import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Nouveau from './pages/Nouveau'
import Membre from './pages/Membre'
import Admin from './pages/Admin'
import Onboarding from './pages/Onboarding'
import ResetPassword from './pages/ResetPassword'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AppContent() {
  const navigate = useNavigate()

  useEffect(() => {
    // Vérifier si l'onboarding a été fait
    const onboardingDone = localStorage.getItem('onboarding_v2_done')
    if (!onboardingDone && window.location.pathname === '/') {
      navigate('/onboarding')
    }
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/nouveau" element={<Nouveau />} />
      <Route path="/membre" element={
        <ProtectedRoute>
          <Membre />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute roleRequired="bureau">
          <Admin />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}
