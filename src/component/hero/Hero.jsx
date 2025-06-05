import React, { useState } from "react";
import HeroSlider from "./HeroSlider";
import HeroSearchBar from "../search/HeroSearchBar";

const Hero = () => {
  const [currentSlide] = useState(0);
  return (
    <div className="hero">
      <HeroSlider setCurrentSlide={currentSlide} />

      <div className="hero-content">
        <h1>
          Welcome to <span style={{ color: "#537D5D" }}>buyNow</span>.com
        </h1>

        <HeroSearchBar />

        <div className="home-button-container">
          <a href="#" className="home-shop-button">
            Shop Now
          </a>
          <button className="deals-button">Today's Deal</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
