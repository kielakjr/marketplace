const Avatar = ({ username, size = 22 }: { username: string; size?: number }) => {
  const initials = username
    .split(/[\s_-]/)
    .map(w => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <div className="relative shrink-0">
      <div className={`w-${size} h-${size} rounded-2xl bg-linear-to-br from-brand-400 to-brand-800 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-600/30 ring-4 ring-white`}>
        {initials}
      </div>
    </div>
  )
}

export default Avatar
