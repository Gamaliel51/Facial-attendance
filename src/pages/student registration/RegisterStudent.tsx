// import { useState, useRef, useEffect } from "react";
// import api from "../../api/api";
// import Spinner from "../../components/spinner/Spinner";

// const FacialRegPage = () => {

//   const [error, setError] = useState("");
//   const [name, setName] = useState("");
//   const [matric, setMatric] = useState("");
//   const [recordedVideo, setRecordedVideo] = useState<any>(null);
//   const [isrecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [videoDuration, setVideoDuration] = useState<number>(0);

//   const chunks = useRef<any>([]);
//   const videoRef = useRef<any>(null);

//   const Link_id = window.location.pathname.split("/")[2];

//   useEffect(() => {
//     if (!submitSuccess) {
//       const video = videoRef.current;
//       if (isrecording) {
//         video.srcObject = mediaRecorder
//           ? new MediaStream(mediaRecorder.stream.getTracks())
//           : null;
//       } else {
//         video.srcObject = null;
//         if (recordedVideo) {
//           video.src = recordedVideo;
//           video.play();
//         }
//       }
//     }
//   }, [isrecording, mediaRecorder, recordedVideo, submitSuccess]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 1280, height: 720 },
//         audio: true,
//       });
//       const options = { mimeType: "video/mp4" };
//       const newMediaRecorder = new MediaRecorder(stream, options);

//       newMediaRecorder.ondataavailable = (event) => {
//         if (event.data && event.data.size > 0) {
//           chunks.current.push(event.data);
//         }
//       };

//       newMediaRecorder.onstop = () => {
//         const blob = new Blob(chunks.current, { type: "video/mp4" });
//         const videoUrl = URL.createObjectURL(blob);
//         setRecordedVideo(videoUrl);
//         chunks.current = [];

//         // Calculate video duration
//         const videoElement = document.createElement("video");
//         videoElement.src = videoUrl;
//         videoElement.onloadedmetadata = () => {
//           const duration = videoElement.duration;
//           setVideoDuration(duration);
//           if (duration > 3) {
//             setError(
//               "Video is longer than 3 seconds. Please record a shorter video."
//             );
//             setLoading(false);
//             setRecordedVideo(null);
//           } else {
//             setError("");
//           }
//         };
//       };

//       newMediaRecorder.start();
//       setMediaRecorder(newMediaRecorder);
//       setIsRecording(true);
//       setError(""); // Clear any existing error messages
//     } catch (err) {
//       setError("Failed to access camera and microphone.");
//     }
//   };

