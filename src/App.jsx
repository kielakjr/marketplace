import React from 'react'
import Navbar from './components/Navbar'
import Items from './components/Items'
import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <Items />
      </div>
    </div>
  )
}

export default App
