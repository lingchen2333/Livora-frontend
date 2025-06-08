import React from "react";

const LoadSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#537D5D]"></div>
    </div>
  );
};

export default LoadSpinner;
