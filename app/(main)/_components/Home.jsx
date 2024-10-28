"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import img1 from "@/public/slider_mach1.jpg";
import img2 from "@/public/slider_mach2.jpg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Cards from "./Cards";
import itemImg1 from "@/public/item1.png";
import itemImg2 from "@/public/item2.jpg";
import itemImg3 from "@/public/item3.jpg";
import itemImg4 from "@/public/item4.png";
import { FaTruckFast } from "react-icons/fa6";
import { TbCoinTaka } from "react-icons/tb";
import { Ri24HoursLine, RiArrowGoForwardLine } from "react-icons/ri";
import { GrSecure } from "react-icons/gr";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TypeBasedProducts from "./TypeBasedProducts";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { AiOutlineArrowUp } from "react-icons/ai";

const Home = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("featured");
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const coverImageHeight = document.querySelector(".cover-image")?.offsetHeight || 500; 
      setShowScrollButton(scrollY > coverImageHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products`);

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();

        const availableOfferProducts = data.filter(
          (product) => product.status === "active" && product.isOnOffer
        );

        setOfferProducts(availableOfferProducts);

        const availableFeaturedProducts = data.filter(
          (product) => product.status === "active" && product.isFeatured
        );

        setFeaturedProducts(availableFeaturedProducts);

        const availableNewProducts = data.filter(
          (product) => product.status === "active" && product.isNewArrival
        );

        setNewProducts(availableNewProducts);

        const availableBestProducts = data.filter(
          (product) => product.status === "active" && product.isBestSelling
        );

        setBestProducts(availableBestProducts);
      } catch (error) {
        setError("Error fetching products: " + error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/posterimg");
        if (!response.ok) {
          throw new Error("Failed to fetch poster img data.");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex,images]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} flex items-center justify-center w-16 h-16 rounded-full border-2 shadow-lg cursor-pointer`}
        style={{ ...style, fontSize: "30px", background: "#ffbd59" }}
        onClick={onClick}
      >
        <IoIosArrowForward />
      </div>
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} flex items-center justify-center w-16 h-16 rounded-full border-2 shadow-lg cursor-pointer`}
        style={{ ...style, fontSize: "30px", background: "#ffbd59" }}
        onClick={onClick}
      >
        <IoIosArrowBack />
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 680,
        settings: {
          arrows:false,
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots:false,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const [blogs, setBlogs] = useState([]); // State to hold the blog data

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog'); // Adjust the API endpoint as necessary
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogs(data.slice(-4));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs(); // Call the function to fetch blogs when the component mounts
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto z-10 xl:px-10">
        {/* Slider Container */}
        <div className="relative cover-image overflow-hidden h-[30vh] md:h-[45vh] lg:h-[70vh] xl:h-[60vh]">
          {/* Slide Images */}
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out `}
              style={{
                transform: `translateX(${100 * (index - activeIndex)}%)`,
              }}
            >
              <Image
                src={image.images}
                alt={`Slide ${index + 1}`}
                fill
                className="object-fit"
                priority={index === activeIndex}
              />
            </div>
          ))}

          {/* Arrow Buttons */}
          <button
            onClick={handlePrev}
            className="ml-1 absolute top-1/2 left-0 sm:left-4 transform -translate-y-1/2 focus:outline-none  text-white bg-[#ffbd59] rounded hover:bg-white hover:text-black px-0 py-1 lg:px-1 lg:py-4"
          >
            <MdKeyboardArrowLeft
        
              className=" text-[28px] md:text-[32px]"
            />
          </button>
          <button
            onClick={handleNext}
            className="mr-1 absolute top-1/2 sm:right-4 right-0 transform -translate-y-1/2  focus:outline-none text-white bg-[#ffbd59] rounded hover:bg-white hover:text-black px-0 py-1 lg:px-1 lg:py-4"
          >
            <MdKeyboardArrowRight
              
              className="text-[28px] md:text-[32px]"
            />
          </button>
        </div>
        {/* Dot Indicators */}
        <div className="absolute -mt-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                index === activeIndex ? "bg-[#7d9626]" : "bg-gray-400"
              } focus:outline-none`}
            ></button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-5 py-8 md:py-10 lg:px-8 lg:py-14 lg:gap-5 xl:gap-6 xl:px-0 xl:py-10 w-full">
          <div className="flex items-center justify-between px-3 py-2 gap-3 sm:gap-4 sm:p-5 lg:gap-5 xl:gap-6 rounded-md shadow-md bg-white lg:px-5 lg:py-4 xl:p-6">
            <FaTruckFast className="text-[#7d9626] text-5xl sm:text-4xl lg:text-5xl xl:text-4xl" />
            <div>
              <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg font-bold text-black">
                Free Shippping & Return
              </p>
              <p className="text-[10px] sm:text-xs xl:text-sm font-medium text-black">
                Free Delivery On Orders Over 2000tk.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 gap-3 sm:gap-4 sm:p-5 lg:gap-5 xl:gap-6 rounded-md shadow-md bg-white lg:px-5 lg:py-4 xl:p-6">
            <TbCoinTaka className="text-[#7d9626] text-5xl sm:text-4xl lg:text-5xl xl:text-4xl" />
            <div>
              <p className="text-base md:text-lg lg:text-base xl:text-lg font-bold text-black">
                Money Back Gaurantee
              </p>
              <p className="text-[10px] sm:text-xs xl:text-sm font-medium text-black">
                100% money back gaurantee
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 gap-3 sm:gap-4 sm:p-5 lg:gap-5 xl:gap-6 rounded-md shadow-md bg-white lg:px-5 lg:py-4 xl:p-6">
            <Ri24HoursLine className="text-[#7d9626] text-5xl sm:text-4xl lg:text-5xl xl:text-4xl" />
            <div>
              <p className="text-base md:text-lg lg:text-base xl:text-lg font-bold text-black">
                Online Support 24/7
              </p>
              <p className="text-[10px] sm:text-xs xl:text-sm font-medium text-black">Customer Support</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 gap-3 sm:gap-4 sm:p-5 lg:gap-5 xl:gap-6 rounded-md shadow-md bg-white lg:px-5 lg:py-4 xl:p-6">
            <GrSecure className="text-[#7d9626] text-5xl sm:text-4xl lg:text-5xl xl:text-4xl" />
            <div>
              <p className="text-base md:text-lg lg:text-base xl:text-lg font-bold text-black">Secure Payment</p>
              <p className="text-[10px] sm:text-xs xl:text-sm font-medium text-black">
                Secure payment portals
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-4 lg:px-6">
          {/* Title and Arrows */}
          <div className="flex items-center justify-between">
            <h2 className="text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mt-2">
              Shop By Category
            </h2>
            
          </div>

          {/* Slider Component */}
          <div className="py-3 sm:py-5">
            <Slider {...settings}>
              {categories.map((card) => (
                <div key={card.id} className="p-2">
                  <Cards image={card.image} title={card.name} />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className="px-5 lg:px-8 xl:px-0 lg:py-5 py-4">
          <Image
            src="/deals_banners.jpg"
            alt="deals_banners"
            width={500}
            height={240}
            className="object-fit w-full md:h-60"
          />
        </div>

        <div className="px-4 lg:px-6 xl:px-0 w-full">
          {/* Title and Arrows */}
          <div className="flex place-items-end justify-between">
            <h2 className="text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mt-4">
              Our Hot Deals
            </h2>
            <Link
              href="/offers"
              className="text-gray-800 text-sm md:text-lg px-2 md:px-3 py-1 font-bold border border-[#ffbd59] hover:underline"
            >
              See All
            </Link>
          </div>
          <TypeBasedProducts products={offerProducts} arrows={false} dots={true} autoplay={true} slidesToScroll={1}/>
        </div>
        <div className="px-4 lg:px-6 xl:px-0">
          {/* Title and Arrows */}
          <div className="flex items-end justify-between">
            <h2 className="text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mt-4">
              New Arrivals
            </h2>
            <Link
              href="/shop"
              className="text-gray-500 text-sm md:text-lg font-bold hover:underline hover:text-[#ffbd59]"
            >
             <span className="flex gap-1 items-center"> More Products <RiArrowGoForwardLine /></span>
            </Link>
          </div>
          <TypeBasedProducts products={newProducts} arrows={true} dots={false} autoplay={false} slidesToScroll={2}/>
        </div>
        <div className="px-4 lg:px-6 xl:px-0">
          {/* Tab Navigation */}
          <div className=" flex flex-col items-center">
            <h1 className="text-center text-2xl font-semibold">
              Recomended For You
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <button
                className={`text-sm md:text-lg  font-semibold mt-2 ${
                  activeTab === "featured"
                    ? "text-[#ffbd59] border-b-2 border-[#ffbd59]"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("featured")}
              >
                Featured
              </button>
              <button
                className={`text-sm md:text-lg  font-semibold mt-2 ${
                  activeTab === "best"
                    ? "text-[#ffbd59] border-b-2 border-[#ffbd59]"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("best")}
              >
                Best Selling
              </button>
            </div>
          </div>

          {/* Conditionally render products based on active tab */}
          {activeTab === "featured" && (
            <div className="py-4">
              <TypeBasedProducts products={featuredProducts} type="featured" arrows={false} dots={false} autoplay={true} slidesToScroll={2}/>
            </div>
          )}

          {activeTab === "best" && (
            <div className="py-4">
              <TypeBasedProducts products={bestProducts} type="best" arrows={false} dots={false} autoplay={true} slidesToScroll={2}/>
            </div>
          )}
        </div>

        <div className="px-4 lg:px-6 xl:px-0 mb-8">
          {/* Title and Arrows */}
          <div className="flex items-center justify-between">
            <h2 className="text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold ">
              Blog Posts
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id} // Assuming each blog has a unique 'id'
                title={blog.title} // Blog title
                image={blog.imageUrl} // Use default image if not available
                date={new Date(blog.createdAt).toLocaleDateString()} // Format date
                blogSlug={blog.slug} // Blog slug for linking
              />
            ))}
          </div>
        </div>
          {/* Scroll to Top Button */}
          {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-[#7d9626] text-white rounded-full shadow-lg transition-opacity duration-300 hover:bg-[#7c922d] focus:outline-none"
            style={{ opacity: showScrollButton ? 1 : 0 }}
          >
            <AiOutlineArrowUp size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
