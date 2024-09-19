// @ts-ignore
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";

interface AttendanceResponse {
  matric: string;
  name: string;
  time: string;
  result: string;
}

const VideoStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [lastFrameTime, setLastFrameTime] = useState(0); // Track time of last frame sent
  const [tempResponses, setTempResponses] = useState<AttendanceResponse[]>([]);
  const [finalAttendance, setFinalAttendance] = useState<AttendanceResponse[]>(
    []
  );
  const [message, setMessage] = useState<string>("Ready to start.");
  const [messageType, setMessageType] = useState<string>("info"); // Message type for styling

  const location = useLocation();

  const FPS = 0.1; // Desired frames per second
  const FRAME_INTERVAL = 1000 / FPS; // Time between frames in milliseconds

  const { courseCode, teacherID, courseName } = location.state || {};
  const course_id = `${courseCode}_${teacherID}`;
  // .replace(/\s+/g, "")
  // console.log(course_id);

  useEffect(() => {
    // Process responses whenever tempResponses changes
    processResponses();
  }, [tempResponses]);

  // Start video streaming from the user's webcam
  const startVideoStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setMessage("Video started, awaiting face detection...");
          setMessageType("info");
          captureFrames();
        }
      })
      .catch(() => {
        setMessage("Error accessing webcam.");
        setMessageType("error");
      });
  };

  const stopVideoStream = () => {
    const mediaStream = videoRef.current?.srcObject as MediaStream;
    mediaStream?.getTracks().forEach((track) => track.stop());

    // Close the WebSocket connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null; // Set to null to prevent further use
      setMessage("Video stopped, WebSocket closed.");
      setMessageType("info");
    }
  };

  // Capture video frames and send to backend using WebSocket
  const captureFrames = () => {
    const ws = new WebSocket("ws://0.tcp.eu.ngrok.io:15642/ws/video/"); // WebSocket connection to backend
    wsRef.current = ws; // Store WebSocket reference

    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!video || !ctx) return;

    ws.onopen = () => {
      setMessage("WebSocket connection opened, streaming frames...");
      setMessageType("success");

      const sendFrame = () => {
        const currentTime = Date.now();

        // Only capture a frame if enough time has passed since the last one
        if (currentTime - lastFrameTime >= FRAME_INTERVAL) {
          setLastFrameTime(currentTime); // Update the time of the last sent frame

          // Set up the canvas dimensions
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw the video frame on the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert the frame to base64 and send to backend
          const frameData = canvas.toDataURL("image/jpeg");
          ws.send(
            JSON.stringify({
              frame: frameData,
              course_id,
            })
          );
        }
        0;
        // Capture the next frame after a small delay
        setTimeout(sendFrame, 10000);
      };
      sendFrame();
    };

    // Handle results from backend
    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      // console.log("Processed data from backend:", data);
      if (data.result !== "No face found in frame") {
        setTempResponses((prevResponses) => [...prevResponses, data]);
        setMessage("Face detected in the frame. Hold on...");
        setMessageType("success");
      } else {
        setMessage("No face found, please adjust position.");
        setMessageType("warning");
      }
    };

    ws.onerror = () => {
      setMessage("WebSocket error, please reload the page.");
      setMessageType("error");
    };

    ws.onclose = () => {
      setMessage("WebSocket connection closed.");
      setMessageType("info");
    };
  };
  // Process tempResponses to find students with at least 3 records and add the latest one to finalAttendance
  const processResponses = () => {
    const responseMap: Record<string, AttendanceResponse[]> = {};

    // Group responses by matric and name
    tempResponses.forEach((response) => {
      const key = `${response.matric}`;
      if (!responseMap[key]) {
        responseMap[key] = [];
      }
      responseMap[key].push(response);
    });

    const newFinalAttendance: AttendanceResponse[] = [];
    // For each student, if there are at least 3 records, add the latest one to finalAttendance
    Object.values(responseMap).forEach((responses) => {
      if (responses.length >= 2) {
        const latestResponse = responses.reduce((latest, current) =>
          new Date(current.time) > new Date(latest.time) ? current : latest
        );
        newFinalAttendance.push(latestResponse);
      }
    });
    if (newFinalAttendance.length > 0) {
      setFinalAttendance((prevAttendance) => {
        // Merge new final attendance data with previous data
        const updatedAttendance = [...prevAttendance];

        // Only update state once with the new array
        newFinalAttendance.forEach((entry) => {
          const existingIndex = updatedAttendance.findIndex(
            (prev) => prev.matric === entry.matric
          );
          if (existingIndex !== -1) {
            // If the student already exists, update the entry
            updatedAttendance[existingIndex] = entry;
          } else {
            // Otherwise, add the new entry
            updatedAttendance.push(entry);
          }
        });

        // console.log("Final attendance updated:", updatedAttendance);
        return updatedAttendance;
      });
      setMessage("Attendance successfully recorded!");
      setMessageType("success");
      // Reset tempResponses to start fresh after a successful match
      setTempResponses([]);
    } else {
    }
  };

  // Submit finalAttendance data to the backend
  const submitAttendance = async () => {
    const attendanceData = {
      date: new Date().toISOString().split("T")[0], // current date
      attendance: finalAttendance,
      course_code: courseCode,
      course_name: courseName, // Example course name
      teacher_id: teacherID,
    };

    try {
      await api.post("/save-attendance/", attendanceData);
      setMessage("Attendance submitted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error submitting attendance.");
      setMessageType("error");
    }
  };

  return (
    <div>
      {/* instructions */}
      <h1 className="text-2xl font-bold">Record Attendance</h1>
      <p className="text-sm text-gray-500">
        Click "Start Video" to begin recording attendance.
        <br /> Ensure your face is visible in the video frame.
      </p>
      <video ref={videoRef} autoPlay></video>
      {message && <div className={`message-box ${messageType}`}>{message}</div>}
      <button
        className="mt-5  mr-5 text-white p-2 rounded  bg-[#389130]"
        onClick={startVideoStream}
      >
        Start Video
      </button>
      <button
        className="mt-5 mr-5 text-white p-2 rounded  bg-[#d62e2e]"
        onClick={stopVideoStream}
      >
        Stop Video
      </button>
      <button
        className="mt-5 text-white p-2 rounded  bg-[#894a8b]"
        onClick={submitAttendance}
      >
        Submit Attendance
      </button>
      <style>{`
        .message-box {
          margin-top: 15px;
          padding: 10px;
          border-radius: 5px;
        }
        .info {
          background-color: #e0f7fa;
          color: #00796b;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
        }
        .warning {
          background-color: #fff3cd;
          color: #856404;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default VideoStream;
