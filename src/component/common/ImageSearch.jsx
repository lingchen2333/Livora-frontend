import React, { useState, useRef } from "react";
import {
  searchByImage,
  setImageSearchResult,
} from "../../store/features/searchSlice";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

const ImageSearch = () => {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSearch = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        fileInputRef.current.value = "";
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PNG, JPG, JPEG or WEBP image only");
        fileInputRef.current.value = "";
        return;
      }

      setLoading(true);
      setNoResultFound(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      try {
        const response = await dispatch(searchByImage(file)).unwrap();
        if (response.data.length === 0) {
          setNoResultFound(true);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearImageSearch = () => {
    setImagePreview(null);
    dispatch(setImageSearchResult([]));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setNoResultFound(false);
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-xl text-gray-900 mb-3">Image</h2>
      <p className="text-xs text-gray-500 mb-4">
        Upload PNG, JPG, JPEG or WEBP image (MAX. 10MB)
      </p>
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleImageSearch}
          disabled={loading}
          className="w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-medium
            file:bg-[#537D5D] file:text-white
            hover:file:bg-[#537D5D]/90
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {loading && (
          <div className="flex justify-center items-center py-4">
            <ClipLoader color="#537D5D" size={30} />
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        )}
        {noResultFound && !loading && (
          <div className="text-center py-4 text-gray-600 bg-gray-50 rounded-lg">
            No matching products found. Please try a different image.
          </div>
        )}
        {imagePreview && !loading && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              onClick={handleClearImageSearch}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSearch;
