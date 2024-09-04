import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        className="md:hidden p-4 text-gray-800 z-50 relative"
        onClick={toggleSidebar}
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>
      <div>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
            onClick={toggleSidebar}
          ></div>
        )}
        <div
          className={` h-screen fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 z-50 transition-transform transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:inset-0`}
        >
          <Link
            to="/dashboard"
            className="text-2xl font-bold mb-6"
            onClick={toggleSidebar}
          >
            Dashboard
          </Link>
          <hr className="my-8" />
          <nav className="">
            <Link
              to="create-course"
              className="block mb-2"
              onClick={toggleSidebar}
            >
              Create a Course
            </Link>
            <Link
              to="record-attendance"
              className="block mb-2"
              onClick={toggleSidebar}
            >
              Record Attendance
            </Link>
            <Link
              to="attendance-record"
              className="block mb-2"
              onClick={toggleSidebar}
            >
              Attendance Record
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
