import {BrowserRouter, Routes, Route } from 'react-router-dom'
import {AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Nouveau from './pages/Nouveau'
import Visiteur from './pages/Visiteur'
import Membre from './pages/Membre'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/nouveau" element={<Nouveau />} />
          <Route path="/visiteur" element={<Visiteur />} />
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
      </BrowserRouter>
    </AuthProvider>
  )
}