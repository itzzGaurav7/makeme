import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  apiUrl: string | undefined;
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  isCameraActive: boolean;
  setIsCameraActive: (isActive: boolean) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for selected image
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false); // State for camera
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State for image URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Fetch the API URL from the environment

  const value = {    
    apiUrl,            // Include apiUrl
    selectedImage,     // Include selectedImage state
    setSelectedImage,  // Include setSelectedImage function
    isCameraActive,    // Include isCameraActive state
    setIsCameraActive, // Include setIsCameraActive function
    imageUrl,          // Include imageUrl state
    setImageUrl,       // Include setImageUrl function
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
