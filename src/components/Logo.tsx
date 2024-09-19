import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { HiOutlineMenuAlt4, HiX } from "react-icons/hi"; // Icons for menu and close

const Logo = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <div className="container mx-auto flex items-center justify-between px-4 py-4">
      <div className="flex items-center">
        <img
          src="src/assets/images/logo.webp"
          alt="logo"
          className="w-16 h-16"
        />

        <Link to="/dashboard">
          <span className="text-black text-2xl font-bold ml-2">Attendify</span>
        </Link>
      </div>
      {/* Hamburger Icon for Small Screens */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <HiX className="text-3xl text-black" /> // Close icon when menu is open
          ) : (
            <HiOutlineMenuAlt4 className="text-3xl text-black" /> // Hamburger icon
          )}
        </button>
      </div>

      <div className="hidden md:flex space-x-4 gap-6">
        <Link to="create-course" className="text-black font-semibold">
          Create Course
        </Link>
        <button onClick={handleLogout} className="text-black font-semibold">
          Logout
        </button>
      </div>

     

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-white w-48 shadow-md py-2 rounded-md flex flex-col items-center space-y-4 md:hidden">
          <Link
            to="create-course"
            className="text-black font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Course
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="text-black font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Logo;
// src\assets\images\logo.webp
