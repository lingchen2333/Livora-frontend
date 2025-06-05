import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDistinctProductBrands,
  addBrand,
} from "../../store/features/productSlice";

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
    <div className="mb-3">
      <label className="form-label">Brand: </label>
      <select
        value={selectedBrand}
        className="form-select"
        required
        onChange={handleBrandChange}
      >
        <option>All Brands:</option>
        <option value="new">Add New Brand</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      {showNewBrandInput && (
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newBrand}
            placeholder="Enter new brand"
            onChange={(e) => setNewBrand(e.target.value)}
          />
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={handleAddNewBrand}
          >
            Add Brand
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
