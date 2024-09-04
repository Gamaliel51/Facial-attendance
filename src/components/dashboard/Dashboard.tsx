import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CreateCourse from "../../pages/CreateCourse";
import AttendanceRecord from "../../pages/AttendanceRecord";
import RecordAttendance from "../../pages/RecordAttendance";
import Cards from "../Cards";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    navigate("/");
  };

  localStorage.getItem("token");

  return (
    <div className="flex bg-[#eff0f3] h-screen overflow-hidden ">
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded"
          >
            Logout
          </button>
        </div>{" "}
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            {/* This route only shows when on the exact /dashboard */}
            <Route
              path="/"
              element={
                <div className="bg-white p-6">
                  <Cards />
                </div>
              }
            />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="record-attendance" element={<RecordAttendance />} />
            <Route path="attendance-record" element={<AttendanceRecord />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
