import React, { useState, useRef } from "react";
import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";
import { uploadImages } from "../../store/features/imageSlice";
import { BsPlus, BsDash } from "react-icons/bs";
import { toast } from "react-toastify";

const ImageUploader = ({ productId }) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
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

  return (
    <form onSubmit={handleImageUpload}>
      <div className="mt-4">
        <h5>Upload Product Images</h5>

        <div className="mb-3">
          <label className="btn btn-outline-primary">
            <BsPlus className="icon" /> Add Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddImages}
              className="d-none"
              ref={fileInputRef}
            />
          </label>
        </div>

        <div className="mb-2 mt-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="d-flex align-items-center mb-2 p-2 border rounded"
            >
              <div className="flex-grow-1">
                <span
                  className="text-truncate d-inline-block"
                  style={{ maxWidth: "300px" }}
                  title={image.name}
                >
                  {image.name}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm ms-2"
                onClick={() => handleRemoveImage(image.id)}
              >
                <BsDash />
              </button>
            </div>
          ))}
        </div>

        {images.length > 0 && (
          <button type="submit" className="btn btn-primary btn-sm">
            Upload {images.length} Image{images.length > 1 ? "s" : ""}
          </button>
        )}
      </div>
    </form>
  );
};

export default ImageUploader;
