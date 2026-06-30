import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/hooks/useAuth'
import '../styles/dashboard.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-brand">🔐 BeyondDev</div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </nav>

      <div className="dashboard-container">
        <div className="welcome-card">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Email: {user?.email}</p>
          <p>Status: {user?.verified ? '✓ Verified' : '⏳ Pending verification'}</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Profile</h3>
            <p>Manage your account settings</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Face ID</h3>
            <p>Register or manage your biometric authentication</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Messages</h3>
            <p>Check your notifications and emails</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure your preferences</p>
          </div>
        </div>
      </div>
    </div>
  )
}
