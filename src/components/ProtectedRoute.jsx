import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roleRequired }) {
  const { user, profile } = useAuth()
  const role = profile?.role

  if (!user) return <Navigate to="/" replace />

  if (roleRequired && role !== roleRequired) return <Navigate to="/membre" replace />

  return children
}