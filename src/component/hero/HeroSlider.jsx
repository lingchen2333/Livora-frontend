import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bg1 from "../../assets/images/hero-1.avif";
import bg2 from "../../assets/images/hero-2.avif";
import bg3 from "../../assets/images/hero-3.avif";
import bg4 from "../../assets/images/hero-4.avif";

const images = [bg1, bg2, bg3, bg4];

const HeroSlider = () => {
  const settings = {
    infinite: true,
    speed: 12000,
    autoplay: true,
    autoplayspeed: 15000,
    lazyLoad: "progressive",
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };
  return (
    <Slider {...settings} className="hero-slider">
      {images.map((img, index) => (
        <div key={index} className="slide">
          <img
            src={img}
            alt={`slider ${index + 1} `}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </Slider>
  );
};

export default HeroSlider;
