// @ts-ignore
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Spinner from "./spinner/Spinner";

const Cards = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/get-teacher-courses/");
        // console.log(response.data.data);
        // localStorage.
        setCourses(response.data.data);
        // const {teacher_id} = response.data.data
        // console.log(teacher_id)
        // localStorage.setItem
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

      // console.log("Registration link ID:", link_id);
      // navigate(`/register-student/${link_id}`);
      alert(
        `Course registration link: ${window.location.origin}/register-student/${link_id}`
      );
      //popup alert with the registration link
    } catch (error) {
      console.error("Error getting course registration link:", error);
    }
  };

  return (
    <div
      className={`grid grid-cols-1 gap-6 ${
        courses && courses.length > 0 ? "lg:grid-cols-3" : ""
      }`}
    >
      {courses && courses.length > 0 ? (
        courses.map((course: any) => (
          <div key={course.id} className="bg-white p-4 shadow-md rounded">
            <img
              src="src/assets/images/cardBg2.jpg"
              alt="course"
              className="w-full h-32 object-cover rounded"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">
                {course.course_name}: {course.course_code}
              </h2>
            </div>

            <button
              onClick={() =>
                getCourseRegLink(course.course_code, course.course_name)
              }
              className="text-white p-2 rounded w-full bg-[#894a8b]"
            >
              Course Registration
            </button>
            <div className="flex justify-between mt-2">
              <Link
                state={{
                  courseCode: course.course_code,
                  teacherID: course.teacher_id,
                  courseName: course.course_name,
                }}
                to="record-attendance"
                className="text-blue-600"
              >
                Video Recording
              </Link>
              <Link
                state={{
                  courseCode: course.course_code,
                  courseName: course.course_name,
                }}
                to="attendance-record"
                className="text-blue-600"
              >
                Attendance Records
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className=" grid grid-cols-1 ">
          <Spinner size="2rem" color="#894a8b" duration="1s" />
        </div>
      )}
    </div>
  );
};

export default Cards;
