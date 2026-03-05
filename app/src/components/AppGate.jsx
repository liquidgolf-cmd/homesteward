import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Layout from './Layout'
import Landing from '@/pages/Landing'

export default function AppGate() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <p className="text-slate">Loading…</p>
      </div>
    )
  }

  if (!user) {
    if (location.pathname !== '/') {
      return <Navigate to="/login" state={{ from: location }} replace />
    }
    return <Landing />
  }

  return <Layout />
}

