import React from 'react'

const Item = ( { item }) => {
  return (
    <div className="bg-white p-4 h-full rounded-md shadow-md aspect-square">
      <img src={item.images[0]} alt={item.name} className="w-full h-3/4 object-cover rounded-md" />
      <h3>{item.name}</h3>
      <p>{item.price} {item.currency}</p>
    </div>
  )
}

export default Item
