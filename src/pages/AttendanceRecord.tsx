import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useLocation } from "react-router-dom";
import Spinner from "../components/spinner/Spinner";

interface AttendanceRecord {
  matric: string;
  name: string;
  time: string;
}

interface AttendanceResponse {
  date: string;
  attendance: AttendanceRecord[];
  course_code: string;
  course_name: string;
  teacher_id: string;
}

const AttendanceRecord = () => {
  const location = useLocation();
  const { courseCode, courseName } = location.state || {};

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the attendance records from the backend
  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/fetch-attendance-records/", {
        course_code: courseCode,
      });
      if (response.data.length > 0) {
        setAttendanceRecords(response.data); // Assuming you only need one record object
      } else {
        setAttendanceRecords([]);
      }
      console.log("Attendance records:", JSON.stringify(response.data));
    } catch (error) {
      setError("Error fetching attendance records.");
      console.error("Error fetching attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  //attendance-file/

  const downloadAttendanceFile = async () => {
    try {
     const payload = {
        date: attendanceRecords[0].date,
        attendance: attendanceRecords.flatMap((record) => record.attendance),
        course_code: attendanceRecords[0].course_code,
        course_name: attendanceRecords[0].course_name,
        teacher_id: attendanceRecords[0].teacher_id,
      };
      const response = await api.post("/attendance-file/", payload, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `attendance_${courseCode}_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading attendance file:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);
  const handlePrint = () => {
    window.print();
  };

  let globalCounter = 0;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{`Attendance Record for ${courseName}`}</h2>
      {loading ? (
        <Spinner size="2rem" color="#894a8b" />
      ) : error ? (
        <p>{error}</p>
      ) : attendanceRecords ? (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">S/N</th>
              <th className="border px-4 py-2">Matric</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
          {attendanceRecords.flatMap((record) =>
            record.attendance.map((item) => {
              globalCounter++; // Increment globalCounter for each attendance entry
              return (
                <tr key={`${item.matric}-${globalCounter}`}>
                  <td className="border px-4 py-2">{globalCounter}</td>
                  <td className="border px-4 py-2">{item.matric}</td>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.time}</td>
                  <td className="border px-4 py-2">{record.date}</td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}

      <div className="flex space-x-4 mt-4">
        <button
          onClick={fetchRecords}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Refresh Records
        </button>
        <button
          onClick={downloadAttendanceFile}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Download Attendance
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default AttendanceRecord;
