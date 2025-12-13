import React from 'react'
import { categories, sellers, locations } from '../data/items'

const sections = {
  "Kategorie": categories,
  "Sprzedawcy": sellers,
  "Lokalizacje": locations,
   "Cena": ["Do 100 PLN", "100-500 PLN", "500-1000 PLN", "Powyżej 1000 PLN"],
   "Stan": ["Nowy", "Używany"]
}

const Sidebar = () => {

  return (
    <aside className="w-1/3 h-[90vh] overflow-y-auto md:w-1/4 lg:w-1/5 bg-white rounded-md shadow-md ml-2 p-4 sticky top-11 left-0">
      {sections && Object.entries(sections).map(([sectionTitle, options]) => (
        <div key={sectionTitle} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{sectionTitle}</h2>
          <ul>
            {options.map((option) => (
              <li key={option} className="mb-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-700" />
                  <span className="ml-2">{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">Zastosuj filtry</button>
    </aside>
  )
}

export default Sidebar
