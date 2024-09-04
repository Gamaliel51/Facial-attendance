import React, { useState } from "react";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";

interface TeacherSignupData {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

const Signup = () => {
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teacherSignupForm, setTeacherSignupForm] = useState<TeacherSignupData>(
    {
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
    }
  );

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeacherSignupForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const { username, password, email, first_name, last_name } =
    //   teacherSignupForm;
    setLoading(true);
    try {
      const response = await axios.post("/signup/", teacherSignupForm);
      console.log(response.data);
      if (response.status === 200 || 201) {
        navigate("/"); // Redirect to login page or dashboard after signup
      } else {
        setErrors(response.data || "Sign up failed");
      }
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
        <h2 className="text-2xl text-center font-light mb-4">SignUp</h2>
        <label className="text-[#c0c0c0] text-sm">First Name</label>
        <input
          type="text"
          name="first_name"
          value={teacherSignupForm.first_name}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={teacherSignupForm.last_name}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Username</label>
        <input
          type="text"
          name="username"
          value={teacherSignupForm.username}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Email</label>
        <input
          type="email"
          name="email"
          value={teacherSignupForm.email}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Password</label>
        <input
          type="password"
          name="password"
          value={teacherSignupForm.password}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <button
          className="bg-[#894a8b] text-white p-2 rounded w-full"
          type="submit"
        >
          {loading ? <Spinner /> : "Sign Up"}
        </button>
        <div>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-[#894a8b]">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
