export type Role = 'admin' | 'teacher' | 'student' | 'parent'

export interface User {
  id: number
  email: string
  role: Role
  firstName: string
  lastName: string
  schoolId?: number
}

export interface School {
  id: number
  name: string
  address: string
  phone: string
}

export interface Student {
  id: number
  userId: number
  firstName: string
  lastName: string
  studentIndex: string
  classLevel: string
  className: string
  schoolId: number
  biometricEnrolled: boolean
}

export interface Teacher {
  id: number
  userId: number
  firstName: string
  lastName: string
  schoolId: number
  assignedClass?: string
}

export interface Parent {
  id: number
  userId: number
  firstName: string
  lastName: string
  children: Student[]
}

export interface AttendanceRecord {
  id: number
  studentId: number
  studentName: string
  classLevel: string
  className: string
  event: 'ARRIVAL' | 'DEPARTURE'
  timestamp: string
  gateNumber: string
  status: 'present' | 'late' | 'absent'
  parentNotified: boolean
}

export interface Exeat {
  id: number
  studentId: number
  studentName: string
  className: string
  reason: string
  departureDate: string
  expectedReturn: string
  actualReturn?: string
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'RETURNED' | 'OVERDUE'
  parentNotified: boolean
}

export interface Notification {
  id: number
  title: string
  message: string
  type: 'arrival' | 'late' | 'absent' | 'exeat' | 'alert'
  sentAt: string
  isRead: boolean
}

export interface DashboardStats {
  presentToday: number
  lateArrivals: number
  absent: number
  onExeat: number
  totalStudents: number
  attendanceRate: number
}

export interface ClassAttendance {
  className: string
  present: number
  total: number
  percentage: number
}
