import Profile from '@/components/Profile'
import { useParams } from 'react-router'

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  if (!id) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-brand-800 font-semibold text-base">Nie można wyświetlić profilu.</p>
          <p className="text-brand-500 text-sm">Nie podano identyfikatora użytkownika.</p>
        </div>
      </div>
    )
  }
  return (
    <Profile userId={id} />
  )
}

export default ProfilePage
