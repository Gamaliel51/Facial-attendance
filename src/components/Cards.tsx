import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import Spinner from "./spinner/Spinner";


const Cards = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/get-teacher-courses/");
        console.log(response.data.data);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []); // Empty array to ensure this runs only once when the component mounts

  //get-coursereg-link/
  const getCourseRegLink = async (course_code: string, course_name: string) => {
    try {
      const response = await api.post("/get-coursereg-link/", {
        course_code,
        course_name,
      });
      const { link_id } = response.data;

      console.log("Registration link ID:", link_id);
      // navigate(`/register-student/${link_id}`);
      alert(`Course registration link: ${window.location.origin}/register-student/${link_id}`);
    //popup alert with the registration link
      

    } catch (error) {
      console.error("Error getting course registration link:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {courses && courses.length > 0 ? (
        courses.map((course:any) => (
          <div
            key={course.id}
            className="bg-white p-4 shadow-md rounded"
          >
            <img
              src="https://via.placeholder.com/300"
              alt="course"
              className="w-full h-32 object-cover rounded"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">
                {course.course_name}: {course.course_code}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 justify-between mt-4">
              <button
                onClick={() =>
                  getCourseRegLink(course.course_code, course.course_name)
                }
                className="text-blue-600 underline"
              >
                Course Registration
              </button>
              <Link to="record-attendance" className="text-blue-600">
                Video Recording
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center">
          <Spinner/>
          </div>
      )}
    </div>
  );
};

export default Cards;