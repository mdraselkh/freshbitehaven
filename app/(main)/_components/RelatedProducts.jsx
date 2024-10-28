import React, { useEffect, useState } from "react";
import FishCards from "./ProductCards";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TfiArrowCircleRight, TfiArrowCircleLeft } from "react-icons/tfi";
import ProductCards from "./ProductCards";
import styled from "styled-components";

const CustomSlider = styled(Slider)`
  .slick-prev,
  .slick-next {
    font-size: 30px;
    color: #7d9626;
    z-index: 10;
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

export default function RelatedProducts({
  products,
  category,
  subcategory,
  currentProduct,
}) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (category && subcategory) {
      const filterProducts = products.filter(
        (product) =>
          product.category.name === category &&
          product.subcategory.name === subcategory &&
          product.id !== currentProduct.id
      );
      console.log(filterProducts);

      setRelatedProducts(filterProducts);
    } else if (category) {
      const filterProducts = products.filter(
        (product) =>
          product.category.name === category && product.id !== currentProduct.id
      );

      setRelatedProducts(filterProducts);
    }
  }, [products, category, subcategory, currentProduct]);

  console.log(relatedProducts);

  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: relatedProducts.length > 4,
    arrows: relatedProducts.length > 4 ? true : false,
    infinite: relatedProducts.length > 4 ? true : false,
    autoplay: relatedProducts.length > 4 ? true : false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    customPaging: (i) => <div style={dotStyle(currentSlide === i)} />,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (current, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          arrows: relatedProducts.length > 3 ? true : false,
          dots: relatedProducts.length > 3,
          infinite: relatedProducts.length > 3 ? true : false,
          autoplay: relatedProducts.length > 3 ? true : false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          dots: relatedProducts.length > 2,
          arrows: relatedProducts.length > 2 ? true : false,
          infinite: relatedProducts.length > 2 ? true : false,
          autoplay: relatedProducts.length > 2 ? true : false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          dots: relatedProducts.length > 1,
          arrows: relatedProducts.length > 1 ? true : false,
          infinite: relatedProducts.length > 1 ? true : false,
          autoplay: relatedProducts.length > 1 ? true : false,
        },
      },
    ],
  };

  if (relatedProducts.length === 0) {
    return (
      <div className="bg-white w-full container mx-auto shadow-lg rounded-md my-8">
        <div className="border-b border-gray-300 p-5">
          <h2 className="text-gray-800 text-xl md:text-2xl font-semibold">
            Related Products
          </h2>
        </div>
        <p className="text-gray-500 text-center text-xs md:text-base py-4">
          No related products available here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white w-full mx-auto md:max-w-7xl shadow-lg rounded-md my-8 text-left">
      <div className="border-b border-gray-300 p-5">
        <h2 className="text-gray-800 text-xl font-semibold">
          Related Products
        </h2>
      </div>

      <div className="py-1">
        <CustomSlider {...settings}>
          {relatedProducts.map((product) => (
            <div key={product.id} className="lg:ml-1">
              <ProductCards product={product} />
            </div>
          ))}
        </CustomSlider>
      </div>
    </div>
  );
}

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        ...arrowStyle,
        right: "10px",
        fontSize: "30px",
      }}
      onClick={onClick}
    >
      <TfiArrowCircleRight />
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        ...arrowStyle,
        left: "10px",
        fontSize: "30px",
      }}
      onClick={onClick}
    >
      <TfiArrowCircleLeft />
    </div>
  );
};

const dotStyle = (isActive) => ({
  width: isActive ? "20px" : "10px",
  height: isActive ? "8px" : "10px",
  backgroundColor: isActive ? "#7d9626" : "#d1d5db",
  borderRadius: isActive ? "15%" : "50%",
  margin: "8px 7px",
  cursor: "pointer",
});

const arrowStyle = {
  fontSize: "30px",
  color: "#7d9626",
  cursor: "pointer",
  position: "absolute",
  zIndex: 50, // Ensure it has high z-index
  top: "50%",
  transform: "translateY(-50%)",
};
