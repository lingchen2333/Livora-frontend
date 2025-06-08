import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCartByUserId,
  updateItemQuantity,
  removeItem,
} from "../../store/features/cartSlice";
import { Link } from "react-router-dom";
import QuantityUpdater from "../utils/QuantityUpdater";
import LoadSpinner from "../common/LoadSpinner";
import { ToastContainer, toast } from "react-toastify";
import { FaTrash, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import ProductImageThumbnail from "../utils/ProductImageThumbnail";

const Cart = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, items, totalAmount, isLoading } = useSelector(
    (state) => state.cart
  );
  const successMessage = useSelector((state) => state.order.successMessage);

  useEffect(() => {
    dispatch(getCartByUserId(userId));
  }, [dispatch, userId]);

  const handleQuantityIncrease = (item) => {
    if (item.quantity < item.product.inventory) {
      dispatch(
        updateItemQuantity({
          cartId: id,
          itemId: item.id,
          newQuantity: item.quantity + 1,
        })
      );
    }
  };

  const handleQuantityDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateItemQuantity({
          cartId: id,
          itemId: item.id,
          newQuantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemoveItem = (productId) => {
    try {
      dispatch(removeItem({ cartId: id, productId }));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length > 0) {
      navigate(`/users/${userId}/checkout`);
    } else {
      toast.error("Please add items to your cart first");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {Array.isArray(items) && items.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#537D5D]/10 mb-4">
              <FaShoppingBag className="w-8 h-8 text-[#537D5D]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-[#537D5D] text-white rounded-full hover:bg-[#4A6F52] transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <Link
                to="/products"
                className="inline-flex items-center text-[#537D5D] hover:text-[#4A6F52] transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-200">
                <div className="col-span-3 text-sm font-medium text-gray-500">
                  Product
                </div>
                <div className="col-span-2 text-sm font-medium text-gray-500">
                  Brand
                </div>
                <div className="col-span-2 text-sm font-medium text-gray-500">
                  Price
                </div>
                <div className="col-span-2 text-sm font-medium text-gray-500">
                  Quantity
                </div>
                <div className="col-span-2 text-sm font-medium text-gray-500">
                  Total
                </div>
                <div className="col-span-1 text-sm font-medium text-gray-500">
                  Action
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {Array.isArray(items) &&
                  items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="col-span-3">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden">
                            {item.product.images.length > 0 && (
                              <ProductImageThumbnail
                                imageId={item.product.images[0].id}
                              />
                            )}
                          </div>
                          <span className="text-gray-900 font-medium">
                            {item.product.name}
                          </span>
                        </Link>
                      </div>
                      <div className="col-span-2 text-gray-600">
                        {item.product.brand}
                      </div>
                      <div className="col-span-2 text-gray-900">
                        £{item.product.price.toFixed(2)}
                      </div>
                      <div className="col-span-2">
                        <QuantityUpdater
                          quantity={item.quantity}
                          onDecrease={() => handleQuantityDecrease(item)}
                          onIncrease={() => handleQuantityIncrease(item)}
                        />
                      </div>
                      <div className="col-span-2 text-gray-900 font-medium">
                        £{item.totalPrice.toFixed(2)}
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium text-gray-900">
                    Total: £{totalAmount.toFixed(2)}
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="px-8 py-3 bg-[#537D5D] text-white rounded-full hover:bg-[#4A6F52] transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
