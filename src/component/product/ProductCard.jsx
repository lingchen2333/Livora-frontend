import React from "react";

import { Link } from "react-router-dom";
import ProductImage from "../utils/ProductImage";
import StockStatus from "../utils/StockStatus";
import { useDispatch, useSelector } from "react-redux";
import { deleteProductById } from "../../store/features/productSlice";
import { toast } from "react-toastify";
import { addToCart } from "../../store/features/cartSlice";
import { FaTrash, FaEdit } from "react-icons/fa";

const ProductCard = ({ products }) => {
  const dispatch = useDispatch();
  const userRoles = useSelector((state) => state.auth.roles);
  const isAdmin = userRoles.includes("ROLE_ADMIN");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const errorMessage = useSelector((state) => state.cart.errorMessage);

  const handleDelete = async (productId) => {
    try {
      const result = await dispatch(deleteProductById(productId)).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please log in first.");
      return;
    }

    try {
      const response = await dispatch(
        addToCart({ productId, quantity: 1 })
      ).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(errorMessage);
    }
  };

  return (
    <main className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <Link to={`/products/${product.id}`} className="block w-full">
            {product.images.length > 0 && (
              <div className="relative overflow-hidden rounded-t-lg">
                <ProductImage
                  imageId={product.images[0].id}
                  nextImageId={product.images[1]?.id}
                  className="h-48 w-full object-contain p-4 md:p-5 lg:h-56 xl:h-64 xl:p-8 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
          </Link>

          <div className="p-4">
            <Link
              to={`/products/${product.id}`}
              className="block text-gray-800 font-semibold text-lg capitalize hover:text-primary transition-colors duration-200"
            >
              {product.name}
            </Link>

            <div className="mt-3 space-y-2">
              <h5 className="text-xl font-bold text-primary">
                £{product.price}
              </h5>
              {isAdmin && <StockStatus inventory={product.inventory} />}

              <div className="flex items-center gap-3 mt-4">
                {isAdmin && (
                  <>
                    <Link
                      to={"#"}
                      onClick={() => handleDelete(product.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-all duration-200"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                      Delete
                    </Link>
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all duration-200"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </>
                )}

                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-b rounded-full text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </main>
  );
};

export default ProductCard;
