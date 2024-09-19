// @ts-ignore
import { Route, Routes } from "react-router-dom";
import CreateCourse from "../../pages/CreateCourse";
import AttendanceRecord from "../../pages/AttendanceRecord";
import RecordAttendance from "../../pages/RecordAttendance";
import Cards from "../Cards";
import Logo from "../Logo";

const Dashboard = () => {
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
