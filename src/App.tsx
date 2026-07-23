import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AdminLayout from './components/AdminLayout'
import TeacherLayout from './components/TeacherLayout'
import ParentLayout from './components/ParentLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAttendance from './pages/admin/AdminAttendance'
import AdminStudents from './pages/admin/AdminStudents'
import AdminExeats from './pages/admin/AdminExeats'
import AdminResults from './pages/admin/AdminResults'
import AdminMessaging from './pages/admin/AdminMessaging'
import AdminStaff from './pages/admin/AdminStaff'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import ParentDashboard from './pages/parent/ParentDashboard'

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <div className="text-xs text-[#5F5E5A]">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}`} replace />

  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="exeats" element={<AdminExeats />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="messaging" element={<AdminMessaging />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/teacher" element={
        <ProtectedRoute allowedRole="teacher"><TeacherLayout /></ProtectedRoute>
      }>
        <Route index element={<TeacherDashboard />} />
      </Route>

      <Route path="/parent" element={
        <ProtectedRoute allowedRole="parent"><ParentLayout /></ProtectedRoute>
      }>
        <Route index element={<ParentDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
