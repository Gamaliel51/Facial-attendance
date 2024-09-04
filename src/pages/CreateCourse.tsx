import api from "../api/api";
import React, { useState } from "react";
import Spinner from "../components/spinner/Spinner";

interface Courses {
  course_name: string;
  course_code: string;
}

const CreateCourse = () => {
  const [loading, setLoading] = useState(false);

  const [courseData, setCourseData] = useState<Courses>({
    course_name: "",
    course_code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(courseData);
    try {
      const response = await api.post("/addcourse/", courseData);
      console.log(response.data);
      if (response.status === 200 || 201) {
        alert("Course added successfully");
      }
    } catch (error) {
      console.error("Error while adding course:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Add Course</h2>
      <form onSubmit={handleSubmit}>
        <label className="text-[#c0c0c0] text-sm">Course Title</label>
        <input
          type="text"
          name="course_name"
          value={courseData.course_name}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />
        <label className="text-[#c0c0c0] text-sm">Course Code</label>
        <input
          type="text"
          name="course_code"
          value={courseData.course_code}
          onChange={handleChange}
          className="mb-3 p-2 border rounded w-full"
        />{" "}
        <button type="submit" className="bg-[#894a8b] text-white p-2 rounded w-32">
        {loading ? <Spinner/> : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
