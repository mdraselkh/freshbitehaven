"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AiOutlineFileText,
  AiOutlineGift,
  AiOutlineHome,
  AiOutlineMenuUnfold,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaSearch, FaRegUser, FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { TbCategoryPlus, TbCurrencyTaka } from "react-icons/tb";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdOutlineAccountCircle,
  MdInfo,
  MdContactMail,
  MdOutlineSpaceDashboard,
  MdFormatListBulletedAdd,
  MdOutlineDiscount,
  MdOutlineSearchOff,
  MdOutlineSearch,
} from "react-icons/md";
import { IoCloseSharp, IoListOutline } from "react-icons/io5";
import CartSidebar from "./CartSidebar";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { RxAvatar } from "react-icons/rx";
import { CgLogOut, CgMenuGridR, CgMenuRight } from "react-icons/cg";
import { RiListUnordered } from "react-icons/ri";
import { GiFishing, GiLeafSkeleton } from "react-icons/gi";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

const MobileNav = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const { cart } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [homeData, setHomeData] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);

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
  const toggleDrawer = () => setIsOpen(!isOpen);
  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
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

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

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

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    const url = new URL("/search", window.location.origin);

    if (query) {
      url.searchParams.set("query", query);
    }

    router.push(url.toString());
    setSearchQuery("");
  };

  const menuItems = [
    { name: "Home", href: "/", icon: <AiOutlineHome /> },
    { name: "Shop", href: "/shop", icon: <AiOutlineShoppingCart /> },
    { name: "Offers", href: "/offers", icon: <AiOutlineGift /> },
    { name: "Blogs", href: "/blogs", icon: <AiOutlineFileText /> },
    { name: "About Us", href: "/about-us", icon: <MdInfo /> },
    { name: "Contact Us", href: "/contact-us", icon: <MdContactMail /> },
  ];

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
  };

  return (
    <>
      <nav className="w-full top-0 left-0 sticky z-40">
        {/* Top Nav */}

        <div className="w-full bg-[#fceeda] py-1">
          <div className=" flex items-center justify-center px-3">
            <div className="font-medium text-[10px] md:text-xs text-center text-gray-900">
            {homeData && <p>Hotline {homeData.hotline}</p>}
            </div>
          </div>
        </div>
        {/* Bottom Nav */}
        <div className="w-full py-[6px] bg-[#7d9626]">
          <div className="flex items-center justify-between px-3 gap-4">
            <button className="cursor-pointer" onClick={toggleDrawer}>
              <CgMenuRight size={24} className="text-slate-200" />
            </button>
            <Link href="/" className="ml-8">
              {homeData && homeData.logo && (
                <Image
                  src={homeData.logo}
                  alt="Logo"
                  width={100}
                  height={100}
                  className="w-12 h-12 object-cover"
                />
              )}
            </Link>
            <div className="flex flex-row gap-2 items-center justify-center px-2">
              <button
                className="relative flex gap-2 items-center justify-center cursor-pointer"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <LuShoppingCart className="text-slate-200 hover:text-slate-400 text-2xl" />
                <span className="absolute -top-[1px] -right-[2px] flex items-center justify-center w-3 h-3 bg-[#fcb74f] text-white text-[8px] font-semibold rounded-full p-[5px]">
                  {cartCount}
                </span>
              </button>
              <span className="flex items-center text-slate-200 justify-center lg:ml-1 xl:ml-3 text-sm font-semibold">
                <TbCurrencyTaka className="text-slate-200 xl:text-xl text-lg" />
                {totalPrice.toLocaleString()}
              </span>

              {/* Search Button */}
              <button
                className="p-[2px] border border-slate-200 ml-2"
                onClick={() => setIsSearchOpen(!isSearchOpen)} // Toggle search field visibility
              >
                {isSearchOpen ? (
                  <MdOutlineSearchOff
                    size={15}
                    className="text-slate-200 hover:text-slate-400 font-semibold"
                  />
                ) : (
                  <MdOutlineSearch
                    size={15}
                    className="text-slate-200 hover:text-slate-400 font-semibold"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Search Field Dropdown */}
          {isSearchOpen && (
            <div
              className={`w-full flex items-center justify-center py-1 overflow-hidden transition-all duration-300 ease-in-out ${
                isSearchOpen
                  ? "max-h-20 scale-y-100 opacity-100"
                  : "max-h-0 scale-y-0 opacity-0"
              }`}
              style={{ transformOrigin: "top" }}
            >
              <div className="flex items-center justify-between border-2 border-[#7d9626] w-[90%] bg-gray-50">
                <div className="flex items-center justify-end w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Products"
                  className="text-xs text-gray-600 placeholder:text-gray-600 w-full px-4 focus:outline-none h-full  bg-gray-50"
                />
                <IoCloseSharp className="text-xs text-black mx-3" onClick={()=>setSearchQuery('')}/>
                </div>

                <button
                  className="px-2 w-6 h-6 bg-[#7d9626]"
                  onClick={handleSearch}
                >
                  <FaSearch className="text-gray-50 text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleDrawer}
          />
        )}

        {/* Drawer Content */}
        <div
          className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          <button
            onClick={toggleDrawer}
            className={`absolute top-1 transition-all duration-300 ${
              isOpen ? '-right-24' : 'right-0'
            } border-2 rounded-full p-1 border-[#7d9626] text-gray-50 hover:text-gray-800 focus:outline-none ${
              isOpen ? 'block' : 'hidden'
            }`}
          >
            <IoCloseSharp size={24} />
          </button>
          {/* Tabs for Main Menu and Category Menu */}
          <div className="flex ">
            <button
              onClick={() => setActiveTab("main")}
              className={`w-1/2 py-3 text-center ${
                activeTab === "main"
                  ? "border-2 border-[#7d9626] text-[#7d9626]"
                  : "text-gray-600"
              }`}
            >
              <span className="flex items-center justify-center space-x-1 sm:space-x-2">
                <CgMenuGridR className="sm:text-xl text-lg" />
                Main Menu
              </span>
            </button>
            <button
              onClick={() => setActiveTab("category")}
              className={`w-1/2 py-3 text-center ${
                activeTab === "category"
                  ? "border-2 border-[#7d9626] text-[#7d9626]"
                  : "text-gray-600"
              }`}
            >
              <span className="flex items-center space-x-1 sm:space-x-2 justify-center">
                <TbCategoryPlus className="sm:text-xl text-lg" />
                Category Menu
              </span>
            </button>
          </div>

          {/* Content for each Tab */}
          <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
            {/* Main Menu */}
            {activeTab === "main" && (
              <div>
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center border-2 gap-2 m-1 p-2 hover:bg-gray-100 hover:border-[#7d9626]  text-gray-800"
                    onClick={toggleDrawer}
                  >
                    <span className="text-[#7d9626]">{item.icon}</span>
                    <span className="hover:text-[#7d9626]">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Category Menu */}
            {activeTab === "category" && (
              <div>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <div key={index} className="mb-2">
                      {/* Category Item with Expand/Collapse Icon */}
                      <div
                        className="flex justify-between items-center p-2 bg-[#f0facc] hover:bg-[#eafab2] cursor-pointer rounded-md"
                        onClick={() => {
                          if (getSubcategories(category.id).length > 0) {
                            toggleCategory(category.id);
                          } else {
                            handleItemClick(category.name);
                            toggleDrawer();
                          }
                        }}
                      >
                        <span
                          onClick={() => {
                            handleItemClick(category.name);
                            toggleDrawer();
                          }}
                        >
                          {category.name}
                        </span>
                        {getSubcategories(category.id).length > 0 &&
                          (expandedCategory === category.id ? (
                            <FaMinus className="text-gray-600" />
                          ) : (
                            <FaPlus className="text-gray-600" />
                          ))}
                      </div>

                      {/* Subcategories Dropdown */}
                      {expandedCategory === category.id &&
                        getSubcategories(category.id).length > 0 && (
                          <div className="pl-4 border-l border-gray-300 mt-2">
                            {getSubcategories(category.id).map(
                              (subcat, subIndex) => (
                                <div
                                  key={subIndex}
                                  className="flex justify-between items-center p-2 bg-white hover:bg-gray-100 cursor-pointer rounded-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleItemClick(
                                      subcat.category.name,
                                      subcat.name
                                    );
                                    toggleDrawer();
                                  }}
                                >
                                  <span>{subcat.name}</span>
                                  <IoIosArrowForward className="text-gray-400" />
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
            )}
          </div>
        </div>
      </div>

      {<CartSidebar isOpen={isCartOpen} onClose={toggleCart} />}
    </>
  );
};

export default MobileNav;
