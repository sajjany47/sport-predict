import React from "react";

interface CustomLoaderProps {
  message?: string;
}
const CustomLoader: React.FC<CustomLoaderProps> = ({ message }) => {
  console.log(message, "message");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}...</p>
      </div>
    </div>
  );
};

export default CustomLoader;
