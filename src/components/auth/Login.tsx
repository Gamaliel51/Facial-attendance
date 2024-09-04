import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SIGNUP } from "../../navigation/routes";
import axios from "../../api/axios";
import Spinner from "../spinner/Spinner";

interface teacherLoginData {
  username: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teacherLoginForm, setTeacherLoginForm] = useState<teacherLoginData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeacherLoginForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = teacherLoginForm;
    setLoading(true);
    try {
      const response = await axios.post("/login/", {
        username,
        password,
      });
      console.log(response.data);
      const token = response.data.access;
      const {refresh} = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refresh", refresh);
      setToken(token);
      
      if (response.status === 200 || 201) {
        navigate("/dashboard");
      } else {
        setError(response.data || "Login failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-2xl w-full max-w-sm border-t-4 border-[#884b8c]"
      >
        <h2 className="text-2xl text-center font-light mb-4">Login</h2>
        <label className="text-[#c0c0c0] text-sm">Username</label>
        <input
          type="text"
          name="username"
          value={teacherLoginForm.username}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Password</label>
        <input
          type="password"
          name="password"
          value={teacherLoginForm.password}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <button
          className="bg-[#894a8b] text-white p-2 rounded w-full"
          type="submit"
        >
          {loading ? <Spinner /> : "Log In"}
        </button>
        <div>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to={SIGNUP} className="text-[#894a8b]">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
