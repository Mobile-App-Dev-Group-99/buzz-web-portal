export default function AdminMessaging() {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className="bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">New Announcement</button>
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <div className="px-4 py-2 border-b border-[#D8D5CC]">
          <span className="font-semibold text-xs">Inbox</span>
        </div>
        <div className="px-4 py-16 text-center">
          <div className="text-3xl mb-3 text-[#D8D5CC]">✉</div>
          <div className="text-sm font-semibold text-[#1a1a18] mb-1">No Messages</div>
          <div className="text-xs text-[#5F5E5A] max-w-sm mx-auto leading-relaxed">
            Parent-teacher messaging will be available here once the messaging module is integrated.
            Announcements can be sent to all parents from this panel.
          </div>
        </div>
      </div>
    </div>
  )
}
