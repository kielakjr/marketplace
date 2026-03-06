import { useUser } from '@/hooks/useUsers'
import ProductCard from '@/components/ProductCard'
import Avatar from '@/components/ui/Avatar'
import StatCard from '@/components/ui/StatCard'
import { howLong } from '@/utils/date'

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-brand-200/60 rounded-xl ${className}`} />
)

const Profile = ({ userId }: { userId: string }) => {
  const { data: userData, isLoading, isError } = useUser(userId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 p-6 flex items-start justify-center">
        <div className="w-full max-w-4xl space-y-4 pt-10">
          <Skeleton className="h-36 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !userData) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-brand-800 font-semibold text-base">Nie udało się załadować profilu.</p>
          <p className="text-brand-500 text-sm">Spróbuj ponownie później.</p>
        </div>
      </div>
    )
  }

  const products = userData.products ?? []
  const joinDate = new Date(userData.createdAt).toLocaleDateString('pl-PL', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-5 pt-8 pb-16">

        <div className="h-20 rounded-t-2xl bg-linear-to-r from-brand-900 via-brand-700 to-brand-500 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
          />
          <div className="absolute top-3 right-6 flex gap-1.5">
            <div className="w-7 h-7 rounded-full bg-brand-300 opacity-15" />
            <div className="w-7 h-7 rounded-full bg-brand-300 opacity-20" />
            <div className="w-7 h-7 rounded-full bg-brand-300 opacity-30" />
          </div>
        </div>

        <div className="bg-white rounded-b-2xl border border-brand-100 border-t-0 shadow-sm mb-3">
          <div className="px-7 pb-6">

            <div className="flex items-end flex-wrap gap-4 -mt-7">
              <Avatar username={userData.username} />

              <div className="pb-1 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-brand-900 leading-tight mb-1.5">
                  {userData.username}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1.5 text-xs text-brand-600">
                    <svg className="w-3.5 h-3.5 shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {userData.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-brand-600">
                    <svg className="w-3.5 h-3.5 shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Członek od {joinDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-brand-100 to-transparent my-5" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <StatCard
                label="Produkty"
                value={String(products.length)}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
              />
              <StatCard
                label="Ocena"
                value="4.9 / 5.0"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                }
              />
              <StatCard
                label="Na platformie"
                value={howLong(new Date(userData.createdAt))}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

          </div>
        </div>

        {products.length > 0 ? (
          <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <h2 className="text-brand-900 font-bold text-lg tracking-tight">Produkty</h2>
                <span className="text-xs font-semibold bg-brand-50 text-brand-500 px-2.5 py-1 rounded-full border border-brand-100">
                  {products.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-14 text-center">
            <div className="w-13 h-13 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-3.5">
              <svg className="w-6 h-6 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-brand-800 font-semibold text-base">Brak produktów</p>
            <p className="text-brand-500 text-sm mt-1">Dodaj swój pierwszy produkt, aby zacząć sprzedawać.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile
