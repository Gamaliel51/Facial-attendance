// @ts-ignore
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Spinner from "./spinner/Spinner";
import FormModal from "./dashboard/FormModal";

const Cards = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [registrationLink, setRegistrationLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await api.get("/get-teacher-courses/");
        setCourses(response.data.data);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getCourseRegLink = async (course_code: string, course_name: string) => {
    setLinkLoading(true);
    try {
      const response = await api.post("/get-coursereg-link/", {
        course_code,
        course_name,
      });
      const { link_id } = response.data;
      setRegistrationLink(
        `${window.location.origin}/register-student/${link_id}`
      );
    } catch (error) {
      console.error("Error getting course registration link:", error);
    } finally {
      setLinkLoading(false);
    }
  };

  return (
    <div className={`grid gap-6 ${courses.length > 0 ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
      {loading ? (
        <Spinner size="2rem" color="#894a8b" duration="1s" />
      ) : courses.length > 0 ? (
        courses.map((course: any) => (
          <div
            key={course.id}
            className="bg-white p-6 shadow-lg rounded-lg transform transition duration-300 hover:scale-105"
          >
            <img
              src="src/assets/images/cardBg2.jpg"
              alt="course"
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold">
                {course.course_name}: {course.course_code}
              </h2>
            </div>

            <button
              onClick={() => {
                getCourseRegLink(course.course_code, course.course_name);
                openModal();
              }}
              className="mt-4 w-full py-2 bg-[#894a8b] text-white rounded-lg hover:bg-[#6e3574] transition"
            >
              Course Registration
            </button>
            <div className="flex justify-between items-center mt-4">
              <Link
                to="record-attendance"
                state={{
                  courseCode: course.course_code,
                  teacherID: course.teacher_id,
                  courseName: course.course_name,
                }}
                className="text-indigo-600 hover:underline"
              >
                Video Recording
              </Link>
              <Link
                to="attendance-record"
                state={{
                  courseCode: course.course_code,
                  courseName: course.course_name,
                }}
                className="text-indigo-600 hover:underline"
              >
                Attendance Records
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-1 text-center text-gray-600">
          No courses found. Please add a course.
        </div>
      )}
      <FormModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        registerStudent={registrationLink}
        loading={linkLoading}
      />
    </div>
  );
};

export default Cards;
