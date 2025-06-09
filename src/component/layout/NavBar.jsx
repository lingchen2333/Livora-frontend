import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearFilters } from "../../store/features/searchSlice";
import { setSelectedBrands } from "../../store/features/productSlice";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaStore,
} from "react-icons/fa";
import { logout } from "../service/authService";
import { getCartByUserId } from "../../store/features/cartSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const items = useSelector((state) => state.cart.items);
  const userRoles = useSelector((state) => state.auth.roles);
  const userId = localStorage.getItem("userId");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClearAllFilters = () => {
    searchParams.delete("category");
    searchParams.delete("name");
    dispatch(clearFilters());
    dispatch(setSelectedBrands([]));
    navigate(`/products/search?${searchParams.toString()}`);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    dispatch(getCartByUserId(userId));
  }, [userId, dispatch]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-20">
            <Link
              to="/"
              onClick={handleClearAllFilters}
              className="text-3xl font-bold !text-[#dac292] hover:!text-[#e6d3ae] transition-colors duration-200"
            >
              Livora.com
            </Link>

            <Link
              to="/products"
              onClick={handleClearAllFilters}
              className="!text-gray-700 hover:!text-[#537D5D] px-3 py-2 rounded-md text-m font-medium transition-colors duration-200"
            >
              Shop
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {userRoles.includes("ROLE_ADMIN") && (
              <Link
                to="/products/add"
                className="!text-gray-700 hover:!text-[#537D5D] px-3 py-2 rounded-md text-m font-medium transition-colors duration-200"
              >
                <FaStore className="inline-block mr-1 mb-1" />
                Manage Shop
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-[#537D5D] px-3 py-2 rounded-md text-m font-medium transition-colors duration-200"
              >
                <FaUser className="mr-1 mb-1" />
                Account
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg">
                  {userId ? (
                    <>
                      <Link
                        to={`/users/${userId}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-m !text-gray-700 hover:!bg-gray-100 hover:!text-[#537D5D] transition-colors duration-200"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-m !text-gray-700 hover:!bg-gray-100 hover:!text-[#537D5D] transition-colors duration-200"
                      >
                        <FaSignOutAlt className="inline-block mr-1" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm !text-gray-700 hover:!bg-gray-100 hover:!text-[#537D5D] transition-colors duration-200"
                    >
                      <FaSignInAlt className="inline-block mr-1" />
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>

            {userId && (
              <Link
                to={`/users/${userId}/carts`}
                className="relative !text-gray-700 hover:!text-[#537D5D] p-2 rounded-md transition-colors duration-200"
              >
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-[#537D5D] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
