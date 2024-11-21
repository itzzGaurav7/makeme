import * as React from "react";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useDataContext } from "../Context/DataContext";

export default function PhotoSelectBox() {
  const { apiUrl, selectedImage, setSelectedImage, imageUrl, setImageUrl } =
    useDataContext();

  const [cameraError, setCameraError] = React.useState<string | null>(null);

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

  // Handle image submission using XMLHttpRequest
  const handleSubmitImage = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const response = await fetch(`${apiUrl}/api/ocr`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Image uploaded successfully:", responseData);
        } else {
          console.error("Error in submitting image:", response.statusText);
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    }
  };

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
            <span className="mt-2 text-sm dark:text-gray-300">
              Click to select a photo
            </span>
          </div>
        )}
      </div>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        capture="environment" // This is the key to trigger the camera on mobile
      />

      <div className="flex space-x-4 mt-4">
        {/* This button can be removed as we no longer need to manually open the camera */}
        <button
          onClick={handleImageSelect}
          className="flex-1 flex items-center justify-center px-4 py-2 
          bg-green-500 text-white rounded-md hover:bg-green-600 
          transition-colors duration-300"
        >
          <Camera size={20} className="mr-2" /> Open Camera
        </button>
      </div>

      {/* Show error message if camera access fails */}
      {cameraError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {cameraError}
        </div>
      )}

      <button
        onClick={handleSubmitImage}
        disabled={!selectedImage}
        className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md 
        transition-colors duration-300 
        ${
          !selectedImage
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
            : "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600"
        }`}
      >
        <Upload size={20} className="mr-2" /> Submit Image
      </button>
    </div>
  );
}
