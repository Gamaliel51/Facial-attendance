// @ts-ignore
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { DASHBOARD, SIGNUP } from "./navigation/routes";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import RegisterStudent from "./pages/student registration/RegisterStudent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path={SIGNUP} element={<Signup />} />

        {/* Dashboard with nested routes */}
        <Route path={DASHBOARD} element={<Dashboard />} />

        <Route
          path="/register-student/:link_id"
          element={<RegisterStudent />}
        />
        {/* Redirect to login if no matching route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
