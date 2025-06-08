import React, { useState, useRef } from "react";
import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";
import { uploadImages } from "../../store/features/imageSlice";
import { FaTrash, FaCloudUploadAlt, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";

const ImageUploader = ({ productId }) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddImages = (files) => {
    if (files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        id: nanoid(),
        name: file.name,
        file,
      }));
      setImages([...images, ...newImages]);
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleRemoveImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (images.length > 0) {
      try {
        const result = await dispatch(
          uploadImages({ productId, files: images.map((image) => image.file) })
        ).unwrap();
        clearFileInputs();
        toast.success(result.message);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const clearFileInputs = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setImages([]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    const imageFiles = Array.from(droppedFiles).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length > 0) {
      handleAddImages(imageFiles);
    } else {
      toast.error("Please drop only image files");
    }
  };

  return (
    <form onSubmit={handleImageUpload} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Upload Product Images
        </h3>

        <div className="flex items-center justify-center w-full">
          <label
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
              isDragging
                ? "border-[#537D5D] bg-[#537D5D]/5"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaCloudUploadAlt
                className={`w-10 h-10 mb-3 ${
                  isDragging ? "text-[#537D5D]" : "text-gray-400"
                }`}
              />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG or JPEG (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleAddImages(e.target.files)}
              className="hidden"
              ref={fileInputRef}
            />
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <FaImage className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-gray-900 truncate"
                      title={image.name}
                    >
                      {image.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="inline-flex items-center p-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#537D5D] hover:bg-[#4A6F52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200"
            >
              <FaCloudUploadAlt className="mr-2" />
              Upload {images.length} Image{images.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ImageUploader;
