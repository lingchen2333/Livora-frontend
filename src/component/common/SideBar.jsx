import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDistinctProductBrands,
  filteredByBrand,
} from "../../store/features/productSlice";
import { useNavigate, useLocation } from "react-router-dom";
const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brands, selectedBrands } = useSelector((state) => state.product);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    dispatch(getDistinctProductBrands());
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

  return (
    <>
      <h6>Filter by Brand</h6>

      <ul className="brand-list">
        {brands.map((brand, index) => (
          <li key={index} className="brand-item">
            <label className="checkbox-container">
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
    </>
  );
};

export default SideBar;
