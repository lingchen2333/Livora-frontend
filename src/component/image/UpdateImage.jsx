import React from "react";
import { FaTimes } from "react-icons/fa";
import ImageUploader from "../common/ImageUploader";

const UpdateImage = ({ show, handleClose, selectedImageId, productId }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-200 opacity-50"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className=" bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedImageId ? "Update Image" : "Add New Image"}
              </h3>
              <button
                onClick={handleClose}
                className="z-10 text-gray-400 hover:text-gray-500 focus:outline-none "
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <ImageUploader
              productId={productId}
              selectedImageId={selectedImageId}
              handleClose={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateImage;
