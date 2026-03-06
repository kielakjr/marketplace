import Profile from '@/components/Profile'
import { useAuth } from '@/hooks/useAuth'

const MyProfilePage = () => {
  const { user } = useAuth()
  return (
    <Profile userId={user!.id} isMy />
  )
}

export default MyProfilePage
