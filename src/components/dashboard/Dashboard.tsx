import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CreateCourse from '../../pages/CreateCourse';
import AttendanceRecord from '../../pages/AttendanceRecord';
import RecordAttendance from '../../pages/RecordAttendance';

type Props = {}

const Dashboard = (props: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/');
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded float-right">
          Logout
        </button>
        <Routes>
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="record-attendance" element={<RecordAttendance />} />
          <Route path="attendance-record" element={<AttendanceRecord />} />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard