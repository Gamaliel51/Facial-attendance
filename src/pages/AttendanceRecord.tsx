// @ts-ignore
import { useEffect, useState } from "react";
import api from "../api/api";
import { useLocation } from "react-router-dom";
import Spinner from "../components/spinner/Spinner";

interface AttendanceRecord {
  matric: string;
  name: string;
  time: string;
  department: string;
  level: string;
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

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/fetch-attendance-records/", {
        course_code: courseCode,
      });
      if (response.data.length > 0) {
        setAttendanceRecords(response.data);
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
      setError("Error fetching attendance records.");
      console.error("Error fetching attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-7xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Attendance Record for {courseName}
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner size="3rem" color="#894a8b" />
            </div>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-4 text-gray-600 text-left">S/N</th>
                    <th className="p-4 text-gray-600 text-left">Matric</th>
                    <th className="p-4 text-gray-600 text-left">Name</th>
                    <th className="p-4 text-gray-600 text-left">Level</th>
                    <th className="p-4 text-gray-600 text-left">Department</th>
                    <th className="p-4 text-gray-600 text-left">Time</th>
                    <th className="p-4 text-gray-600 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.flatMap((record) =>
                    record.attendance.map((item) => {
                      globalCounter++;
                      return (
                        <tr
                          key={`${item.matric}-${globalCounter}`}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="p-4 text-gray-700">{globalCounter}</td>
                          <td className="p-4 text-gray-700">{item.matric}</td>
                          <td className="p-4 text-gray-700">{item.name}</td>
                          <td className="p-4 text-gray-700">{item.level}</td>
                          <td className="p-4 text-gray-700">
                            {item.department}
                          </td>
                          <td className="p-4 text-gray-700">{item.time}</td>
                          <td className="p-4 text-gray-700">{record.date}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No attendance records found.
            </p>
          )}
        </div>

        <div className="p-6 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={fetchRecords}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition"
          >
            Refresh Records
          </button>
          <button
            onClick={downloadAttendanceFile}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition"
          >
            Download Attendance
          </button>
          <button
            onClick={handlePrint}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-md transition"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

/**
   return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Attendance Record for {courseName}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner size="3rem" color="#894a8b" />
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : attendanceRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse block md:table bg-gray-50">
              <thead className="block md:table-header-group">
                <tr className="border-b md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                  <th className="block md:table-cell p-2 text-gray-600 text-center">S/N</th>
                  <th className="block md:table-cell p-2 text-gray-600 text-center">Matric</th>
                  <th className="block md:table-cell p-2 text-gray-600 text-center">Name</th>
                  <th className="block md:table-cell p-2 text-gray-600 text-center">Level</th>
                  <th className="block md:table-cell p-2 text-gray-600 text-center">Department</th>
                  <th className="block md:table-cell p-2 text-gray-600 text-center">Time</th>
                  <th className="block md:table-cell p-2 text-gray-600 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {attendanceRecords.flatMap((record) =>
                  record.attendance.map((item) => {
                    globalCounter++;
                    return (
                      <tr
                        key={`${item.matric}-${globalCounter}`}
                        className="bg-white border-t md:border-none block md:table-row"
                      >
                        <td className="block md:table-cell p-2 text-center">{globalCounter}</td>
                        <td className="block md:table-cell p-2 text-center">{item.matric}</td>
                        <td className="block md:table-cell p-2 text-center">{item.name}</td>
                        <td className="block md:table-cell p-2 text-center">{item.level}</td>
                        <td className="block md:table-cell p-2 text-center">{item.department}</td>
                        <td className="block md:table-cell p-2 text-center">{item.time}</td>
                        <td className="block md:table-cell p-2 text-center">{record.date}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No attendance records found.</p>
        )}

        <div className="flex flex-wrap justify-center space-x-4 mt-6">
          <button
            onClick={fetchRecords}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md"
          >
            Refresh Records
          </button>
          <button
            onClick={downloadAttendanceFile}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md"
          >
            Download Attendance
          </button>
          <button
            onClick={handlePrint}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg shadow-md"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
 */

export default AttendanceRecord;
