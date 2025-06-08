import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  addCategory,
} from "../../store/features/categorySlice";
import { FaPlus, FaList } from "react-icons/fa";

const CategorySelector = ({
  selectedCategory,
  onCategoryChange,

  newCategory,
  setNewCategory,

  showNewCategoryInput,
  setShowNewCategoryInput,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleAddNewCategory = () => {
    if (newCategory.trim() !== "") {
      dispatch(addCategory(newCategory));
      onCategoryChange(newCategory);
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === "new") {
      setShowNewCategoryInput(true);
    } else {
      onCategoryChange(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaList className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200 appearance-none bg-white"
          >
            <option value="">Select a category</option>
            <option value="new" className="text-[#537D5D] font-medium">
              + Add New Category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showNewCategoryInput && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            New Category Name
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPlus className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={newCategory}
                placeholder="Enter new category name"
                onChange={(e) => setNewCategory(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
              />
            </div>
            <button
              type="button"
              onClick={handleAddNewCategory}
              disabled={!newCategory.trim()}
              className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#537D5D] hover:bg-[#4A6F52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus className="mr-2" />
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
