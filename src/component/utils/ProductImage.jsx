import React, { useState, useEffect } from "react";
import { api } from "../service/api";
import LoadSpinner from "../common/LoadSpinner";

const ProductImage = ({ imageId, nextImageId }) => {
  const [productImg, setProductImg] = useState(null);
  const [nextImg, setNextImg] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        // Fetch both images in parallel with proper caching headers
        const [mainResponse, nextResponse] = await Promise.all([
          api.get(`/images/${imageId}`, {
            responseType: "blob",
            headers: {
              "Cache-Control": "max-age=31536000",
              Accept: "image/webp,image/avif,image/*",
            },
          }),
          nextImageId
            ? api.get(`/images/${nextImageId}`, {
                responseType: "blob",
                headers: {
                  "Cache-Control": "max-age=31536000",
                  Accept: "image/webp,image/avif,image/*",
                },
              })
            : null,
        ]);

        // Create object URLs for better performance
        const mainUrl = URL.createObjectURL(mainResponse.data);
        setProductImg(mainUrl);

        if (nextResponse) {
          const nextUrl = URL.createObjectURL(nextResponse.data);
          setNextImg(nextUrl);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (imageId) {
      fetchImages();
    }

    // Cleanup object URLs when component unmounts or images change
    return () => {
      if (productImg) URL.revokeObjectURL(productImg);
      if (nextImg) URL.revokeObjectURL(nextImg);
    };
  }, [imageId, nextImageId]);

  if (isLoading) {
    return (
      <div className="image-container">
        <div className="image-placeholder animate-pulse bg-gray-200" />
      </div>
    );
  }

  if (!productImg) {
    return <LoadSpinner />;
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
        width={300}
        height={300}
        loading="lazy"
        decoding="async"
        className="transition-opacity duration-300"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};

export default ProductImage;
