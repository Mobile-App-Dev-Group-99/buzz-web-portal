const MOCK_RESULTS = [
  { name: 'Kofi Mensah', scores: [78, 82, 91, 74], avg: '81.3%', pos: '#2', viewed: true },
  { name: 'Ama Boateng', scores: [65, 71, 58, 69], avg: '65.8%', pos: '#8', viewed: false },
  { name: 'Ekow Osei', scores: [88, 76, 84, 90], avg: '84.5%', pos: '#1', viewed: true },
]

export default function AdminResults() {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white"><option>2025/2026 Term 2</option></select>
        <select className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white"><option>All Classes</option><option>SHS 2B</option></select>
        <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">Lock & Deliver Results</button>
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#D8D5CC] flex justify-between">
          <span className="font-semibold text-xs">Grade Submissions — SHS 2B · Term 2</span>
          <span className="text-[11px] text-[#5F5E5A]">4 of 6 subjects submitted</span>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'Math', 'English', 'Science', 'History', 'Average', 'Position', 'Parent Viewed'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_RESULTS.map(s => (
              <tr key={s.name} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5 font-medium text-xs">{s.name}</td>
                {s.scores.map((sc, i) => <td key={i} className="px-4 py-2.5 text-[11px] font-mono text-[#5F5E5A]">{sc}</td>)}
                <td className="px-4 py-2.5 text-xs font-bold text-[#0F6E56]">{s.avg}</td>
                <td className="px-4 py-2.5 text-xs font-bold text-[#5F5E5A]">{s.pos}</td>
                <td className="px-4 py-2.5 text-xs">{s.viewed ? <span className="text-[#0F6E56]">✓</span> : <span className="text-[#5F5E5A]">✗</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
