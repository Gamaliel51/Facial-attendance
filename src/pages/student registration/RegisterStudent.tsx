import React, { useRef, useState } from "react";
import axios from "axios";

interface StudentData {
  studentName: string;
  studentMatric: string;
  video: string;
}

const RegisterStudent = () => {
  // Student form data state
  const [formData, setFormData] = useState<StudentData>({
    studentName: "",
    studentMatric: "",
    video: "",
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraMode, setCameraMode] = useState<"user" | "environment">("user"); // Front/Back camera control

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);

  // Form input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Start recording
  const handleStartRecording = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraMode },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      const recorder = new MediaRecorder(newStream);
      let chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        if (previewRef.current) {
          previewRef.current.src = URL.createObjectURL(blob);
          previewRef.current.play();
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setStream(newStream);
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
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Switch camera
  const handleSwitchCamera = () => {
    setCameraMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  // Convert Blob to Base64 string
  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordedBlob) {
      alert("Please record a video for facial recognition.");
      return;
    }

    // Convert video Blob to Base64 string
    const videoBase64 = await convertBlobToBase64(recordedBlob);

    // Combine form data with video
    const payload = {
      ...formData,
      video: videoBase64,
    };

    // Log data for testing
    console.log("Payload to be sent:", payload);

    // In a real-world scenario, this is where you'd send data to the backend
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-3xl font-semibold mb-6">Register Student</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            className="border p-3 mt-1 block w-full rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Matric No</label>
          <input
            type="text"
            name="studentMatric"
            value={formData.studentMatric}
            onChange={handleInputChange}
            className="border p-3 mt-1 block w-full rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Instructions for facial attendance */}
        <div className="bg-blue-100 p-4 rounded-md mb-6">
          <h3 className="text-xl font-bold">Instructions for Video Capture:</h3>
          <ul className="list-disc ml-5 mt-2 text-sm">
            <li>Ensure your face is clearly visible in the frame.</li>
            <li>Use a well-lit environment to capture a clear video.</li>
            <li>Avoid any distractions in the background.</li>
            <li>Remain still and look directly at the camera for a few seconds.</li>
          </ul>
        </div>

        {/* Video capture section */}
        <div className="flex flex-col items-center gap-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-64 bg-black rounded-md"
          />

          <video ref={previewRef} controls className="w-full h-64 bg-black rounded-md" />

          <div className="flex gap-4">
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Stop Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRecording}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Start Recording
              </button>
            )}
            {!isRecording && (
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md"
              >
                Switch Camera
              </button>
            )}
          </div>
        </div>

        {/* Submit form button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-md"
            disabled={!recordedBlob}
          >
            Register Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterStudent;
