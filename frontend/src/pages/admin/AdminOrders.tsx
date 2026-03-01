import React from 'react'
import { useAdminOrders } from '@/hooks/useOrders'

const AdminOrders = () => {
  const { data: orders, isLoading, error } = useAdminOrders();

  console.log('Admin Orders:', orders);

  if (isLoading) {
    return <div>Ładowanie zamówień...</div>;
  }

  if (error) {
    return <div>Wystąpił błąd podczas ładowania zamówień.</div>;
  }

  return (
    <div>
      <h1>Zamówienia</h1>
      <p>Brak zamówień do wyświetlenia.</p>
    </div>
  )
}

export default AdminOrders
