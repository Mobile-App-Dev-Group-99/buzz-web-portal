export default function AdminReports() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Attendance Rate', val: '92.6%', sub: 'This term' },
          { label: 'Avg Arrival Time', val: '7:24 AM', sub: 'Before bell' },
          { label: 'Late Rate', val: '4.1%', sub: 'Down 1.2% from last term' },
          { label: 'Exeats This Term', val: '143', sub: '7 overdue incidents' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-[#D8D5CC] p-4">
            <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-[#1a1a18]">{s.val}</div>
            <div className="text-[11px] text-[#5F5E5A] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
        <div className="font-semibold text-xs mb-4">Generate Report</div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Report Type</label>
            <select className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white">
              <option>Daily Attendance</option><option>Weekly Summary</option><option>Termly Attendance</option><option>Exeat History</option>
            </select>
          </div>
          <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Class</label>
            <select className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white">
              <option>All Classes</option><option>JHS Only</option><option>SHS Only</option>
            </select>
          </div>
          <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Date From</label>
            <input type="date" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
          </div>
          <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Date To</label>
            <input type="date" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
          </div>
          <div className="col-span-2 flex gap-2">
            <button className="flex-1 bg-[#1D9E75] text-white text-xs font-semibold py-2 rounded-lg">Export PDF</button>
            <button className="flex-1 border border-[#D8D5CC] text-xs font-semibold py-2 rounded-lg bg-white">Export Excel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
