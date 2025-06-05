import React, { useState, useEffect } from "react";
import { api } from "../service/api";

const ProductImageThumbnail = ({ imageId }) => {
  const [productImg, setProductImg] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch both images in parallel
        const response = await api.get(`/images/${imageId}`, {
          responseType: "blob",
        });

        // Convert image
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImg(reader.result);
        };
        reader.readAsDataURL(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (imageId) {
      fetchImages();
    }
  }, [imageId]);

  if (!productImg) {
    return (
      <div className="image-container">
        <div className="image-placeholder" />
      </div>
    );
  }

  return <img src={productImg} alt="Product image" />;
};

export default ProductImageThumbnail;
