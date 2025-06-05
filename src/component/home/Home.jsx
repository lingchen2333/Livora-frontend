import React, { useEffect, useState } from "react";
import Hero from "../hero/Hero";
import Paginator from "../common/Paginator";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductImage from "../utils/ProductImage";
import { getFirstProductPerDistinctName } from "../../store/features/productSlice";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import StockStatus from "../utils/StockStatus";
import {
  setTotalItems,
  setCurrentPage,
} from "../../store/features/paginationSlice";
import LoadSpinner from "../common/LoadSpinner";
import { setInitialSearchQuery } from "../../store/features/searchSlice";

const Home = () => {
  const dispatch = useDispatch();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const products = useSelector(
    (state) => state.product.productsWithDistinctName
  );
  const { searchQuery, selectedCategory } = useSelector(
    (state) => state.search
  );
  const { itemsPerPage, currentPage } = useSelector(
    (state) => state.pagination
  );
  const isLoading = useSelector((state) => state.product.isLoading);

  useEffect(() => {
    dispatch(getFirstProductPerDistinctName());
  }, [dispatch]);

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

      return matchesQuery && matchesCategory;
    });
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, products]);

  //pagination
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
      <Hero />
      <div className="d-flex flex-wrap justify-content-center p-5">
        <ToastContainer />
        {currentProducts &&
          currentProducts.map((product) => (
            <Card key={product.id} className="home-product-card">
              <Link
                to={`/products/search?name=${product.name}`}
                className="link"
                onClick={() => dispatch(setInitialSearchQuery(product.name))}
              >
                {product.images && product.images.length > 0 && (
                  <ProductImage
                    imageId={product.images[0].id}
                    nextImageId={product.images[1]?.id}
                  />
                )}
              </Link>

              <Card.Body>
                <p className="product-name">{product.name}</p>
                <p className="product-description">{product.description}</p>

                <h4 className="price">£{product.price}</h4>
                <StockStatus inventory={product.inventory} />

                <Link
                  to={`/products/search?name=${product.name}`}
                  className="shop-now-button"
                  onClick={() => dispatch(setInitialSearchQuery(product.name))}
                >
                  Shop now
                </Link>
              </Card.Body>
            </Card>
          ))}
      </div>
      <Paginator />
    </>
  );
};

export default Home;
