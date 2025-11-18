import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TrackDetailPage from './pages/TrackDetailPage';
import AssignmentsPage from './pages/AssignmentsPage';
import MentorDashboardPage from './pages/MentorDashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';

function Shell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">
          <Link to="/">
            Edu<span>Tech</span>
          </Link>
        </div>
        <nav className="app-nav">
          {user && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.role === 'mentor' && <Link to="/mentor">Mentor</Link>}
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button className="button secondary" onClick={logout} style={{ marginLeft: '1rem' }}>
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tracks/:trackId"
            element={
              <ProtectedRoute>
                <TrackDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assignments/:moduleId"
            element={
              <ProtectedRoute>
                <AssignmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor"
            element={
              <ProtectedRoute roles={['mentor']}>
                <MentorDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPanelPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Shell>
    </AuthProvider>
  );
}

export default App;
