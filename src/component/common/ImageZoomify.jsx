import React, { useState, useEffect } from "react";
import ImageZoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ImageZoomify = ({ imageId }) => {
  const [productImg, setProductImg] = useState(null);

  useEffect(() => {
    const fetchProductImage = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:9090/api/v1/images/${id}`
        );
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImg(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (imageId) {
      fetchProductImage(imageId);
    }
  }, [imageId]);

  if (!productImg) return null;

  return (
    <div className="product-image-wrapper">
      <ImageZoom>
        <img
          src={productImg}
          alt="Product image"
          className="product-detail-image"
        />
      </ImageZoom>
    </div>
  );
};

export default ImageZoomify;
