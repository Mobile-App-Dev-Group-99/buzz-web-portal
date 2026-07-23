interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, string> = {
  arrived: 'bg-emerald-100 text-[#0F6E56]',
  late: 'bg-amber-100 text-[#854F0B]',
  departed: 'bg-sky-100 text-[#0C447C]',
  absent: 'bg-red-100 text-[#791F1F]',
  present: 'bg-emerald-100 text-[#0F6E56]',
  active: 'bg-emerald-100 text-[#0F6E56]',
  'on exeat': 'bg-sky-100 text-[#0C447C]',
  overdue: 'bg-amber-100 text-[#854F0B]',
  returned: 'bg-emerald-100 text-[#0F6E56]',
  pending: 'bg-amber-100 text-[#854F0B]',
  approved: 'bg-emerald-100 text-[#0F6E56]',
  unread: 'bg-gray-100 text-[#5F5E5A]',
  read: 'bg-emerald-100 text-[#0F6E56]',
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const key = status.toLowerCase()
  const cls = STATUS_STYLES[key] || 'bg-gray-100 text-[#5F5E5A]'
  const sizeCls = size === 'sm'
    ? 'text-[10px] px-2 py-0.5'
    : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex font-semibold rounded-md ${cls} ${sizeCls}`}>
      {status}
    </span>
  )
}
