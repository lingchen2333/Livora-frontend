import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCartByUserId,
  updateItemQuantity,
  removeItem,
} from "../../store/features/cartSlice";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import QuantityUpdater from "../utils/QuantityUpdater";
import LoadSpinner from "../common/LoadSpinner";
import { ToastContainer, toast } from "react-toastify";

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
    // if (items.length > 0) {
    //   try {
    //     const result = await dispatch(placeOrder(userId)).unwrap();
    //     dispatch(clearCart());
    //     toast.success(result.message);
    //   } catch (error) {
    //     toast.error(error.message);
    //   }
    // } else {
    //   toast.error("Cart is empty");
    // }
  };

  //spinner when is loading
  if (isLoading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 p-5">
      <ToastContainer />
      {Array.isArray(items) && items.length === 0 ? (
        <h3 className="mb-4 cart-title">Your cart is empty</h3>
      ) : (
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between mb-4 fw-bold">
            <div className="col-2 text-center">Image</div>
            <div className="col-1 text-center">Name</div>
            <div className="col-2 text-center">Brand</div>
            <div className="col-2 text-center">Price</div>
            <div className="col-2 text-center">Quantity</div>
            <div className="col-2 text-center">Total Price</div>
            <div className="col-1 text-center">Action</div>
          </div>

          <hr className="mb-2 mt-2" />
          <h3 className="mb-4 cart-title">My Shopping Cart</h3>

          {Array.isArray(items) &&
            items.map((item, index) => (
              <Card key={index} className="mb-4">
                <Card.Body className="d-flex justify-content-between align-items-center shadow">
                  <div className="col-2 text-center">
                    <Link to={`/products/${item.product.id}`}>
                      <div className="cart-image-container">
                        {item.product.images.length > 0 && (
                          <ProductImageThumbnail
                            imageId={item.product.images[0].id}
                          />
                        )}
                      </div>
                    </Link>
                  </div>

                  <div className="col-1 text-center">{item.product.name}</div>
                  <div className="col-2 text-center">{item.product.brand}</div>
                  <div className="col-2 text-center">
                    £{item.product.price.toFixed(2)}
                  </div>
                  <div className="col-2 text-center">
                    <QuantityUpdater
                      quantity={item.quantity}
                      onDecrease={() => handleQuantityDecrease(item)}
                      onIncrease={() => handleQuantityIncrease(item)}
                    />
                  </div>
                  <div className="col-2 text-center">
                    £{item.totalPrice.toFixed(2)}
                  </div>
                  <div className="col-1 text-center">
                    <Link
                      to={"#"}
                      onClick={() => handleRemoveItem(item.product.id)}
                    >
                      <span className="remove-item">Remove</span>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            ))}
          <hr />

          <div className="cart-footer d-flex align-items-center mt-4">
            <h4 className="mb-0 cart-title">
              Total Cart Amount: £{totalAmount.toFixed(2)}
            </h4>
            <div className="ms-auto checkout-links">
              <Link to={"/products"}>Continue Shopping</Link>
              <Link to={"#"} onClick={handlePlaceOrder}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
