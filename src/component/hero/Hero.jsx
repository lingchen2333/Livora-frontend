import React, { useState } from "react";
import HeroSlider from "./HeroSlider";

const Hero = () => {
  const [currentSlide] = useState(0);
  return (
    <div className="hero">
      <HeroSlider setCurrentSlide={currentSlide} />

      <div className="hero-content">
        <p className="tracking-wide text-4xl">
          Welcome to <span style={{ color: "#537D5D" }}>Livora</span>.com
        </p>
        <p className="text-xl font-medium tracking-wider text-white-100 my-4">
          Crafted for Modern Living.
        </p>
      </div>
    </div>
  );
};

export default Hero;
