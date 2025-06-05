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
    <div className="search-bar input-group input-group-sm">
      <select
        className="form-control-sm"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="all">All Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        className="form-control"
        placeholder="search..."
      />
      <button className="search-button" onClick={handleClearFilters}>
        Clear Filter
      </button>
    </div>
  );
};

export default SearchBar;
