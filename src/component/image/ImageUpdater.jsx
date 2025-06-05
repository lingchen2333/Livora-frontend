import React, { useRef, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { uploadImages, updateImageById } from "../../store/features/imageSlice";
import { toast } from "react-toastify";

const ImageUpdater = ({
  show,
  handleClose,
  selectedImageId,
  selectedImage,
  productId,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImagePreview(selectedImage.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageAction = async () => {
    if (!selectedFile) {
      toast.warn("Please select an image.");
      return;
    }
    try {
      let result;
      if (selectedImageId) {
        result = await dispatch(
          updateImageById({ imageId: selectedImageId, file: selectedFile })
        ).unwrap();
      } else {
        result = await dispatch(
          uploadImages({ productId, files: [selectedFile] })
        ).unwrap();
      }
      toast.success(result.message);
      handleClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton style={{ backgroundColor: "whitesmoke" }}>
        <Modal.Title>
          {selectedImageId ? "Update Product Image" : "Add Product Image"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>
            {selectedImageId
              ? "Select a new image to replace the current one:"
              : "Select the image to be added:"}
          </p>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="image-preview-container">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Image Preview"
                className="img-fluid image-preview"
              />
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "whitesmoke" }}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="secondary" onClick={handleImageAction}>
          {selectedImageId ? "Save Changes" : "Upload Image"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageUpdater;
