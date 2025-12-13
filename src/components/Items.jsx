import React from 'react'
import items from '../data/items'
import Item from './Item'

const Items = () => {
  return (
    <div className="overflow-auto overflow-x-hidden grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mx-3">
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Items
