import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  addCategory,
} from "../../store/features/categorySlice";

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
    <div className="mb-3">
      <label className="form-label">Category: </label>
      <select
        value={selectedCategory}
        className="form-select"
        required
        onChange={handleCategoryChange}
      >
        <option>All Categories:</option>
        <option value="new">Add New Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      {showNewCategoryInput && (
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newCategory}
            placeholder="Enter new category"
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={handleAddNewCategory}
          >
            Add Category
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
