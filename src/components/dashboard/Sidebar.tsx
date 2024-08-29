import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

const Sidebar = (props: Props) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        <Link to="create-course" className="block mb-2">Create a Course</Link>
        <Link to="record-attendance" className="block mb-2">Record Attendance</Link>
        <Link to="attendance-record" className="block mb-2">Attendance Record</Link>
      </nav>
    </div>
  )
}

export default Sidebar