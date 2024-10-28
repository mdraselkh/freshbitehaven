"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { SiMinutemailer } from "react-icons/si";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa6";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { TbCurrencyTaka } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { BsFillCartXFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import CartSidebar from "./CartSidebar";
import { signOut, useSession } from "next-auth/react";
import { RxAvatar } from "react-icons/rx";
import { CgLogOut } from "react-icons/cg";
import {
  MdOutlineAccountCircle,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import logo from "@/public/logo.png";
import { RiListUnordered } from "react-icons/ri";

const DesktopNav = () => {
  const [selectedCategoryMenu, setSelectedCategoryMenu] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const { cart } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const [height, setHeight] = useState("h-28");
  const [homeData, setHomeData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
 

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
  const fetchSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const getSubcategories = (categoryId) => {
    return subcategories.filter((sub) => sub.categoryId === categoryId);
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/homedata");
        if (!response.ok) {
          throw new Error("Failed to fetch home data.");
        }
        const data = await response.json();
        setHomeData(data[0]);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    if (cart && Array.isArray(cart.cartItems)) {
      const count = cart.cartItems.length || 0;
      setCartCount(count);

      const subtotal = cart.cartItems.reduce((acc, item) => {
        if (item.quantity) {
          const itemPrice = item.discountPrice || item.price;
          return acc + item.quantity * itemPrice;
        }
        return acc;
      }, 0);

      setTotalPrice(subtotal);
    } else {
      console.warn("Invalid cart data:", cart);
    }
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHeight("h-16");
      } else {
        setHeight("h-28");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleItemClick = (item1, item2) => {
    if (item1 && item2) {
      const formattedItem1 = item1
        .toLowerCase()
        .replace(/&/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      const formattedItem2 = item2
        .toLowerCase()
        .replace(/&/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      router.push(`/product-category/${formattedItem1}/${formattedItem2}`);
    } else {
      const formattedItem1 = item1
        .toLowerCase()
        .replace(/&/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      router.push(`/product-category/${formattedItem1}`);
    }
    setIsDropdownVisible(false);
  };

  const icons = [
    { component: FaFacebookF, key: "facebook" },
    { component: FaTwitter, key: "twitter" },
    { component: FaPinterest, key: "pinterest" },
    { component: FaLinkedinIn, key: "linkedin" },
    { component: FaTelegram, key: "telegram" },
  ];
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const listItems = [
    { id: 1, link: "/", label: "Home" },
    { id: 2, link: "/shop", label: "Shop" },
    { id: 3, link: "/offers", label: "Offers" },
    { id: 4, link: "/blogs", label: "Blogs" },
    { id: 5, link: "/about-us", label: "About Us" },
    { id: 6, link: "/contact-us", label: "Contact Us" },
  ];

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    const category = selectedCategory.toLowerCase();
    // const subCategory = selectedSubCategory.toLowerCase();
    const url = new URL("/search", window.location.origin);

    if (query) {
      url.searchParams.set("query", query);
    }
    if (category) {
      url.searchParams.set("category", category);
    }
    // if (subCategory) {
    //   url.searchParams.set("subcategory", subCategory); // Add the subcategory to the URL params
    // }

    router.push(url.toString());
    setSearchQuery("");
    setSelectedCategory("");
    // setSelectedSubCategory(""); // Reset the selected subcategory state
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className=" w-full top-0 left-0 sticky z-40">
      {/* top header */}
      <div className={"bg-[#ffbd59] h-10"}>
        <div className="container mx-auto flex items-center justify-between h-full px-8 ">
          <div className="flex items-center justify-center gap-4 text-gray-100 h-full">
            <div className="flex items-center justify-center gap-2 text-xs font-bold">
              <Link href="/">
                <FaPhone className="hover:text-gray-300" />
              </Link>
              {homeData && <p>Hotline: {homeData.hotline}</p>}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold border-l border-r border-[#7d9626] px-2 h-full">
              <Link href="/">
                <SiMinutemailer size={16} className="hover:text-gray-300" />
              </Link>
              {homeData && <p>Email: {homeData.email}</p>}
            </div>
          </div>
          <div className="flex items-center justify-center border-l border-r border-[#7d9626] px-2 h-full">
            <ul className="flex text-white items-center justify-center gap-2 ">
              {icons.map(({ component: Icon, key }) => (
                <li key={key}>
                  <Icon className="hover:text-gray-800" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* middle header */}
      <div
        className={`bg-slate-200 ${height} z-40 transition-all duration-300 ease-in-out`}
      >
        <div className="container mx-auto flex items-center justify-between xl:px-5 h-full">
          {/* Image */}
          <Link href="/">
            {homeData && homeData.logo && (
              <Image
                src={homeData.logo}
                alt="Logo"
                width={112}
                height={112}
                className="w-28 h-28 object-fit py-4"
              />
            )}
          </Link>

          {/*Search Input with Icon */}
          <div className="flex items-center border-2 border-[#7d9626] w-1/2 bg-[#E7EFF2] ">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Products"
              className="xl:px-4 xl:py-3 px-2 py-2 text-sm text-gray-600 placeholder:text-gray-600  border-r-2 focus:outline-none w-[90%] xl:w-3/4 h-full border-[#7d9626] bg-[#E7EFF2]"
            />

            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={(e) => {
                const cleanedValue = e.currentTarget.value.replace(
                  /^\s*—\s*/,
                  ""
                );
                setSelectedCategory(cleanedValue);
              }}
              className="focus:outline-none text-gray-600 text-xs px-2 bg-[#E7EFF2] cursor-pointer font-light h-full"
            >
              <option value="">SELECT CATEGORY</option>

              {categories.map((category) => {
                // Filter subcategories for this specific category
                const matchingSubcategories = subcategories.filter(
                  (sub) => sub.categoryId === category.id
                );

                // Render category option
                const categoryOption = (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                );

                return (
                  <React.Fragment key={category.id}>
                    {categoryOption}
                    {matchingSubcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.name}>
                        {"— " + subcat.name}
                      </option>
                    ))}
                  </React.Fragment>
                );
              })}
            </select>

            <button
              className="px-3 w-10 h-[35px] xl:h-[42px] bg-[#7d9626]"
              onClick={handleSearch}
            >
              <FaSearch className="text-gray-50 lg:text-xl" />
            </button>
          </div>

          {/* User Login Icon and Cart Icon */}
          <div className="flex items-center space-x-2 xl:space-x-3 mr-10">
            <button
              onClick={toggleCart}
              className="relative flex xl:gap-2 lg:gap-1 items-center justify-center cursor-pointer"
            >
              <LuShoppingCart className="text-gray-700 hover:text-gray-500 xl:text-3xl text-2xl" />
              <span className="absolute -top-1 -right-1 bg-[#fcb74f] text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            <span className="flex items-center justify-center ml-1 text-[#7d9626] font-semibold">
              <TbCurrencyTaka className="text-[#7d9626] xl:text-2xl text-xl" />
              {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      {/* main header */}
      <div
        className={`bg-white border-t-2 border-b-2 border-[#fcb74f] h-12 xl:h-14`}
      >
        <div className="container mx-auto flex items-center justify-between h-full gap-16 px-10">
          <div className="relative z-30 h-full" ref={dropdownRef}>
            {/* Select Button */}
            <div
              className="flex items-center cursor-pointer gap-2 bg-white hover:bg-[#7d9626] text-[#7d9626] hover:text-white font-semibold p-2 border-r-2 border-l-2 border-[#fcb74f] h-full"
              onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              <span className="flex items-start justify-center gap-3 text-xs xl:text-sm">
                <GiHamburgerMenu size={20} />
                Products Category
              </span>
              <IoIosArrowDown
                className={`transition-transform ${
                  isDropdownVisible ? "rotate-0" : "rotate-180"
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownVisible && (
              <div className="absolute left-0 top-full mt-1 w-full bg-[#fcb74f] border border-[#fcb74f] shadow-md">
                <div className="text-sm">
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <div
                        key={index}
                        className="relative p-2 bg-white hover:bg-gray-300 cursor-pointer flex justify-between items-center"
                        onClick={() => handleItemClick(category.name)}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <span>{category.name}</span>
                        {getSubcategories(category.id).length > 0 && (
                          <IoIosArrowForward />
                        )}

                        {/* Subcategories Dropdown */}
                        {hoveredCategory === category.id &&
                          getSubcategories(category.id).length > 0 && (
                            <div className="absolute left-full top-0 ml-1 w-48 bg-white border border-gray-300 shadow-md">
                              {getSubcategories(category.id).map(
                                (subcat, subIndex) => (
                                  <div
                                    key={subIndex}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent the event from bubbling up
                                      handleItemClick(
                                        subcat.category.name,
                                        subcat.name
                                      ); // Call with subcategory name
                                    }}
                                  >
                                    {subcat.name}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">
                      No categories available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center lg:gap-2 xl:gap-5 z-30">
            {listItems.map((item, index) => (
              <div key={index} className="text-xs xl:text-sm ">
                {item.children ? (
                  <div className="relative group px-2 py-3 transition-all">
                    <span className="flex cursor-pointer items-center gap-2 text-gray-800 font-semibold hover:text-gray-900">
                      {item.label}
                      <IoIosArrowDown className="rotate-180 transition-all group-hover:rotate-0" />
                    </span>
                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-12 hidden w-auto flex-col gap-1 rounded bg-gray-50 py-3 shadow-md transition-all group-hover:flex">
                      {item.children.map(({ label, link }, childIndex) => (
                        <Link
                          key={childIndex}
                          href={link ?? "#"}
                          className="flex cursor-pointer items-center py-1 text-neutral-500 hover:text-black"
                        >
                          <span className="font-medium whitespace-nowrap px-3">
                            {label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={item.link ?? "#"} key={index}>
                    <span className="text-gray-800 font-semibold px-2 hover:text-[#7d9626]">
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {<CartSidebar isOpen={isCartOpen} onClose={toggleCart} />}
    </header>
  );
};

export default DesktopNav;
