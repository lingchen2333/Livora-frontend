import React, { useEffect, useState } from "react";
import SearchBar from "../search/SearchBar";
import Paginator from "../common/Paginator";
import ProductCard from "./ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "../../store/features/productSlice";
import {
  setTotalItems,
  setCurrentPage,
} from "../../store/features/paginationSlice";
import SideBar from "../common/SideBar";
import LoadSpinner from "../common/LoadSpinner";
import { ToastContainer } from "react-toastify";

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch();
  const { products, selectedBrands, isLoading } = useSelector(
    (state) => state.product
  );
  const { searchQuery, selectedCategory } = useSelector(
    (state) => state.search
  );
  const { itemsPerPage, currentPage } = useSelector(
    (state) => state.pagination
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]); //only fetch products when products state changes

  //filter products based on search query and selected category
  useEffect(() => {
    const results = products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.name
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((selectedBrand) =>
          product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        );

      return matchesQuery && matchesCategory && matchesBrand;
    });
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, selectedBrands, products]);

  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [filteredProducts, dispatch]);

  useEffect(() => {
    dispatch(setTotalItems(filteredProducts.length));
  }, [filteredProducts, dispatch]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  //spinner when is loading
  if (isLoading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="d-flex justify-content-center">
        <div className="col-md-6 mt-2">
          <div className="search-bar input-group">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="flex">
        <aside className="w-64 p-4">
          <SideBar />
        </aside>
        <section className="flex-1">
          <ProductCard products={currentProducts} />
        </section>
      </div>
      <Paginator />
    </>
  );
};

export default Products;
