import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useLocation } from "react-router-dom";

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

  // Fetch the attendance records from the backend
  const fetchRecords = async () => {
    try {
      const response = await api.post("/fetch-attendance-records/", {
        course_code: courseCode,
      });
      setAttendanceRecords(response.data);
      console.log("Attendance records:", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  //attendance-file/

  const downloadAttendanceFile = async () => {
    try {
      const response = await api.post(
        "/attendance-file/",
        { attendanceRecords },
        {
          responseType: "blob",
        }
      );

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
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{`Attendance Record for ${courseName}`}</h2>

      {/* <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="border px-4 py-2">Matric</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Time</th>
        </tr>
      </thead>
      <tbody>
        {attendanceRecords.length > 0 ? (
          attendanceRecords.map((record, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{record.matric}</td>
              <td className="border px-4 py-2">{record.name}</td>
              <td className="border px-4 py-2">{record.time}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="border px-4 py-2 text-center">
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table> */}
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
          {attendanceRecords.map((record, index) =>
            record.attendance.map((item, idx) => (
              <tr key={`${item.matric}-${idx}`}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.matric}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.time}</td>
                <td className="border px-4 py-2">{record.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
    // <div>
    //  <h2 className="text-2xl font-bold mb-4">Attendance Record</h2>
    //   <table className="min-w-full bg-white border">
    //     <thead>
    //       <tr>
    //         <th className="border px-4 py-2">ID</th>
    //         <th className="border px-4 py-2">Student Name</th>
    //         <th className="border px-4 py-2">Date</th>
    //         <th className="border px-4 py-2">Time</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {dummyData.map((item) => (
    //         <tr key={item.id}>
    //           <td className="border px-4 py-2">{item.id}</td>
    //           <td className="border px-4 py-2">{item.studentName}</td>
    //           <td className="border px-4 py-2">{item.date}</td>
    //           <td className="border px-4 py-2">{item.time}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    //   <div className="flex space-x-4 mt-4">
    //     <button
    //       onClick={handleDownload}
    //       className="bg-blue-500 text-white py-2 px-4 rounded"
    //     >
    //       Download CSV
    //     </button>
    //     <button
    //       onClick={handlePrint}
    //       className="bg-green-500 text-white py-2 px-4 rounded"
    //     >
    //       Print
    //     </button>
    //   </div>
    // </div>
  );
};

export default AttendanceRecord;
