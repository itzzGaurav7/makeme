"use client";

import * as React from "react";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";

export default function PhotoSelectBox() {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [isCameraActive, setIsCameraActive] = React.useState<boolean>(false);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file)); 
    }
  };

  const handleImageSelect = () => {
    document.getElementById("file-input")?.click();
  };

  const handleCaptureClick = () => {
    setIsCameraActive(true);
  };

  const handleStopCamera = () => {
    setIsCameraActive(false);
    const video = document.getElementById("video") as HTMLVideoElement;
    if (video) {
      const stream = video.srcObject as MediaStream;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const handleCapture = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const canvas = document.createElement("canvas");
    const video = document.getElementById("video") as HTMLVideoElement;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-photo.png", { type: "image/png" });
          setSelectedImage(file);
          setImageUrl(URL.createObjectURL(file));
        }
      });
    }
  };

  const handleSubmitImage = () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${apiUrl}/api/ocr`, true);

      xhr.setRequestHeader("Content-Type", "multipart/form-data");

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Image uploaded successfully:", xhr.responseText);
        } else {
          console.error("Error in submitting image:", xhr.statusText);
        }
      };

      xhr.onerror = function () {
        console.error("Request failed:", xhr.statusText);
      };

      xhr.send(formData);
    }
  };

  React.useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video = document.getElementById("video") as HTMLVideoElement;
          if (video) {
            video.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
        });
    }
  }, [isCameraActive]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
      <div 
        className="w-full h-48 border-dashed border-2 border-indigo-300 dark:border-indigo-700
        flex items-center justify-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-800
        transition-colors duration-300 relative"
        onClick={handleImageSelect}
      >
        {selectedImage ? (
          <>
            <img 
              src={imageUrl || undefined} 
              alt="Selected" 
              className="max-w-full max-h-full object-contain" 
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
                setImageUrl(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-indigo-600 dark:text-indigo-400">
            <ImageIcon size={48} />
            <span className="mt-2 text-sm dark:text-gray-300">Click to select a photo</span>
          </div>
        )}
      </div>

      <input
        id="file-input"
        type="file"
        accept=".png,.jpg,.jpeg,.heif,.heic"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleCaptureClick}
          className="flex-1 flex items-center justify-center px-4 py-2 
          bg-green-500 text-white rounded-md hover:bg-green-600 
          transition-colors duration-300"
        >
          <Camera size={20} className="mr-2" /> Open Camera
        </button>
      </div>

      {isCameraActive && (
        <div className="relative mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <video
            id="video"
            width="100%"
            autoPlay
            className="w-full"
          />
          <div className="absolute top-0 right-0 p-2 flex space-x-2">
            <button
              onClick={handleStopCamera}
              className="bg-red-500 text-white px-3 py-1 rounded-md 
              hover:bg-red-600 transition-colors duration-300 flex items-center"
            >
              <X size={16} className="mr-1" /> Close
            </button>
          </div>
          <form
            onSubmit={handleCapture}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4"
          >
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded-md 
              hover:bg-blue-600 transition-colors duration-300 flex items-center"
            >
              <Camera size={20} className="mr-2" /> Capture
            </button>
          </form>
        </div>
      )}

      <button
        onClick={handleSubmitImage}
        disabled={!selectedImage}
        className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md 
        transition-colors duration-300 
        ${!selectedImage 
          ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400" 
          : "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600"}`}
      >
        <Upload size={20} className="mr-2" /> Submit Image
      </button>
    </div>
  );
}