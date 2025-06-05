import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductImage from "../utils/ProductImage";
import StockStatus from "../utils/StockStatus";
import { useDispatch, useSelector } from "react-redux";
import { deleteProductById } from "../../store/features/productSlice";
import { toast } from "react-toastify";
import { addToCart } from "../../store/features/cartSlice";

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
    <main className="row m-2">
      {products.map((product) => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
          <Card className="mb-2 mt-2 h-100">
            <Link to={`/products/${product.id}`} className="link">
              {product.images.length > 0 && (
                <ProductImage
                  imageId={product.images[0].id}
                  nextImageId={product.images[1]?.id}
                />
              )}
            </Link>

            <Card.Body className="d-flex flex-column">
              <p className="product-name flex-grow-1">{product.name}</p>
              <p className="product-description">{product.description}</p>

              <div className="mt-auto">
                <h4 className="price">£{product.price}</h4>
                <StockStatus inventory={product.inventory} />
                <div className="d-flex gap-2">
                  {isAdmin && (
                    <>
                      <Link to={"#"} onClick={() => handleDelete(product.id)}>
                        delete
                      </Link>
                      <Link to={`/products/${product.id}/edit`}>edit</Link>
                    </>
                  )}

                  <button
                    className="shop-now-button"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </main>
  );
};

export default ProductCard;
