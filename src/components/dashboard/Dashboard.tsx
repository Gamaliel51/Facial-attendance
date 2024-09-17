import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CreateCourse from "../../pages/CreateCourse";
import AttendanceRecord from "../../pages/AttendanceRecord";
import RecordAttendance from "../../pages/RecordAttendance";
import Cards from "../Cards";
import api from "../../api/api";
import Logo from "../Logo";

const Dashboard = () => {
  const navigate = useNavigate();


  localStorage.getItem("token");

  // useEffect(() => {
  //   const getTeacherID = async () => {
  //     try {
  //       const response = await api.get("/get-teacher-id/");
  //       console.log(response.data);
  //       const { teacher_id } = response.data;
  //       localStorage.setItem("teacher_id", teacher_id);
  //     } catch (error) {
  //       console.error("Error fetching teacher ID:", error);
  //     }
  //   };

  //   getTeacherID();
  // }, []);

  return (
    <div className=" bg-[#eff0f3] ">
      <div className="bg-[#c9d7e0]">
        <Logo />
      </div>

      <div className="flex-1 overflow-auto p-6 ">
        <Routes>
          {/* This route only shows when on the exact /dashboard  */}
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
  );
};

export default Dashboard;
