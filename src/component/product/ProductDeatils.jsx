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
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      {product ? (
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
                {selectedImageId && <ImageZoomify imageId={selectedImageId} />}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                      selectedImageId === img.id
                        ? "border-[#537D5D]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImageId(img.id)}
                  >
                    <ProductImageThumbnail imageId={img.id} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-medium text-[#537D5D] mb-4">
                  £{product.price}
                </p>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Category:</span>{" "}
                    {product.category?.name}
                  </p>
                  <StockStatus inventory={product.inventory} />
                </div>
              </div>

              {product.inventory > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity:
                    </label>
                    <QuantityUpdater
                      quantity={quantity}
                      onIncrease={handleIncreaseQuantity}
                      onDecrease={handleDecreaseQuantity}
                    />
                  </div>
                  <button
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart className="text-lg" />
                    Add to cart
                  </button>
                </div>
              ) : (
                <p className="text-red-500 font-medium">Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No product found</p>
      )}
    </div>
  );
};

export default ProductDeatils;
