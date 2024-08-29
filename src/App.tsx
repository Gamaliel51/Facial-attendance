import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import {
  ATTENDANCEMANAGEMENT,
  CREATECOURSE,
  DASHBOARD,
  LOGIN,
  SIGNUP,
  VIDEORECORDING,
} from "./navigation/routes";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import CreateCourse from "./pages/CreateCourse";
import VideoRecording from "./pages/RecordAttendance";
import AttendanceRecord from "./pages/AttendanceRecord";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path={SIGNUP} element={<Signup />} />

        {/* Dashboard with nested routes */}
        <Route path={DASHBOARD} element={<Dashboard />}>
          {/* <Route path={CREATECOURSE} element={<CreateCourse />} />
          <Route path={VIDEORECORDING} element={<VideoRecording />} />
          <Route path={ATTENDANCEMANAGEMENT} element={<AttendanceRecord />} /> */}
        </Route>

        {/* Redirect to login if no matching route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
