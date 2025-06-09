import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDistinctProductBrands,
  filteredByBrand,
} from "../../store/features/productSlice";
import { getAllCategories } from "../../store/features/categorySlice";
import {
  setSelectedCategory,
  setSearchQuery,
  clearFilters,
} from "../../store/features/searchSlice";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brands, selectedBrands } = useSelector((state) => state.product);
  const categories = useSelector((state) => state.category.categories);
  const { selectedCategory, searchQuery } = useSelector(
    (state) => state.search
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    dispatch(getDistinctProductBrands());
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleBrandChange = (brand, isChecked) => {
    dispatch(filteredByBrand({ brand, isChecked }));
    searchParams.delete("brand");

    // Create a new array based on the current selection
    const updatedBrands = isChecked
      ? [...selectedBrands, brand]
      : selectedBrands.filter((b) => b !== brand);

    // Update URL with the new brand selection
    updatedBrands.forEach((brand) => {
      searchParams.append("brand", brand);
    });

    navigate(`/products/search?${searchParams.toString()}`);
  };

  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value));
    searchParams.set("category", e.target.value);
    navigate(`/products/search?${searchParams.toString()}`);
  };

  const handleSearchQueryChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    searchParams.set("name", e.target.value);
    navigate(`/products/search?${searchParams.toString()}`);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    searchParams.delete("category");
    searchParams.delete("name");
    searchParams.delete("brand");
    navigate(`/products/search?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-7 p-4">
      {/* Search Query */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-3 uppercase">filter by</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="my-3 w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#537D5D] focus:ring-1 focus:ring-[#537D5D] "
          placeholder="Search products..."
        />
      </div>

      {/* Category Selection */}
      <div>
        <h2 className="text-xl  text-gray-900 mb-3">Categories</h2>
        <select
          className="mb-3 w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#537D5D] focus:ring-1 focus:ring-[#537D5D] bg-white"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div>
        <h2 className="text-xl text-gray-900">Brands</h2>
        <ul className="m-3 space-y-4">
          {brands.map((brand, index) => (
            <li key={index} className="brand-item">
              <label className="checkbox-container flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => handleBrandChange(brand, e.target.checked)}
                />
                <span className="checkmark"></span>
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear Filters Button */}
      <button
        className="mt-3 w-full px-6 py-2 text-sm font-medium text-white bg-[#537D5D] rounded-lg hover:bg-[#537D5D]/90 transition-colors duration-300"
        onClick={handleClearFilters}
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default SideBar;
