import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  setUserAddresses,
  deleteAddressById,
  updateAddressById,
  addAddress,
} from "../../store/features/userSlice";

import { Link } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import AddressForm from "../common/AddressForm";
import { nanoid } from "nanoid";
import { getOrdersByUserId } from "../../store/features/orderSlice";
import placeholder from "../../assets/images/placeholder.png";
import LoadSpinner from "../common/LoadSpinner";
import Order from "../order/Order";

const UserProfile = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.order.isLoading);

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState({
    country: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    postCode: "",
    phone: "",
    addressType: "HOME",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {
    dispatch(getOrdersByUserId(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const handleDeleteAddress = async (addressId) => {
    const previousAddresses = [...user.addressList];

    dispatch(
      setUserAddresses(
        user.addressList.filter((address) => address.id !== addressId)
      )
    );

    try {
      const response = await dispatch(deleteAddressById(addressId)).unwrap();
      toast.success(response.message);
      console.log("deleting address");
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(previousAddresses));
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setEditingAddressId(address.id);
    console.log(address.id);
    setShowForm(true);
    setIsUpdating(true);
  };

  const handleAddressChange = (e) => {
    setEditingAddress((prevAddress) => ({
      ...prevAddress,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setEditingAddress({
      country: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      postCode: "",
      phone: "",
      addressType: "HOME",
    });
    setEditingAddressId(null);
    setShowForm(false);
    setIsUpdating(false);
  };

  const handleUpdateAddress = async (addressId) => {
    const previousAddresses = [...user.addressList];

    dispatch(
      setUserAddresses(
        user.addressList.map((address) =>
          address.id === addressId ? { ...editingAddress, addressId } : address
        )
      )
    );

    try {
      const response = await dispatch(
        updateAddressById({
          addressId: editingAddressId,
          address: editingAddress,
        })
      ).unwrap();
      resetForm();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(previousAddresses));
    }
  };

  const handleAddAddress = async () => {
    const previousAddresses = [...user.addressList];

    dispatch(
      setUserAddresses([
        ...user.addressList,
        { ...editingAddress, id: nanoid() },
      ])
    );

    try {
      const response = await dispatch(
        addAddress({
          userId,
          address: editingAddress,
        })
      ).unwrap();

      const realId = response.data.id;
      dispatch(
        setUserAddresses([
          ...previousAddresses,
          { ...editingAddress, id: realId },
        ])
      );
      resetForm();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(previousAddresses));
    }
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          User Dashboard
        </h2>

        {user ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Information Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                User Information
              </h3>
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src={user.photo || placeholder}
                    alt="User Photo"
                    className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-[#537D5D]"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Full Name:</span>{" "}
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Addresses Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Addresses
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setIsUpdating(false);
                    }}
                    className="px-4 py-2 bg-[#537D5D] text-white rounded-full hover:bg-[#4A6F52] transition-colors duration-200 text-sm"
                  >
                    Add New Address
                  </button>
                </div>

                <div className="space-y-4">
                  {user.addressList?.length > 0 ? (
                    user.addressList.map((address, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#537D5D] transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-gray-900 font-medium">
                              {address.addressType} Address
                            </p>
                            <p className="text-gray-600">
                              {address.addressLine1}
                            </p>
                            {address.addressLine2 && (
                              <p className="text-gray-600">
                                {address.addressLine2}
                              </p>
                            )}
                            <p className="text-gray-600">
                              {address.city}, {address.country}
                            </p>
                            <p className="text-gray-600">
                              Postal Code: {address.postCode}
                            </p>
                            <p className="text-gray-600">
                              Phone: {address.phone}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-[#537D5D] hover:text-[#4A6F52] transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-500 hover:text-red-600 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No addresses found
                    </p>
                  )}
                </div>

                {showForm && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <AddressForm
                      address={editingAddress}
                      onChange={handleAddressChange}
                      onCancel={resetForm}
                      isUpdating={isUpdating}
                      showTitle={true}
                      onSubmit={
                        isUpdating
                          ? () => handleUpdateAddress(editingAddressId)
                          : handleAddAddress
                      }
                      showCheck={true}
                      showButtons={true}
                      showAddressType={true}
                      showPostCode={true}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Order History Card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order History
                </h3>
                <div className="overflow-x-auto">
                  {Array.isArray(orders) && orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No orders found at the moment.
                    </p>
                  ) : (
                    <Order />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    to="/products"
                    className="inline-block px-6 py-2 bg-[#537D5D] text-white rounded-full hover:bg-[#4A6F52] transition-colors duration-200"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading user information...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
