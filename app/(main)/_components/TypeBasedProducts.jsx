import React, { useEffect, useState } from "react";
import FishCards from "./ProductCards";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TfiArrowCircleRight, TfiArrowCircleLeft } from "react-icons/tfi";
import ProductCards from "./ProductCards";
import styled from "styled-components";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

const CustomSlider = styled(Slider)`
  .slick-prev,
  .slick-next {
    font-size: 30px;
    color: #7d9626;
    z-index: 10;
    padding: 0 10px; /* Add padding for spacing */
    transition: color 0.3s ease, transform 0.3s ease; /* Smooth transition for hover effects */
  }

  .slick-prev:hover,
  .slick-next:hover {
    color: #5a6c1c; /* Darker shade on hover */
    transform: scale(1.2); /* Slight zoom effect */
  }

  @media (max-width: 768px) {
    .slick-prev,
    .slick-next {
      font-size: 24px; /* Adjust size for smaller screens */
      padding: 0 5px; /* Adjust spacing for smaller screens */
    }
  }

  .slick-dots li button:before {
    font-size: 12px;
    color: #7d9626;
  }

  .slick-dots li.slick-active button:before {
    color: #ff4500;
  }

  .slick-slide {
    padding: 0; // Ensure no extra padding
    margin: 0; // Ensure no extra margin
  }

  .slick-track {
    display: block; // Change to block to allow left alignment
    margin-left: 0; // Remove any left margin
  }

  .slick-list {
    margin: 0; // Remove default margins on the list
    overflow: hidden; // Prevent overflow
  }
`;

export default function TypeBasedProducts({
  products,
  type,
  arrows,
  dots,
  autoplay,
  slidesToScroll,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const rows = type === "featured" || type === "best" ? 2 : 1;

  const settings = {
    dots: dots,
    arrows: arrows,
    infinite: products.length > 4 ? true : false,
    autoplay: products.length > 4 ? autoplay : false,
    autoplaySpeed: 4000,
    rows: rows,
    pauseOnHover: true,
    rtl: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: slidesToScroll,
    customPaging: (i) => <div style={dotStyle(currentSlide === i)} />,

    // Conditionally rendering the arrows
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    beforeChange: (current, next) => setCurrentSlide(next),

    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 4,
          arrows: arrows,
          slidesToScroll: slidesToScroll,
          infinite: products.length > 3 ? true : false,
          rtl: true,
          rows: rows,
          autoplay: products.length > 4 ? autoplay : false,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
          dots: dots,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          arrows: arrows,
          slidesToScroll: slidesToScroll,
          infinite: products.length > 2 ? true : false,
          autoplay: products.length > 2 ? autoplay : false,
          rtl: true,
          rows: rows,
          dots: dots,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          arrows: arrows,
          slidesToScroll: slidesToScroll,
          infinite: products.length > 1 ? true : false,
          autoplay: products.length > 1 ? autoplay : false,
          rtl: true,
          dots: dots,
          rows: rows,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        },
      },
    ],
  };

  if (products.length === 0) {
    return (
      <p className="text-gray-500 text-xs md:text-base py-4">
        No related products available here.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="py-5 w-full">
        <CustomSlider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="lg:ml-1">
              <ProductCards product={product} />
            </div>
          ))}
        </CustomSlider>
      </div>
    </div>
  );
}

const SampleNextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 transform -translate-y-1/2 right-3 lg:right-10 z-30 text-3xl md:text-4xl text-[#7d9626] hover:bg-[#7d9626] rounded-full hover:text-white cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
      onClick={onClick}
    >
      <IoIosArrowDropright />
    </div>
  );
};

const SamplePrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 transform -translate-y-1/2 left-3 lg:left-2 z-30 text-3xl md:text-4xl text-[#7d9626] hover:bg-[#7d9626] rounded-full hover:text-white cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
      onClick={onClick}
    >
      <IoIosArrowDropleft />
    </div>
  );
};

const arrowStyle = {
  fontSize: "30px",
  color: "#7d9626",
  cursor: "pointer",
  position: "absolute",
  zIndex: 10, // Ensure it has high z-index
  top: "50%",
  transform: "translateY(-50%)",
  padding: "0 10px", /* Add padding for spacing */
  transition: "color 0.3s ease, transform 0.3s ease",
};

const dotStyle = (isActive) => ({
  width: isActive ? "20px" : "10px",
  height: isActive ? "8px" : "10px",
  backgroundColor: isActive ? "#7d9626" : "#d1d5db",
  borderRadius: isActive ? "15%" : "50%",
  margin: "8px 7px",
  cursor: "pointer",
});
