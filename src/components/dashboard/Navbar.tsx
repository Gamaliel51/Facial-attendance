import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
    <div className="flex justify-between">
      <Link to="/dashboard" className="text-xl font-bold">Dashboard</Link>
      <Link to="/login" className="text-lg">Logout</Link>
    </div>
  </nav>
  )
}

export default Navbar