// @ts-ignore
import { useState, useRef, useEffect } from "react";
import api from "../../api/api";
import Spinner from "../../components/spinner/Spinner";

const FacialRegPage = () => {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [matric, setMatric] = useState("");
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [recordedVideo, setRecordedVideo] = useState<any>(null);
  const [isrecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [frontCamera, setFrontCamera] = useState(true); // For camera flip

  const chunks = useRef<any>([]);
  const videoRef = useRef<any>(null);

  const Link_id = window.location.pathname.split("/")[2];
  const course_code = Link_id.split("_")[0].replace("%20", "");
  useEffect(() => {
    if (!submitSuccess) {
      const video = videoRef.current;
      if (isrecording) {
        video.srcObject = mediaRecorder
          ? new MediaStream(mediaRecorder.stream.getTracks())
          : null;
      } else {
        video.srcObject = null;
        if (recordedVideo) {
          video.src = recordedVideo;
          video.play();
        }
      }
    }
  }, [isrecording, mediaRecorder, recordedVideo, submitSuccess]);

  const startRecording = async () => {
    try {
      // Stop any previous streams
      if (mediaRecorder) {
        mediaRecorder.stream
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: frontCamera ? "user" : "environment" },
        // audio: true,
      });

      const options = { mimeType: "video/mp4" };
      const newMediaRecorder = new MediaRecorder(stream, options);

      newMediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      newMediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        chunks.current = [];

        // Calculate video duration
        const videoElement = document.createElement("video");
        videoElement.src = videoUrl;
        videoElement.onloadedmetadata = () => {
          const duration = videoElement.duration;
          setVideoDuration(duration);
          if (duration > 3) {
            setError(
              "Video is longer than 3 seconds. Please record a shorter video."
            );
            setLoading(false);
            setRecordedVideo(null);
          } else {
            setError("");
          }
        };
      };

      newMediaRecorder.start();
      setMediaRecorder(newMediaRecorder);
      setIsRecording(true);
      setError(""); // Clear any existing error messages
    } catch (err) {
      setError("Failed to access camera.");
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        chunks.current = [];
      };
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleFlipCamera = async () => {
    if (isrecording) {
      // Stop the current recording before flipping
      stopRecording();
    }

    // Toggle the camera
    setFrontCamera(!frontCamera);

    // Restart recording with the new camera
    setTimeout(() => {
      startRecording();
    }, 500); // Adding a slight delay to allow time for the stream to reset
  };

  // const handleFlipCamera = async () => {
  //   if (mediaRecorder && isrecording) {
  //     stopRecording();
  //   }

  // };

  const handleSubmit = async () => {
    if (name === "" || matric === "" || !recordedVideo) {
      setError("Please enter your name and matric number and record video");
      return;
    }
    if (videoDuration > 3) {
      setError(
        "Video is longer than 3 seconds. Please record a shorter video."
      );
      return;
    }
    try {
      if (recordedVideo) {
        setLoading(true);
        const blob = await fetch(recordedVideo).then((res) => res.blob());
        const file = new File([blob], `${name}.mp4`, { type: "video/mp4" });
        const formData = new FormData();
        formData.append("video", file);
        formData.append("name", name);
        formData.append("matric", matric);
        formData.append("level", level);
        formData.append("department", department);

        const response = await api.post(
          `/register-studnt/${Link_id}/`,
          formData
        );
        setTimeout(() => {
          setError("Still sending data, please wait...");
        }, 15000);
        if (response.status === 200 || 201) {
          setSubmitSuccess(true);
        }
      }
    } catch (err) {
      setLoading(false);
      setError("Submission failed. Please try again.");
    }
  };

  if (loading && submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
          <p className="text-2xl font-semibold text-green-500 text-center">
            Facial Registration Success
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 space-y-8">
        <h1 className="text-4xl font-semibold text-gray-800 text-center">
          Student Facial Registration
        </h1>

        <h2 className="text-2xl text-gray-600 font-medium text-center">
          {course_code}
        </h2>

        <form className="space-y-6">
          {/* Name Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-lg bg-gray-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Matric Number Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Matric Number
            </label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-lg bg-gray-50"
              value={matric}
              onChange={(e) => setMatric(e.target.value)}
              placeholder="Enter your matric number"
            />
          </div>

          {/* Department Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Department
            </label>
            <select
              className="mt-1 p-2 border rounded-lg bg-gray-50"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" disabled>
                Select your department
              </option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Business Administration">
                Business Administration
              </option>
              {/* Add more department options as needed */}
            </select>
          </div>

          {/* Level Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Level</label>
            <select
              className="mt-1 p-2 border rounded-lg bg-gray-50"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="" disabled>
                Select your level
              </option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="500">500 Level</option>
              {/* Add more level options as needed */}
            </select>
          </div>

          {/* Video Preview */}
          <div className="relative flex flex-col items-center mt-8">
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-60 md:h-72 bg-gray-200 rounded-lg"
            ></video>
            {!isrecording && !recordedVideo && (
              <p className="absolute inset-0 flex items-center justify-center text-gray-500">
                Video preview will appear here
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-center text-red-500 text-sm mt-4">{error}</p>
          )}

          {/* Button Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <button
              type="button"
              className={`py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 ${
                isrecording && "cursor-not-allowed opacity-50"
              }`}
              onClick={startRecording}
              disabled={isrecording}
            >
              {isrecording ? "Recording..." : "Start Recording"}
            </button>

            <button
              type="button"
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={stopRecording}
              disabled={!isrecording}
            >
              Stop Recording
            </button>

            <button
              type="button"
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleFlipCamera}
            >
              Flip Camera
            </button>

            <button
              type="button"
              className={`py-2 px-4 ${
                loading || !recordedVideo || videoDuration > 3
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-lg`}
              onClick={handleSubmit}
              disabled={loading || !recordedVideo || videoDuration > 3}
            >
              {loading ? (
                <Spinner size="2rem" color="#894a8b" duration="1s" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>

        {/* Note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Please record a video of your face for 2-3 seconds facing straight.
        </p>
      </div>
    </div>
  );
};

export default FacialRegPage;
