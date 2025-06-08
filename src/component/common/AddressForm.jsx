import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllCountries } from "../../store/features/userSlice";
import {
  FaCheck,
  FaTimes,
  FaHome,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
} from "react-icons/fa";

const AddressForm = ({
  address,
  onChange,
  onCancel,
  isUpdating,
  showTitle,
  showButtons,
  onSubmit,
  showCheck,
  showAddressType,
  showPostCode,
}) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await dispatch(getAllCountries()).unwrap();
      setCountries(countries);
    };
    fetchCountries();
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {showTitle && (
        <h3 className="text-lg font-medium text-gray-900">
          {isUpdating ? "Edit Address" : "Add New Address"}
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="addressLine1"
              value={address.addressLine1}
              onChange={onChange}
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
              placeholder="Street address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="addressLine2"
              value={address.addressLine2}
              onChange={onChange}
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
              placeholder="Apartment, suite, etc."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={onChange}
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
              placeholder="City"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaGlobe className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="country"
              value={address.country}
              onChange={onChange}
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200 appearance-none bg-white"
            >
              <option value="">Select a country</option>
              {countries.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showPostCode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Post Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="postCode"
                value={address.postCode}
                onChange={onChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                placeholder="Postal code"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={address.phone}
              onChange={onChange}
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
              placeholder="Phone number"
            />
          </div>
        </div>

        {showAddressType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaHome className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="addressType"
                value={address.addressType}
                onChange={onChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200 appearance-none bg-white"
              >
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {showButtons && (
        <div className="flex justify-end space-x-4 mt-6">
          {showCheck && (
            <button
              onClick={onSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#537D5D] hover:bg-[#4A6F52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200"
            >
              <FaCheck className="mr-2" />
              {isUpdating ? "Update Address" : "Add Address"}
            </button>
          )}
          <button
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
