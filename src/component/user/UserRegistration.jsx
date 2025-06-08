import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../store/features/userSlice";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import AddressForm from "../common/AddressForm";
import { FaUser, FaEnvelope, FaLock, FaPlus, FaTrash } from "react-icons/fa";

const UserRegistration = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [addresses, setAddresses] = useState([
    {
      country: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      postCode: "",
      phone: "",
      addressType: "HOME",
    },
  ]);

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, e) => {
    const newAddresses = [...addresses];
    newAddresses[index][e.target.name] = e.target.value;
    setAddresses(newAddresses);
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      {
        country: "",
        city: "",
        addressLine1: "",
        addressLine2: "",
        postCode: "",
        phone: "",
        addressType: "HOME",
      },
    ]);
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(addUser({ user, addresses })).unwrap();
      resetForm();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setAddresses([
      {
        country: "",
        city: "",
        addressLine1: "",
        addressLine2: "",
        postCode: "",
        phone: "",
        addressType: "HOME",
      },
    ]);
    setUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">
              Join us and start shopping today
            </p>
          </div>

          <form onSubmit={handleRegistration} className="space-y-8">
            {/* User Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
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
                      value={user.firstName}
                      onChange={handleUserChange}
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
                      value={user.lastName}
                      onChange={handleUserChange}
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
                    value={user.email}
                    onChange={handleUserChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleUserChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Addresses Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Addresses
                </h3>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="inline-flex items-center px-4 py-2 bg-[#537D5D] text-white rounded-full hover:bg-[#4A6F52] transition-colors duration-200 text-sm"
                >
                  <FaPlus className="mr-2" />
                  Add Address
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#537D5D] transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Address {index + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(index)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <AddressForm
                      address={address}
                      onChange={(e) => handleAddressChange(index, e)}
                      onCancel={() => handleRemoveAddress(index)}
                      showButtons={false}
                      showAddressType={true}
                      showPostCode={true}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#537D5D] text-white rounded-full hover:bg-[#4A6F52] transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Create Account
              </button>
              <div className="text-center text-gray-600 mt-3">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="!text-[#537D5D] hover:!text-[#4A6F52] font-medium"
                >
                  Login here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
