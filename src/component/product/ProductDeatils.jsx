import React, { useEffect, useState } from "react";
import ImageZoomify from "../common/ImageZoomify";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../store/features/productSlice";
import QuantityUpdater from "../utils/QuantityUpdater";
import { FaShoppingCart } from "react-icons/fa";
import { addToCart } from "../../store/features/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import StockStatus from "../utils/StockStatus";
import ProductImageThumbnail from "../utils/ProductImageThumbnail";

const ProductDeatils = () => {
  const { productId } = useParams();
  const product = useSelector((state) => state.product.product);
  const { errorMessage } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(getProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImageId(product.images[0].id);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in first.");
      return;
    }

    try {
      const response = await dispatch(
        addToCart({ productId, quantity })
      ).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(errorMessage);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.inventory) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mt-4 mb-4">
      <ToastContainer />
      {product ? (
        <div className="row product-details">
          <div className="col-md-4 product-images-gallery">
            <div className="main-image-container">
              {selectedImageId && <ImageZoomify imageId={selectedImageId} />}
            </div>
            <div className="image-thumbnails">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className={`thumbnail ${
                    selectedImageId === img.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedImageId(img.id)}
                >
                  <ProductImageThumbnail imageId={img.id} />
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-8 details-container">
            <h1 className="product-name">{product.name}</h1>
            <h4 className="price">£{product.price}</h4>
            <p className="product-description">{product.description}</p>
            <p className="product-name">Brand: {product.brand}</p>
            <p className="product-name">
              Rating: <span className="rating">some stars</span>
            </p>
            <StockStatus inventory={product.inventory} />

            {product.inventory > 0 ? (
              <>
                <p>Quantity:</p>
                <QuantityUpdater
                  quantity={quantity}
                  onIncrease={handleIncreaseQuantity}
                  onDecrease={handleDecreaseQuantity}
                />
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart /> Add to cart
                  </button>
                  <button className="livora-button">Livora</button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <p>No product</p>
      )}
    </div>
  );
};

export default ProductDeatils;
