import React from "react";
import { Link } from "react-router-dom";

const UnAuthorized = () => {
  return (
    <div className="bg-[url(assets/images/unauthorized.webp)] min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">401</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, you don't have permission to access this page. Please log in
            to continue.
          </p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="block w-full px-6 py-3 bg-[#537D5D] text-white rounded-full hover:bg-[#4A6F52] transition-colors duration-200 font-medium"
            >
              Log In
            </Link>
            <Link
              to="/"
              className="block w-full text-black px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorized;
