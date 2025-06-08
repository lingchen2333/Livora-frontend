import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/features/categorySlice";
import {
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
} from "../../store/features/searchSlice";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const categories = useSelector((state) => state.category.categories);
  const { searchQuery, selectedCategory } = useSelector(
    (state) => state.search
  );

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
    navigate(`/products/search?${searchParams.toString()}`);
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="flex w-full max-w-3xl mx-auto gap-2 p-4">
      <select
        className="w-48 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#537D5D] focus:ring-1 focus:ring-[#537D5D] bg-white"
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
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#537D5D] focus:ring-1 focus:ring-[#537D5D]"
        placeholder="Search products..."
      />
      <button
        className="px-6 py-2 text-sm font-medium text-white bg-[#537D5D] rounded-lg hover:bg-[#537D5D]/90 transition-colors duration-300"
        onClick={handleClearFilters}
      >
        Clear
      </button>
    </div>
  );
};

export default SearchBar;
