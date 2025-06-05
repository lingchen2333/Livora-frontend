import React, { useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearFilters } from "../../store/features/searchSlice";
import { setSelectedBrands } from "../../store/features/productSlice";
import { FaShoppingCart } from "react-icons/fa";
import { logout } from "../service/authService";
import { getCartByUserId } from "../../store/features/cartSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const items = useSelector((state) => state.cart.items);
  const userRoles = useSelector((state) => state.auth.roles);
  const userId = localStorage.getItem("userId");

  const handleClearAllFilters = () => {
    searchParams.delete("category");
    searchParams.delete("name");
    dispatch(clearFilters());
    dispatch(setSelectedBrands([]));
    navigate(`/products/search?${searchParams.toString()}`);
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    dispatch(getCartByUserId(userId));
  }, [userId, dispatch]);

  return (
    <Navbar expand="lg" sticky="top" className="nav-bg">
      <Container>
        <Navbar.Brand to={"/"} as={Link} onClick={handleClearAllFilters}>
          <span className="shop-home">Livora.com</span>
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link
              to={"/products"}
              as={Link}
              onClick={handleClearAllFilters}
            >
              All Products
            </Nav.Link>
          </Nav>

          {userRoles.includes("ROLE_ADMIN") && (
            <Nav className="me-auto">
              <Nav.Link to={"/products/add"} as={Link}>
                Manage Shop
              </Nav.Link>
            </Nav>
          )}

          <Nav className="ms-auto">
            <NavDropdown title="Account">
              {userId ? (
                <>
                  <NavDropdown.Item to={`/users/${userId}`} as={Link}>
                    My Account
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item to={`/users/${userId}/orders`} as={Link}>
                    My Orders
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item to={"#"} onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </>
              ) : (
                <NavDropdown.Item to={"/login"} as={Link}>
                  Login
                </NavDropdown.Item>
              )}
            </NavDropdown>

            {userId && (
              <Link
                to={`/users/${userId}/carts`}
                className="nav-link me-1 position-relative"
              >
                <FaShoppingCart className="shopping-cart-icon" />
                {items.length > 0 ? (
                  <div className="badge-overlay">{items.length}</div>
                ) : (
                  <div className="badge-overlay">0</div>
                )}
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
