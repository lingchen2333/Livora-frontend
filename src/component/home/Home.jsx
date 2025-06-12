import React, { useEffect, useState } from "react";
import Hero from "../hero/Hero";
import { Link } from "react-router-dom";
import ProductImage from "../utils/ProductImage";
import { getFirstProductPerDistinctName } from "../../store/features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadSpinner from "../common/LoadSpinner";
import {
  setInitialSearchQuery,
  clearFilters,
} from "../../store/features/searchSlice";

import CategorySearchBar from "../search/CategorySearchBar";

const Home = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.search.selectedCategory
  );

  const [filteredProducts, setFilteredProducts] = useState([]);
  const products = useSelector(
    (state) => state.product.productsWithDistinctName
  );

  const isLoading = useSelector((state) => state.product.isLoading);

  useEffect(() => {
    dispatch(getFirstProductPerDistinctName());
  }, [dispatch]);

  //filter products based on selected category
  useEffect(() => {
    const results = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category.name
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

      return matchesCategory;
    });
    setFilteredProducts(results);
  }, [selectedCategory, products]);

  //spinner when is loading
  if (isLoading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div className="mb-50">
      <Hero />

      <div className="mt-5">
        <CategorySearchBar />

        <div className="container mx-auto mt-10 px-5 xl:px-28 ">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts &&
              filteredProducts.map((product) => (
                <article key={product.id} className="group relative w-full">
                  <Link
                    to={`/products/search?name=${product.name}`}
                    className="block w-full"
                    onClick={() =>
                      dispatch(setInitialSearchQuery(product.name))
                    }
                  >
                    {product.images && product.images.length > 0 && (
                      <ProductImage
                        imageId={product.images[0].id}
                        nextImageId={product.images[1]?.id}
                        className="h-48 w-full object-contain p-4 md:p-5 lg:h-56 xl:h-96 xl:p-8"
                      />
                    )}
                  </Link>

                  <Link
                    to={`/products/search?name=${product.name}`}
                    className="block mt-2 text-black font-medium capitalize hover:text-[#537D5D] text-xl tracking-wider"
                    onClick={() =>
                      dispatch(setInitialSearchQuery(product.name))
                    }
                  >
                    {product.name}
                  </Link>

                  <h6 className="price mt-1">£{product.price}</h6>
                </article>
              ))}
          </div>

          <div className="flex w-full items-center justify-center gap-4 mt-30">
            <div className="w-2/3 border-b border-gray-300 xl:w-2/5"></div>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to="/products"
              className="w-full border-1 border-[#537D5D] py-3 text-center text-sm font-medium uppercase tracking-wider md:w-1/2 xl:w-1/6 xl:text-base transition-colors duration-300 hover:bg-[#537D5D] hover:text-white"
              onClick={() => dispatch(clearFilters())}
            >
              Go to shop
            </Link>
            <div className="w-2/3 border-b border-gray-300 xl:w-2/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
