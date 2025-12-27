import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/Layout/Navbar';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import UnauthorizedPage from './pages/Auth/UnauthorizedPage';
import SessionExpiredPage from './pages/Auth/SessionExpiredPage';

// Common Pages
import Dashboard from './pages/Common/Dashboard';

// Equipment Pages
import EquipmentList from './pages/Equipment/EquipmentList';

// Request Pages
import KanbanBoard from './pages/Requests/KanbanBoard';

// Admin Pages
import AdminPage from './pages/Admin/AdminPage';

// Calendar Pages
import CalendarViewPage from './pages/Calendar/CalendarViewPage';

// Team Pages
import TeamListPage from './pages/Teams/TeamListPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/session-expired" element={<SessionExpiredPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />

                      {/* Equipment Routes */}
                      <Route path="/equipment" element={<EquipmentList />} />

                      {/* Request Routes */}
                      <Route path="/requests" element={<KanbanBoard />} />

                      {/* Calendar Routes */}
                      <Route path="/calendar" element={<CalendarViewPage />} />

                      {/* Team Routes */}
                      <Route path="/teams" element={<TeamListPage />} />

                      {/* Admin Routes */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute roles={['admin']}>
                            <AdminPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Default redirect */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="*" element={<div>404 - Page Not Found</div>} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
