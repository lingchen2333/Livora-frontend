import React, { useState, useEffect } from "react";
import ImageZoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { api } from "../service/api";
import { ClipLoader } from "react-spinners";

const ImageZoomify = ({ imageId }) => {
  const [productImg, setProductImg] = useState(null);

  useEffect(() => {
    const fetchProductImage = async (id) => {
      try {
        const response = await api.get(`/images/${id}`, {
          responseType: "blob",
          headers: {
            "Cache-Control": "max-age=31536000",
            Accept: "image/webp,image/avif,image/*",
          },
        });
        const url = URL.createObjectURL(response.data);
        setProductImg(url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (imageId) {
      fetchProductImage(imageId);
    }
  }, [imageId]);

  if (!productImg)
    return (
      <div className="product-image-wrapper">
        <ClipLoader className="center" />
      </div>
    );

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
