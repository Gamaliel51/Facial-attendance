import { FaRegCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex justify-center items-center">
        <img
          src="src/assets/images/logo.webp"
          alt="logo"
          className="w-20 h-20"
        />

        <Link to="/dashboard">
          <span className="text-black text-2xl font-bold">Attendify</span>
        </Link>
      </div>
      <div className="flex space-x-4 gap-6">
        <Link to="create-course" className="text-black font-semibold">
          Create Course
        </Link>
        <div className="flex items-center gap-2">
          <Link to="" className="text-black font-semibold">
            Admin
          </Link>
          <FaRegCircleUser />
        </div>
      </div>
    </div>
  );
};

export default Logo;
// src\assets\images\logo.webp
