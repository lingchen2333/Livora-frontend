import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCartByUserId } from "../../store/features/cartSlice";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";
import {
  createPaymentIntent,
  placeOrder,
} from "../../store/features/orderSlice";
import AddressForm from "../common/AddressForm";
import { cardElementOptions } from "../utils/cartElementOptions";
import { ClipLoader } from "react-spinners";
import { FaLock, FaCreditCard, FaUser, FaEnvelope } from "react-icons/fa";

const Checkout = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userId } = useParams();

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastName: "",
    email: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    postCode: "",
  });

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress({ ...billingAddress, [name]: value });
  };

  useEffect(() => {
    dispatch(getCartByUserId(userId));
  }, [dispatch, userId]);

  const handlePaymentAndOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Loading... please try again");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { clientSecret } = await dispatch(
        createPaymentIntent({ amount: cart.totalAmount, currency: "gbp" })
      ).unwrap();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${userInfo.firstname} ${userInfo.lastName}`,
              email: userInfo.email,
              address: {
                line1: billingAddress.addressLine1,
                line2: billingAddress.addressLine2,
                city: billingAddress.city,
                country: billingAddress.country,
                postal_code: billingAddress.postCode,
              },
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }
      if (paymentIntent.status === "succeeded") {
        await dispatch(placeOrder(userId)).unwrap();
        toast.success("Payment successful! Your order has been placed.");
        setTimeout(() => {
          window.location.href = `/users/${userId}`;
        }, 5000);
      }
    } catch (error) {
      toast.error("Error processing payment: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-10">
                Checkout
              </h2>

              <form onSubmit={handlePaymentAndOrder} className="space-y-8 mt-4">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={userInfo.firstName}
                          onChange={handleUserInfoChange}
                          required
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={userInfo.lastName}
                          onChange={handleUserInfoChange}
                          required
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleUserInfoChange}
                        required
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Billing Address
                  </h3>
                  <AddressForm
                    onChange={handleAddressChange}
                    address={billingAddress}
                  />
                </div>

                {/* Payment Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payment Information
                  </h3>
                  <div>
                    <label
                      htmlFor="card-element"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Card Details
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus-within:ring-[#537D5D] focus-within:border-[#537D5D] transition-colors duration-200">
                        <CardElement
                          options={cardElementOptions}
                          onChange={(event) => {
                            setCardError(
                              event.error ? event.error.message : ""
                            );
                          }}
                        />
                      </div>
                      {cardError && (
                        <p className="mt-2 text-sm text-red-600">{cardError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    £{cart.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">Free</span>
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="text-lg font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-[#537D5D]">
                    £{cart.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                onClick={handlePaymentAndOrder}
                disabled={!stripe || loading}
                className="w-full mt-8 px-6 py-3 bg-[#537D5D] text-white rounded-full hover:bg-[#4A6F52] transition-colors duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <ClipLoader size={20} color="#ffffff" />
                ) : (
                  <>
                    <FaLock className="mr-2" />
                    Pay £{cart.totalAmount.toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <FaLock className="mr-2" />
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
