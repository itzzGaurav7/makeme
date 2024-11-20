"use client";

import * as React from "react";

export default function PhotoSelectBox() {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [isCameraActive, setIsCameraActive] = React.useState<boolean>(false);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file)); 
    }
  };

  // Open file input dialog
  const handleImageSelect = () => {
    document.getElementById("file-input")?.click();
  };

  // Activate camera
  const handleCaptureClick = () => {
    setIsCameraActive(true);
  };

  // Stop the camera stream
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

  // Handle capture from the camera
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

  // Handle image submission using XMLHttpRequest
  const handleSubmitImage = () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${apiUrl}/api/ocr`, true);

      // Set up the request
      xhr.setRequestHeader("Content-Type", "multipart/form-data");

      // Set up the callback for when the request finishes
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Image uploaded successfully:", xhr.responseText);
        } else {
          console.error("Error in submitting image:", xhr.statusText);
        }
      };

      // Set up the callback for when the request fails
      xhr.onerror = function () {
        console.error("Request failed:", xhr.statusText);
      };

      // Send the FormData
      xhr.send(formData);
    }
  };

  // Start camera if active
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
    <div>
      <div
        className="w-64 h-32 border-dashed border-2 border-gray-400 flex items-center justify-center cursor-pointer"
        onClick={handleImageSelect}
      >
        {selectedImage ? (
          <span className="text-sm text-gray-600">{selectedImage.name}</span>
        ) : (
          <span className="text-gray-600">Click to select a photo</span>
        )}
      </div>

      <input
        id="file-input"
        type="file"
        accept=".png,.jpg,.jpeg,.heif,.heic"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mt-4">
        <button
          onClick={handleCaptureClick}
          className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600"
        >
          Open Camera
        </button>

        {isCameraActive && (
          <div className="relative mt-4">
            <video
              id="video"
              width="320"
              height="240"
              autoPlay
              className="border-2 border-gray-400"
            />
            <button
              onClick={handleStopCamera}
              className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white px-3 py-1 rounded-md"
            >
              Stop Camera
            </button>
            <form
              onSubmit={handleCapture}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4"
            >
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Capture Photo
              </button>
            </form>
          </div>
        )}
      </div>

      {imageUrl && (
        <img src={imageUrl} alt="Selected or Captured" className="mt-4 w-32 h-32 object-cover" />
      )}

      <button
        onClick={handleSubmitImage}
        disabled={!selectedImage}
        className={`mt-4 px-4 py-2 rounded-md ${!selectedImage ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        Submit
      </button>
    </div>
  );
}
