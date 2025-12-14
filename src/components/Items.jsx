import React from 'react'
import items from '../data/items'
import Item from './Item'

const filterItems = (items, filters) => {
  return items.filter((item) => {
    for (const [section, selectedOptions] of Object.entries(filters)) {
      if (selectedOptions.length === 0) continue;

      switch (section) {
        case "Kategorie":
          if (!selectedOptions.includes(item.category)) return false;
          break;
        case "Sprzedawcy":
          if (!selectedOptions.includes(item.seller)) return false;
          break;
        case "Lokalizacje":
          if (!selectedOptions.includes(item.location)) return false;
          break;
        case "Cena":
          const price = item.price;
          let priceMatch = false;
          for (const option of selectedOptions) {
            if (option === "Do 100 PLN" && price <= 100) priceMatch = true;
            else if (option === "100-500 PLN" && price > 100 && price <= 500) priceMatch = true;
            else if (option === "500-1000 PLN" && price > 500 && price <= 1000) priceMatch = true;
            else if (option === "Powyżej 1000 PLN" && price > 1000) priceMatch = true;
          }
          if (!priceMatch) return false;
          break;
        case "Stan":
          if (!selectedOptions.includes(item.condition)) return false;
          break;
        default:
          break;
      }
    }
    return true;
  });
};

const sortItems = (items, sorting) => {
  if (!sorting) return items;

  const sortedItems = [...items];
  switch (sorting) {
    case "Cena: od najniższej":
      sortedItems.sort((a, b) => a.price - b.price);
      break;
    case "Cena: od najwyższej":
      sortedItems.sort((a, b) => b.price - a.price);
      break;
    case "Najnowsze":
      sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "Najstarsze":
      sortedItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    default:
      break;
  }
  return sortedItems;
};

const Items = ( { filters }) => {

  const filteredItems = filterItems(items, filters);

  return (
    <div className="overflow-auto overflow-x-hidden w-full grid content-start grid-cols-[repeat(auto-fill,minmax(200px, 1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 mx-5">
      {sortItems(filteredItems, filters.Sortowanie?.[0]).map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Items
