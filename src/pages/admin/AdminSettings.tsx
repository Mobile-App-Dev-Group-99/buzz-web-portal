export default function AdminSettings() {
  return (
    <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
      <div className="font-semibold text-xs mb-4">School Configuration</div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'School Name', val: 'Prempeh Academy' },
          { label: 'School Type', val: 'JHS & SHS (Boarding)' },
          { label: 'Late Arrival Threshold', val: '7:30 AM' },
          { label: 'Absence Alert Time', val: '9:00 AM' },
          { label: 'Academic Alert Threshold', val: 'Below 50%' },
          { label: 'SMS Fallback', val: 'Enabled' },
        ].map(f => (
          <div key={f.label}>
            <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">{f.label}</label>
            <input defaultValue={f.val} className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1D9E75] bg-white" />
          </div>
        ))}
        <div className="col-span-2">
          <button className="bg-[#1D9E75] text-white text-xs font-semibold px-4 py-2 rounded-lg">Save Settings</button>
        </div>
      </div>
    </div>
  )
}
