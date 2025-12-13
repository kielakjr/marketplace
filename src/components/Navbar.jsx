import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { CgProfile } from "react-icons/cg";
import logo from '../assets/logoM.png'

const Navbar = () => {
  return (
    <nav className="h-12 flex flex-row m-2 items-center justify-between px-4 bg-white rounded-md shadow-md py-2">
      <div>
        <img src={logo} alt="logo" className="w-8 h-8 -mt-1 inline mr-2 rounded-md" />
        <span className="text-xl font-semibold hidden md:inline">Marketplace</span>
      </div>
      <div className="flex flex-row items-center">
        <FaSearch />
        <input
          type="text"
          placeholder="Search..."
          className="ml-2 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <CgProfile className="ml-2 w-8 h-8 text-blue-800" />
      </div>
    </nav>
  )
}

export default Navbar
