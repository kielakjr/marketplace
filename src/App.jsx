import React from 'react'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Items from './components/Items'
import Sidebar from './components/Sidebar'

const App = () => {

  const [filters, setFilters] = useState({});

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar onSave={setFilters} />
        <Items filters={filters} />
      </div>
    </div>
  )
}

export default App
