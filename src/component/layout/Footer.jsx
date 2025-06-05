import React, { useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/features/categorySlice";
import { Link } from "react-router-dom";
import { setSelectedCategory } from "../../store/features/searchSlice";

const Footer = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <footer className="mega-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className="footer-section">
          <h3>Category</h3>
          <ul>
            {categories.map((cateogory, index) => (
              <li key={index}>
                <Link
                  to={`/products/search?category=${cateogory}`}
                  onClick={() => dispatch(setSelectedCategory(cateogory))}
                >
                  {cateogory}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@buynow.com</p>
          <p>Pheon: (123) 456-7890</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 buynow.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
