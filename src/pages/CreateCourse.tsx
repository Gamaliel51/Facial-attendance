import axios from "axios";
import React, { useState } from "react";

type Props = {};

const CreateCourse = (props: Props) => {
  const [lecturerName, setLecturerName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseLink, setCourseLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/create-course",
        {
          lecturerName,
          courseName,
        }
      );
      setCourseLink(response.data.link);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create a Course</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Lecturer's Name"
          value={lecturerName}
          onChange={(e) => setLecturerName(e.target.value)}
          className="mb-3 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="mb-3 p-2 border rounded w-full"
        />{" "}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Course
        </button>
      </form>
      {courseLink && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Course Link</h3>
          <p className="text-gray-700">{courseLink}</p>
          <button
            onClick={() => navigator.clipboard.writeText(courseLink)}
            className="mt-2 bg-green-500 text-white p-2 rounded"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;