//   const stopRecording = async () => {
//     if (mediaRecorder) {
//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks.current, { type: "video/mp4" });
//         const videoUrl = URL.createObjectURL(blob);
//         setRecordedVideo(videoUrl);
//         chunks.current = [];
//       };
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (name === "" || matric === "" || !recordedVideo) {
//       setError("Please enter your name and matric number and record video");
//       return;
//     }
//     if (videoDuration > 3) {
//       setError(
//         "Video is longer than 3 seconds. Please record a shorter video."
//       );
//       return;
//     }
//     try {
//       if (recordedVideo) {
//         setLoading(true);
//         const blob = await fetch(recordedVideo).then((res) => res.blob());
//         const file = new File([blob], `${name}.mp4`, { type: "video/mp4" });
//         const formData = new FormData();
//         formData.append("video", file);
//         formData.append("name", name);
//         formData.append("matric", matric);

//         const response = await api.post(
//           `/register-studnt/${Link_id}/`,
//           formData
//         );

//         if (response.status === 200 || 201) {
//           setSubmitSuccess(true);
//         }
//       }
//     } catch (err) {
//       setLoading(false);
//       setError("Submission failed. Please try again.");
//     }
//   };

//   // NOTE: finish confirmation part for submission

//   if (loading && submitSuccess) {
//     return (
//       <div className="min-h-screen w-full flex flex-col justify-center bg-blue-100">
//         <div className="min-h-[50vh] w-2/5 mx-auto flex flex-col items-center justify-center rounded-3xl shadow-2xl bg-white">
//           <p className="text-3xl font-semibold text-green-400">
//             Facial Regristration success
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full flex flex-col justify-center bg-blue-100">
//       <div className="min-h-[90vh] w-4/5 mx-auto flex flex-col rounded-3xl shadow-2xl bg-white">
//         <h1 className="w-full text-center my-4 text-3xl font-bold">
//           Student Registration
//         </h1>
//         <div className="flex">
//           <input
//             className="w-2/5 mx-auto px-4 py-2 rounded-xl bg-blue-100"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter Your Name"
//             type="text"
//           />
//           <input
//             className="w-2/5 mx-auto px-4 py-2 rounded-xl bg-blue-100"
//             value={matric}
//             onChange={(e) => setMatric(e.target.value)}
//             placeholder="Enter Your Matric Number"
//             type="text"
//           />
//         </div>

//         <div className="h-fit w-fit mx-auto flex flex-row">
//           <div className="h-[70vh] w-9/12 mx-20 my-10 flex flex-col justify-between bg-black">
//             <video
//               ref={videoRef}
//               controls
//               autoPlay
//               className="h-full w-full bg-black"
//             ></video>
//           </div>
//           <div className="h-[50vh] w-1/12 my-auto pr-20 flex flex-col items-center justify-evenly">
//             <p className="text-xl font-semibold">
//               {!isrecording ? "Idle" : "Recording"}
//             </p>
//             <button
//               className="h-20 w-20 font-bold rounded-full text-center bg-green-400 hover:bg-green-500"
//               onClick={startRecording}
//             >
//               Start
//             </button>
//             <button
//               className="h-20 w-20 font-bold rounded-full text-center bg-red-300 hover:bg-red-400"
//               onClick={stopRecording}
//             >
//               Stop
//             </button>
//             <button
//               className="h-20 w-20 font-bold rounded-full text-center bg-blue-100 hover:bg-blue-300"
//               onClick={handleSubmit}
//               disabled={loading || !recordedVideo || videoDuration > 3}
//             >
//             {loading ? <Spinner size="2rem" color="#894a8b" duration="1s" /> : "Submit"}
//             </button>
//           </div>
//         </div>
//         <p className="w-full text-center text-sm text-red-500">{error}</p>

//         <p className="w-full text-center text-sm italic pb-6">
//           Record face while facing straight for 2-3 seconds only
//         </p>
//       </div>
//     </div>
//   );
// };

// export default FacialRegPage;

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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
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
      setError("Failed to access camera and microphone.");
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-gray-700 text-center">
          Student Registration
        </h1>
        <h1 className="text-xl font-medium text-gray-700 underline">
          {course_code}
        </h1>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700">Your Name</label>
            <input
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Matric Number</label>
            <input
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border rounded-md"
              value={matric}
              onChange={(e) => setMatric(e.target.value)}
              placeholder="Enter Your Matric Number"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Department</label>
            <input
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border rounded-md"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter Your Department"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Level</label>
            <input
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border rounded-md"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Enter Your Level"
              type="text"
            />
          </div>
        </div>

        <div className="relative w-full h-64 bg-gray-100 rounded-lg mt-6 overflow-hidden">
          <video
            ref={videoRef}
            controls
            autoPlay
            className="w-full h-full object-cover"
          ></video>
          <div className="absolute inset-0 flex items-center justify-center">
            {!isrecording && !recordedVideo && (
              <p className="text-gray-500">Video preview will appear here</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="w-32 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={startRecording}
            disabled={isrecording}
          >
            {isrecording ? "Recording..." : "Start Recording"}
          </button>
          <button
            className="w-32 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={stopRecording}
            disabled={!isrecording}
          >
            Stop Recording
          </button>
          <button
            className={`w-32 py-2 ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } rounded-lg`}
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

        <p className="text-red-500 text-sm text-center mt-4">{error}</p>

        <p className="text-gray-500 text-center text-xs italic">
          Record face while facing straight for 2-3 seconds only
        </p>
      </div>
    </div>
  );
};

export default FacialRegPage;
