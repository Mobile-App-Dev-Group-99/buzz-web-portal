import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://buzz-auth-service-xhno.onrender.com'
const ATTENDANCE_BASE = import.meta.env.VITE_ATTENDANCE_BASE || 'https://buzz-attendance-service-j18d.onrender.com'
const SAFETY_BASE = import.meta.env.VITE_SAFETY_BASE || 'https://buzz-safety-service-djmq.onrender.com'

export const authApi = axios.create({ baseURL: API_BASE, timeout: 30000 })
export const attendanceApi = axios.create({ baseURL: ATTENDANCE_BASE, timeout: 30000 })
export const safetyApi = axios.create({ baseURL: SAFETY_BASE, timeout: 30000 })

const apiInstances = [authApi, attendanceApi, safetyApi]

apiInstances.forEach(instance => {
  instance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
})

export async function login(email: string, password: string) {
  const res = await authApi.post('/login', { email, password })
  return res.data
}

export async function validateToken(token: string) {
  const res = await authApi.post('/validate', null, { params: { token } })
  return res.data
}

export async function forgotPassword(email: string) {
  const res = await authApi.post('/forgot-password', { email })
  return res.data
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await authApi.post('/admin/reset-password', { token, newPassword })
  return res.data
}

export async function getAdminDashboardStats(schoolId: number) {
  const res = await attendanceApi.get(`/api/admin/dashboard-stats/${schoolId}`)
  return res.data
}

export async function getAdminStudents(schoolId: number) {
  const res = await attendanceApi.get(`/api/admin/school/${schoolId}/students`)
  return res.data
}

export async function getAdminTeachers(schoolId: number) {
  const res = await attendanceApi.get(`/api/admin/school/${schoolId}/teachers`)
  return res.data
}

export async function createStudent(data: any) {
  const res = await attendanceApi.post('/api/admin/students', data)
  return res.data
}

export async function createTeacher(data: any) {
  const res = await attendanceApi.post('/api/admin/teachers', data)
  return res.data
}

export async function getAdminExeats(schoolId: number) {
  const res = await attendanceApi.get(`/api/admin/school/${schoolId}/exeats`)
  return res.data
}

export async function createExeat(data: any) {
  const res = await attendanceApi.post('/api/admin/exeats', data)
  return res.data
}

export async function approveExeat(exeatId: number) {
  const res = await attendanceApi.put(`/api/admin/exeats/${exeatId}/approve`)
  return res.data
}

export async function getAttendanceForClass(classLevel: string, className: string) {
  const res = await attendanceApi.get('/api/teacher/attendance', { params: { classLevel, className } })
  return res.data
}

export async function getTeacherExeats(teacherId: number) {
  const res = await attendanceApi.get(`/api/teacher/exeats/${teacherId}`)
  return res.data
}

export async function createTeacherExeat(data: any) {
  const res = await attendanceApi.post('/api/teacher/exeats', data)
  return res.data
}

export async function getParentNotifications(parentId: number) {
  const res = await safetyApi.get(`/api/notification/parent/${parentId}`)
  return res.data
}

export async function getParentChildren(parentId: number) {
  const res = await attendanceApi.get(`/api/parent/${parentId}/children`)
  return res.data
}

export async function markAttendance(data: any) {
  const res = await attendanceApi.post('/api/teacher/attendance/mark', data)
  return res.data
}
