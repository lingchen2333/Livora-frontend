import React, { useState, useEffect } from "react";
import { api } from "../service/api";

const ProductImage = ({ imageId, nextImageId }) => {
  const [productImg, setProductImg] = useState(null);
  const [nextImg, setNextImg] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch both images in parallel
        const [mainResponse, nextResponse] = await Promise.all([
          api.get(`/images/${imageId}`, { responseType: "blob" }),
          nextImageId
            ? api.get(`/images/${nextImageId}`, { responseType: "blob" })
            : null,
        ]);

        // Convert main image
        const mainReader = new FileReader();
        mainReader.onloadend = () => {
          setProductImg(mainReader.result);
        };
        mainReader.readAsDataURL(mainResponse.data);

        // Convert next image if it exists
        if (nextResponse) {
          const nextReader = new FileReader();
          nextReader.onloadend = () => {
            setNextImg(nextReader.result);
          };
          nextReader.readAsDataURL(nextResponse.data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (imageId) {
      fetchImages();
    }
  }, [imageId, nextImageId]);

  if (!productImg) {
    return (
      <div className="image-container">
        <div className="image-placeholder" />
      </div>
    );
  }

  return (
    <div
      className="image-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={isHovered && nextImg ? nextImg : productImg}
        alt="Product Image"
      />
    </div>
  );
};

export default ProductImage;
