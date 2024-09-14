// @ts-ignore
import axios from "axios";

export const config = {
  baseURL: "http://4.tcp.eu.ngrok.io:16389",
};

const client = axios.create({
  baseURL: config.baseURL,

  timeout: 100000,
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

export default client;

/**
 * 
 * import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";

interface AttendanceResponse {
  matric: string;
  name: string;
  time: string;
  result:string
}

const VideoStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [lastFrameTime, setLastFrameTime] = useState(0); // Track time of last frame sent
  const [tempResponses, setTempResponses] = useState<AttendanceResponse[]>([]);
  const [finalAttendance, setFinalAttendance] = useState<AttendanceResponse[]>(
    []
  );

  const location = useLocation();

  const FPS = 1; // Desired frames per second
  const FRAME_INTERVAL = 1000 / FPS; // Time between frames in milliseconds

  const { courseCode, teacherID, courseName } = location.state || {};
  const course_id = `${courseCode}_${teacherID}`;
  // .replace(/\s+/g, "")
  console.log(course_id);

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
          captureFrames();
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  const stopVideoStream = () => {
    const mediaStream = videoRef.current?.srcObject as MediaStream;
    mediaStream?.getTracks().forEach((track) => track.stop());

    // Close the WebSocket connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null; // Set to null to prevent further use
      console.log("WebSocket closed.");
    }
  };

  // Capture video frames and send to backend using WebSocket
  const captureFrames = () => {
    const ws = new WebSocket("ws://4.tcp.eu.ngrok.io:16389/ws/video/ "); // WebSocket connection to backend
    wsRef.current = ws; // Store WebSocket reference

    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!video || !ctx) return;

    ws.onopen = () => {
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
      console.log("Processed data from backend:", data);
      setTempResponses((prevResponses) => [...prevResponses, data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };
  // Process tempResponses to find students with at least 3 records and add the latest one to finalAttendance
  const processResponses = () => {
    const responseMap: Record<string, AttendanceResponse[]> = {};

    tempResponses.forEach((response) => {
      const key = `${response.matric}`;
      if (!responseMap[key]) {
        responseMap[key] = [];
      }
      responseMap[key].push(response);
    });

    Object.values(responseMap).forEach((responses) => {
      if (responses.length >= 3) {
        const latestResponse = responses.reduce((latest, current) =>
          new Date(current.time) > new Date(latest.time) ? current : latest
        );

        setFinalAttendance((prevAttendance) => {
          // Check if the student is already in the finalAttendance
          const existingIndex = prevAttendance.findIndex(
            (entry) => entry.matric === latestResponse.matric
          );

          if (existingIndex !== -1) {
            // If the student already exists, replace with the latest entry
            const updatedAttendance = [...prevAttendance];
            updatedAttendance[existingIndex] = latestResponse;
            return updatedAttendance;
          } else {
            // Otherwise, add the new entry
            return [...prevAttendance, latestResponse];
          }
        });

        alert("Attendance capturing successful");
        setTempResponses([]); // Clear tempResponses
      }
    });
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

    console.log("Attendance data:", attendanceData);
    try {
      const response = await api.post("/save-attendance/", attendanceData);
      console.log("Attendance submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay></video>
      <button onClick={startVideoStream}>Start Video</button>
      <button onClick={stopVideoStream}>Stop Video</button>
      <button onClick={submitAttendance}>Submit Attendance</button>
    </div>
  );
};

export default VideoStream;

 */
