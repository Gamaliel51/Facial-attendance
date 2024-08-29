import axios from "axios";
import React, { useRef, useState } from "react";

type Props = {};

const RecordAttendance = (props: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraMode, setCameraMode] = useState<"user" | "environment">("user"); // Controls front/back camera
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);

  // Start recording
  const handleStartRecording = async () => {
    try {
      // Get access to user's camera (front or back)
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraMode },
        audio: true,
      });

      // Set up the video stream for display
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      // Create a MediaRecorder instance
      const recorder = new MediaRecorder(newStream);
      let chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        // Create a Blob from the recorded chunks and set it for preview
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        if (previewRef.current) {
          previewRef.current.src = URL.createObjectURL(blob);
          previewRef.current.play();
        }
      };

      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      setStream(newStream); // Store the stream to stop it later
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    // Stop all tracks from the stream (camera and mic)
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Switch camera between front and back
  const handleSwitchCamera = () => {
    setCameraMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  // Send the recorded video to the backend
  const handleSendToBackend = async () => {
    if (!recordedBlob) return;

    // Send the blob to the backend
    const formData = new FormData();
    formData.append("video", recordedBlob, "attendance-video.webm");

    try {
      await axios.post("http://localhost:5000/api/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Record Attendance</h2>

      <div className="flex flex-col items-center gap-4">
        {/* Live video feed */}
        <video ref={videoRef} autoPlay muted className="w-1/2 h-64 bg-black" />

        {/* Preview of recorded video */}
        <video ref={previewRef} controls className="w-1/2 h-64 bg-black" />

        <div className="mt-4">
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className="bg-red-500 text-white p-2 rounded"
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Start Recording
            </button>
          )}

          {/* Send to backend */}
          {recordedBlob && !isRecording && (
            <button
              onClick={handleSendToBackend}
              className="ml-4 bg-green-500 text-white p-2 rounded"
            >
              Send to Backend
            </button>
          )}

          {/* Switch Camera */}
          {!isRecording && (
            <button
              onClick={handleSwitchCamera}
              className="ml-4 bg-yellow-500 text-white p-2 rounded"
            >
              Switch Camera
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordAttendance;
