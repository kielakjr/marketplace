import React from 'react'
import { categories, sellers, locations } from '../data/items'
import { useState } from 'react'
import { GoSidebarCollapse, GoSidebarExpand  } from "react-icons/go";

const sections = {
  "Kategorie": categories,
  "Sprzedawcy": sellers,
  "Lokalizacje": locations,
   "Cena": ["Do 100 PLN", "100-500 PLN", "500-1000 PLN", "Powyżej 1000 PLN"],
   "Stan": ["Nowy", "Używany"]
}

const Sidebar = ( { onSave }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [filters, setFilters] = useState({});

  const handleFilterChange = (section, option) => {
    setFilters((prevFilters) => {
      const sectionFilters = prevFilters[section] || [];
      if (sectionFilters.includes(option)) {
        return {
          ...prevFilters,
          [section]: sectionFilters.filter((item) => item !== option)
        };
      } else {
        return {
          ...prevFilters,
          [section]: [...sectionFilters, option]
        };
      }
    });
  }

  const handleSave = () => {
    onSave({...filters});
  }

  return (
    <>
    <button
      className={`fixed top-16 ${isCollapsed ? "-left-2" : "left-36"} z-50 bg-white p-2 rounded-md shadow-md md:hidden`}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      {!isCollapsed ? <GoSidebarExpand size={24} /> : <GoSidebarCollapse size={24} />}
    </button>
    {isCollapsed ? null :
    <aside className="w-full h-[90vh] overflow-y-auto md:w-1/4 lg:w-1/5 bg-white rounded-md shadow-md ml-2 p-4 sticky top-11 left-0">
      {sections && Object.entries(sections).map(([sectionTitle, options]) => (
        <div key={sectionTitle} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{sectionTitle}</h2>
          <ul>
            {options.map((option) => (
              <li key={option} className="mb-2">
                <label className="inline-flex items-center">
                  <input checked={filters[sectionTitle]?.includes(option)} type="checkbox" className="form-checkbox h-4 w-4 text-blue-700" onChange={() => handleFilterChange(sectionTitle, option)} />
                  <span className="ml-2">{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">Zastosuj filtry</button>
    </aside>
    }
    </>
  )
}

export default Sidebar
