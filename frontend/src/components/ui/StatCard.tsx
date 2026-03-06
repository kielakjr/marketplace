const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3">
    <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 text-brand-500">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-brand-500 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-brand-900">{value}</p>
    </div>
  </div>
)

export default StatCard
