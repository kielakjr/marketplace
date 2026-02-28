import React from 'react'
import { useUsers } from '@/hooks/useUsers'
import UserCard from '@/components/UserCard';

const AdminUsers = () => {
  const {data: users, isLoading, isError} = useUsers();

  if (isLoading) return <div>Ładowanie...</div>
  if (isError) return <div>Nie udało się załadować użytkowników.</div>
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map(user => (
          <UserCard user={user} onChangeRole={() => {}} onEdit={() => {}} onDelete={() => {}}/>
        ))}
      </ul>
    </div>
  )
}

export default AdminUsers
