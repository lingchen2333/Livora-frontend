import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/features/categorySlice";
import {
  setSelectedCategory,
  clearFilters,
} from "../../store/features/searchSlice";

const CategorySearchBar = () => {
  const dispatch = useDispatch();
  const [currentCategory, setCurrentCategory] = useState("");

  const categories = useSelector((state) => state.category.categories);

  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-5 text-xs md:text-base xl:px-28">
      <div className="scrollbar-hide flex snap-x space-x-8 md:space-x-15 overflow-auto">
        <button
          className={`snap-start text-start tracking-widest px-8 py-4 ${
            currentCategory === "all"
              ? "border-b-[1.8px] border-primary"
              : "border-b-0"
          }`}
          onClick={(e) => {
            handleClearFilters(e);
            setCurrentCategory("all");
          }}
        >
          ALL
        </button>

        {categories.map((category, index) => (
          <button
            value={category}
            key={index}
            className={`snap-start text-start tracking-widest px-8 py-4 ${
              currentCategory === category
                ? "border-b-[1.8px] border-primary"
                : "border-b-0"
            }`}
            onClick={(e) => {
              handleCategoryChange(e);
              setCurrentCategory(category);
            }}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySearchBar;
