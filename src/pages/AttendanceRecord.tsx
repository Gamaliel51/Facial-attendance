import axios from "axios";
import React, { useEffect, useState } from "react";

type Props = {};
const dummyData = [
  { id: 1, studentName: "John Doe", date: "2024-08-20", time: "10:00 AM" },
  { id: 2, studentName: "Jane Smith", date: "2024-08-20", time: "10:05 AM" },
  { id: 3, studentName: "David Johnson", date: "2024-08-21", time: "11:00 AM" },
];

const AttendanceRecord = (props: Props) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    // Fetch the attendance records from the backend
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendance-records"
        );
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecords();
  }, []);

  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "ID,Student Name,Date,Time",
        ...dummyData.map(
          (item) => `${item.id},${item.studentName},${item.date},${item.time}`
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_record.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handlePrint = () => {
    window.print();
  };
  return (
    <div>
     <h2 className="text-2xl font-bold mb-4">Attendance Record</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.studentName}</td>
              <td className="border px-4 py-2">{item.date}</td>
              <td className="border px-4 py-2">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Download CSV
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
