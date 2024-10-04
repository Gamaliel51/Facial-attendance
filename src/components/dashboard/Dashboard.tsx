// @ts-ignore
import { Route, Routes } from "react-router-dom";
import CreateCourse from "../../pages/CreateCourse";
import AttendanceRecord from "../../pages/AttendanceRecord";
import RecordAttendance from "../../pages/RecordAttendance";
import Cards from "../Cards";
import Logo from "../Logo";

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-[#c9d7e0] py-4">
        <Logo />
      </div>

      <div className="p-6 lg:p-12">
        <Routes>
          <Route
            path="/"
            element={
              <div className="bg-white shadow-lg p-8 rounded-lg">
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
