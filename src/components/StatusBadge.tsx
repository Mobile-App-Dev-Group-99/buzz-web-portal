import CategoryBadge from './CategoryBadge'

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const STATUS_CATEGORY: Record<string, 'positive' | 'warning' | 'negative' | 'info'> = {
  arrived: 'positive',
  late: 'warning',
  departed: 'info',
  absent: 'negative',
  present: 'positive',
  active: 'positive',
  'on exeat': 'info',
  on_exeat: 'info',
  overdue: 'negative',
  returned: 'positive',
  pending: 'warning',
  approved: 'positive',
  denied: 'negative',
  cancelled: 'info',
  unread: 'info',
  read: 'positive',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, '_')
  const category = STATUS_CATEGORY[key] || 'info'
  const showPulse = ['active', 'present', 'late', 'overdue', 'pending'].includes(key)

  return (
    <CategoryBadge category={category} label={status} showPulse={showPulse} />
  )
}
