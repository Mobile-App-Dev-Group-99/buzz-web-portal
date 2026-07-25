export default function AdminResults() {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white"><option>2025/2026 Term 2</option></select>
        <select className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white"><option>All Classes</option></select>
      </div>

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#D8D5CC]">
          <span className="font-semibold text-xs">Grade Submissions</span>
        </div>
        <div className="px-4 py-16 text-center">
          <div className="text-3xl mb-3 text-[#D8D5CC]">#</div>
          <div className="text-sm font-semibold text-[#1a1a18] mb-1">No Results Data</div>
          <div className="text-xs text-[#5F5E5A] max-w-sm mx-auto leading-relaxed">
            Results will appear here once teachers submit grades through the mobile app.
            The results module is pending backend integration.
          </div>
        </div>
      </div>
    </div>
  )
}
