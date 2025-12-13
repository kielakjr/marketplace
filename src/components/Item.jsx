import React from 'react'

const Item = ( { item }) => {
  return (
    <div className="bg-white p-4 h-full rounded-md shadow-md aspect-square">
      <img src={item.images[0]} alt={item.name} className="w-full object-cover rounded-md" />
      <h3 className="text-lg font-semibold mt-2 md:text-xl">{item.name}</h3>
      <p className="mr-auto">{item.price} {item.currency}</p>
    </div>
  )
}

export default Item
