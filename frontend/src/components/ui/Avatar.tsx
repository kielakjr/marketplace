import { cn } from '@/utils/cn'

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-22 h-22',
}

const Avatar = ({ username, size }: { username: string; size: keyof typeof sizeMap }) => {
  const initials = username
    .split(/[\s_-]/)
    .map(w => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <div className="relative shrink-0">
      <div className={cn('rounded-2xl bg-linear-to-br from-brand-400 to-brand-800 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-600/30 ring-4 ring-white', sizeMap[size])}>
        {initials}
      </div>
    </div>
  )
}

export default Avatar
