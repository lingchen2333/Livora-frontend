import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDistinctProductBrands,
  addBrand,
} from "../../store/features/productSlice";
import { FaPlus, FaTag } from "react-icons/fa";

const BrandSelector = ({
  selectedBrand,
  onBrandChange,

  newBrand,
  setNewBrand,

  showNewBrandInput,
  setShowNewBrandInput,
}) => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.product.brands);

  useEffect(() => {
    dispatch(getDistinctProductBrands());
  }, [dispatch]);

  const handleAddNewBrand = () => {
    if (newBrand.trim() !== "") {
      console.log("handel add new brand from brand selector: ", newBrand);
      dispatch(addBrand(newBrand));
      onBrandChange(newBrand);
      setNewBrand("");
      setShowNewBrandInput(false);
    }
  };

  const handleBrandChange = (e) => {
    if (e.target.value === "new") {
      setShowNewBrandInput(true);
    } else {
      onBrandChange(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaTag className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
            required
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200 appearance-none bg-white"
          >
            <option value="">Select a brand</option>
            <option value="new" className="text-[#537D5D] font-medium">
              + Add New Brand
            </option>
            {brands.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showNewBrandInput && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            New Brand Name
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPlus className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={newBrand}
                placeholder="Enter new brand name"
                onChange={(e) => setNewBrand(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
              />
            </div>
            <button
              type="button"
              onClick={handleAddNewBrand}
              disabled={!newBrand.trim()}
              className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#537D5D] hover:bg-[#4A6F52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus className="mr-2" />
              Add Brand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
