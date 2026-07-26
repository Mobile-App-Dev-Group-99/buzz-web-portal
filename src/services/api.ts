import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://auth-service-bpwr.onrender.com'
const ATTENDANCE_BASE = import.meta.env.VITE_ATTENDANCE_BASE || 'https://attendance-service-40dn.onrender.com'
const SAFETY_BASE = import.meta.env.VITE_SAFETY_BASE || 'https://safety-service-djmq.onrender.com'

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
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )
})

export async function login(email: string, password: string) {
  const res = await authApi.post('/api/auth/login', { email, password })
  return res.data
}

export async function getMe() {
  const res = await authApi.get('/api/auth/me')
  return res.data
}

export async function validateToken() {
  const res = await authApi.get('/api/auth/validate')
  return res.data
}

export async function forgotPassword(email: string) {
  const res = await authApi.post('/api/auth/forgot-password', { email })
  return res.data
}

export async function resetPassword(email: string, newPassword: string) {
  const res = await authApi.post('/api/auth/admin/reset-password', { email, newPassword })
  return res.data
}

export async function getTodaySummary() {
  const res = await attendanceApi.get('/api/attendance/summary/today')
  return res.data
}

export async function getLiveFeed() {
  const res = await attendanceApi.get('/api/attendance/live')
  return res.data
}

export async function getClassesToday() {
  const res = await attendanceApi.get('/api/attendance/classes/today')
  return res.data
}

export async function getWeeklyRates() {
  const res = await attendanceApi.get('/api/attendance/weekly')
  return res.data
}

export async function getClassToday(className: string) {
  const res = await attendanceApi.get(`/api/attendance/class/${className}/today`)
  return res.data
}

export async function getAdminStudents() {
  const res = await attendanceApi.get('/api/admin/students')
  return res.data
}

export async function getAdminTeachers() {
  const res = await attendanceApi.get('/api/admin/teachers')
  return res.data
}

export async function getAdminParents() {
  const res = await attendanceApi.get('/api/admin/parents')
  return res.data
}

function getSchoolId(): number | undefined {
  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      const user = JSON.parse(raw)
      return user.schoolId || user.school?.id
    }
  } catch {}
  return undefined
}

export async function createStudent(data: {
  firstName: string; lastName: string; className: string;
  email: string; password: string;
}) {
  const res = await authApi.post('/api/auth/register', { ...data, role: 'STUDENT', schoolId: getSchoolId() })
  return res.data
}

export async function updateStudent(id: number, data: { firstName: string; lastName: string; className: string }) {
  const res = await attendanceApi.put(`/api/admin/student/${id}`, data)
  return res.data
}

export async function deleteStudent(id: number) {
  const res = await attendanceApi.delete(`/api/admin/student/${id}`)
  return res.data
}

export async function deleteTeacher(id: number) {
  const res = await attendanceApi.delete(`/api/admin/teacher/${id}`)
  return res.data
}

export async function createExeat(data: { studentId: number; reason: string; expectedReturn?: string }) {
  const res = await safetyApi.post('/api/exeat/create', data)
  return res.data
}

export async function updateExeatStatus(id: number, status: string) {
  const res = await safetyApi.put(`/api/exeat/${id}/status`, { status })
  return res.data
}

export async function createParent(data: {
  firstName: string; lastName: string; phone?: string;
  email: string; password: string; studentIds?: number[];
}) {
  const res = await attendanceApi.post('/api/admin/parent', data)
  return res.data
}

export async function linkStudentParent(studentId: number, parentId: number) {
  const res = await attendanceApi.post('/api/admin/link', { studentId, parentId })
  return res.data
}

export async function getTeacherClass() {
  const res = await attendanceApi.get('/api/teacher/me/class')
  return res.data
}

export async function getTeacherExeats() {
  const res = await attendanceApi.get('/api/teacher/exeats')
  return res.data
}

export async function createTeacherExeat(data: {
  studentId: number; reason: string; expectedReturn?: string;
}) {
  const res = await attendanceApi.post('/api/teacher/exeat/create', data)
  return res.data
}

export async function approveExeat(exeatId: number) {
  const res = await attendanceApi.put(`/api/teacher/exeat/${exeatId}/approve`)
  return res.data
}

export async function denyExeat(exeatId: number) {
  const res = await attendanceApi.put(`/api/teacher/exeat/${exeatId}/deny`)
  return res.data
}

export async function getSchoolExeats() {
  const res = await safetyApi.get('/api/exeat/school')
  return res.data
}

export async function getParentNotifications(parentId: number) {
  const res = await safetyApi.get(`/api/notification/parent/${parentId}`)
  return res.data
}

export async function markManualAttendance(data: {
  studentId: number; status: string; note?: string;
}) {
  const res = await attendanceApi.post('/api/attendance/manual', data)
  return res.data
}

export async function getParentChildren() {
  const res = await attendanceApi.get('/api/parent/me/children')
  return res.data
}

export async function getStudentAttendance(studentId: number) {
  const res = await attendanceApi.get(`/api/attendance/student/${studentId}`)
  return res.data
}

export async function getStudentsByClass(className: string) {
  const res = await attendanceApi.get(`/api/admin/students/class/${className}`)
  return res.data
}

export async function getStudentExeats(studentId: number) {
  const res = await safetyApi.get(`/api/exeat/student/${studentId}`)
  return res.data
}
