"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterest,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import FishCards from "./ProductCards";
import RelatedProducts from "./RelatedProducts";
import Link from "next/link";
import ReviewCard from "./ReviewCard";
import { RxAvatar } from "react-icons/rx";
import { useSession } from "next-auth/react";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { useRouter } from "next/navigation";
import { IoBagHandleSharp } from "react-icons/io5";
import { useStock } from "@/app/context/StockContext";

const ProductDetails = ({ id }) => {
  const [productDetails, setProductDetails] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(true);
  const { stock, updateStock } = useStock();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBuy, setIsLoadingBuy] = useState(false);

  const icons = [
    { component: FaFacebookF, key: "facebook" },
    { component: FaTwitter, key: "twitter" },
    { component: FaPinterest, key: "pinterest" },
    { component: FaLinkedinIn, key: "linkedin" },
    { component: FaTelegram, key: "telegram" },
  ];

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
          const res = await fetch(`/api/products`);
          if (!res.ok) {
            throw new Error("Failed to fetch products");
          }

          const data = await res.json();
          const availableProducts = data.filter(
            (product) => product.status === "active"
          );

          setProductDetails(availableProducts);

          const matchedProduct = availableProducts.find(
            (product) => product.id === Number(id)
          );

          if (matchedProduct) {
            setCurrentProduct(matchedProduct);
          } else {
            console.error("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };
      fetchProduct();
    }
  }, [id]);

  // console.log(currentProduct.id);

  const path = (item) => {
    const formattedItem = item
      .toLowerCase()
      .replace(/&/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    return formattedItem;
  };

  useEffect(() => {
    if (
      currentProduct?.category &&
      currentProduct?.subcategory &&
      currentProduct?.category.name &&
      currentProduct?.subcategory.name
    ) {
      const filterProducts = productDetails.filter(
        (product) =>
          product.category.name === currentProduct.category.name &&
          product.subcategory.name === currentProduct.subcategory.name
      );

      setRelatedProduct(filterProducts);
    } else if (currentProduct?.category.name) {
      const filterProducts = productDetails.filter(
        (product) => product.category.name === currentProduct.category.name
      );

      setRelatedProduct(filterProducts);
    }
  }, [productDetails, currentProduct]);

  console.log(relatedProduct);

  const handleNextProduct = () => {
    if (relatedProduct.length > 1) {
      const currentIndex = relatedProduct.findIndex(
        (product) => product.id === currentProduct.id
      );
      console.log(currentIndex);

      const nextIndex = (currentIndex + 1) % relatedProduct.length; // Wrap around to the beginning
      const nextProduct = relatedProduct[nextIndex];
      console.log(nextIndex);

      setCurrentProduct(nextProduct);
      if (nextProduct.category && nextProduct.subcategory) {
        router.push(
          `/product-category/${path(nextProduct.category.name)}/${path(
            nextProduct.subcategory.name
          )}/${nextProduct.id}`
        );
      } else {
        router.push(
          `/product-category/${path(nextProduct.category.name)}/${
            nextProduct.id
          }`
        ); // Update URL when product changes
      }
    }
  };

  const handlePrevProduct = () => {
    if (relatedProduct.length > 1) {
      const currentIndex = relatedProduct.findIndex(
        (product) => product.id === currentProduct.id
      );

      const prevIndex =
        (currentIndex - 1 + relatedProduct.length) % relatedProduct.length; // Wrap around to the end
      const prevProduct = relatedProduct[prevIndex];

      setCurrentProduct(prevProduct);
      if (prevProduct.category && prevProduct.subcategory) {
        router.push(
          `/product-category/${path(prevProduct.category.name)}/${path(
            prevProduct.subcategory.name
          )}/${prevProduct.id}`
        );
      } else {
        router.push(
          `/product-category/${path(prevProduct.category.name)}/${
            prevProduct.id
          }`
        ); // Update URL when product changes
      }
    }
  };

  useEffect(() => {
    if (!loading && currentProduct) {
      const productId = String(currentProduct.id);

      const storedStock = JSON.parse(localStorage.getItem("stock")) || {};

      if (currentProduct.stock > 0) {
        storedStock[productId] = currentProduct.stock;
        localStorage.setItem("stock", JSON.stringify(storedStock)); // Set initial stock in localStorage
        // setStock(storedStock[productId]);
      }

      console.log(
        "Product Stock:",
        currentProduct.stock,
        "Current Stock in LocalStorage:",
        storedStock[currentProduct.id]
      );
    }
  }, [loading, currentProduct, stock]);

  const increaseQuantity = () => {
    if (quantity < (stock[currentProduct.id] || 0)) {
      setQuantity(quantity + 1);
    } else {
      toast.warning("Cannot exceed stock limit");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const router1 = useRouter();

  const buyNow = async (product, checkout) => {
    if (checkout) {
      setIsLoadingBuy(true); // Reset loading for checkout button
      router1.push("/checkout"); // Navigate to checkout
    } else {
      setIsLoading(true); // Reset loading for add to cart button
    }

    setTimeout(() => {
      try {
        const currentStock = stock[product.id] || product.stock;

        if (currentStock <= 0) {
          toast.warn("Product is out of stock");
          return;
        }

        const cartItem = {
          productId: product.id,
          productName: product.name,
          productLocalName: product.localName,
          productImage: product.image,
          sizeId: product.sizes[0].id,
          productSizes: product.sizes[0].weight,
          price: product.sizes[0].price,
          discountPrice: product.sizes[0].discountPrice,
          quantity,
        };

        const updatedCartItems = [...cart.cartItems];
        const existingItemIndex = updatedCartItems.findIndex(
          (item) =>
            item.productId === cartItem.productId &&
            item.sizeId === cartItem.sizeId
        );

        if (existingItemIndex >= 0) {
          const existingQuantity = updatedCartItems[existingItemIndex].quantity;
          const newQuantity = existingQuantity + quantity;

          if (newQuantity > currentStock && currentStock === 0) {
            toast.warn("Cannot add more than available stock");
            return;
          }

          updatedCartItems[existingItemIndex].quantity = newQuantity;
        } else {
          updatedCartItems.push(cartItem);
        }

        setCart({ cartItems: updatedCartItems });

        // Update stock using context
        updateStock(product.id, -quantity);
        if (!checkout) {
          toast.success("Item added to cart");
        }

        setQuantity(1);
      } catch {
        console.log("Error adding product to cart");
      } finally {
        if (checkout) {
          setIsLoadingBuy(false); // Reset loading for checkout button
          router1.push("/checkout"); // Navigate to checkout
        } else {
          setIsLoading(false); // Reset loading for add to cart button
        }
      }
    }, 2000);
  };

  let discountPrice = null;
  if (
    currentProduct &&
    currentProduct.sizes &&
    currentProduct.sizes.length > 0
  ) {
    discountPrice = parseFloat(
      currentProduct.sizes[0].price -
        (currentProduct.sizes[0].discountPrice || 0)
    ).toFixed(2); // Adjusting to fixed to show two decimal places
    console.log(discountPrice);
  }

  const [zoomStyle, setZoomStyle] = useState({
    display: "none",
    zoomX: "0%",
    zoomY: "0%",
  });

  const imageZoomRef = useRef(null);

  const handleMouseMove = (event) => {
    const imageZoom = imageZoomRef.current;
    const rect = imageZoom.getBoundingClientRect();
    const pointer = {
      x: ((event.clientX - rect.left) / imageZoom.offsetWidth) * 100,
      y: ((event.clientY - rect.top) / imageZoom.offsetHeight) * 100,
    };
    setZoomStyle({
      display: "block",
      zoomX: pointer.x + "%",
      zoomY: pointer.y + "%",
    });
  };

  const handleMouseOut = () => {
    setZoomStyle({
      display: "none",
      zoomX: "0%",
      zoomY: "0%",
    });
  };

  const router = useRouter();

  return (
    <div className="lg:p-10 p-3">
      <div className=" mx-auto md:max-w-7xl">
        <div className="flex justify-end items-center mb-6 w-full">
          {relatedProduct.length > 1 && (
            <button
              onClick={handlePrevProduct}
              className="mr-4 hover:bg-[#ffbd59] hover:text-black text-[#ffac2e] hover:rounded-full font-bold"
            >
              <TfiArrowCircleLeft className="text-3xl" />
            </button>
          )}
          {relatedProduct.length > 1 && (
            <button
              onClick={handleNextProduct}
              className="hover:bg-[#ffbd59] hover:text-black text-[#ffac2e] hover:rounded-full font-bold"
            >
              <TfiArrowCircleRight className="text-3xl" />
            </button>
          )}
        </div>
        {loading ? ( // Show loading indicator
          <div className="flex items-center justify-center h-full">
            <p className="text-xl font-bold">Loading...</p>
            {/* You can add an animation icon here */}
            {/* <div className="loader"></div> */}
          </div>
        ) : (
          <div className="flex items-center flex-col gap-6">
            <div className=" flex items-start flex-col md:flex-row justify-between gap-4 shadow-lg rounded-md bg-white p-5 w-full">
              <div
                id="imageZoom"
                className="relative w-full  md:w-1/2 overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseOut}
                ref={imageZoomRef}
              >
                {currentProduct.sizes[0].discountPrice && (
                  <div className="absolute top-1 left-1 bg-red-100 text-white text-xs sm:text-xs px-2 py-1 rounded z-10">
                    <span className="flex items-center text-red-500 font-bold">
                      {discountPrice}
                      <TbCurrencyTaka /> Save
                    </span>
                  </div>
                )}
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  width={500}
                  height={500}
                  className="object-cover border p-2 rounded-md md:w-[500px] md:h-[500px] w-full  "
                />

                <div
                  className="absolute top-0 left-0 w-[500px] h-[500px]"
                  style={{
                    display: zoomStyle.display,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backgroundImage: `url(${currentProduct.image})`,
                    backgroundSize: "200%",
                    backgroundPosition: `${zoomStyle.zoomX} ${zoomStyle.zoomY}`,
                    pointerEvents: "none",
                  }}
                ></div>
              </div>

              <div className="flex flex-col items-start justify-start w-full  md:w-1/2 px-2 md:py-5 py-2">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-800 ">
                  {currentProduct.name} {currentProduct.sizes[0].weight}
                  <span className="sm:mx-2 mx-1">
                    {currentProduct.localName}
                  </span>
                </h1>

                <div className="sm:mt-4 mt-2">
                  {currentProduct.sizes[0].discountPrice ? (
                    <div className="flex items-center flex-row">
                      {currentProduct.sizes[0].discountPrice && (
                        <p className="text-[#7d9626] sm:mr-2 flex items-center font-bold text-sm md:text-lg">
                          <TbCurrencyTaka className="sm:text-xl text-lg" />
                          {currentProduct.sizes[0].discountPrice.toLocaleString()}
                        </p>
                      )}
                      <p className="text-gray-400 flex items-center font-semibold text-xs md:text-sm line-through">
                        <TbCurrencyTaka className="sm:text-xl text-lg" />
                        {currentProduct.sizes[0].price.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#7d9626] flex items-center font-bold text-sm md:text-lg">
                      <TbCurrencyTaka className="sm:text-xl text-lg" />
                      {currentProduct.sizes[0].price.toLocaleString()}
                    </p>
                  )}
                  {currentProduct.stock > 0 && (
                    <h3 className="font-semibold mt-2 text-sm md:text-lg text-gray-600">
                      In Stock(
                      <span className="text-[#7d9626]">
                        {stock[currentProduct.id]}
                      </span>
                      )
                    </h3>
                  )}
                </div>

                <div className="flex items-center justify-between sm:my-6 my-2 gap-4">
                  <div className="flex items-center sm:space-x-5 space-x-2 border-2 border-gray-800 bg-white">
                    <button
                      className="sm:px-4 sm:py-2 px-2 bg-gray-300 hover:bg-gray-400 border-r-2 border-gray-800"
                      onClick={decreaseQuantity}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      className="sm:px-4 sm:py-2 px-2 bg-gray-300 hover:bg-gray-400 border-l-2 border-gray-800"
                      onClick={increaseQuantity}
                    >
                      +
                    </button>
                  </div>
                  <h2 className="text-2xl font-semibold flex items-center">
                    = <TbCurrencyTaka className="md:text-2xl text-lg" />
                    {quantity * currentProduct.sizes[0].price}
                  </h2>
                </div>
                <div className="sm:my-4 my-2 w-full">
                  {stock[currentProduct.id] <= 0 ? (
                    <button
                      className=" md:px-3 md:py-2 px-2 py-1  w-2/5 text-black font-semibold sm:text-base text-xs border-2 border-gray-300 bg-gray-200 cursor-not-allowed"
                      disabled
                    >
                      <span className="flex mx-1 items-center justify-center gap-2">
                        <RiShoppingBag3Fill className="text-2xl" /> Out of Stock
                      </span>
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2 mb-2">
                      <button
                        className={`md:px-3 md:py-2 px-2 py-1 w-2/5 text-black font-semibold sm:text-base text-xs border-2 border-[#7d9626] 
                                 ${
                                   isLoading
                                     ? "bg-[#7d9626] bg-opacity-50 backdrop-blur-sm cursor-not-allowed border-none text-white"
                                     : "hover:bg-[#7d9626] hover:text-white"
                                 } flex items-center justify-center gap-2`}
                        onClick={() => buyNow(currentProduct, false)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="md:w-5 md:h-5 w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                            <RiShoppingBag3Fill className="text-xl md:text-2xl" />
                            <span className="text-[8px] md:text-base">Adding to Bag...</span>
                          </div>
                        ) : (
                          <span className="flex items-center gap-2">
                            <RiShoppingBag3Fill className="text-xl md:text-2xl" />
                            Add To Bag
                          </span>
                        )}
                      </button>

                      <button
                        className={`md:px-3 md:py-2 px-2 py-1  w-2/5 text-white font-semibold sm:text-base text-xs bg-[#7d9626] ${
                          isLoadingBuy
                            ? "bg-gray-400 bg-opacity-50 backdrop-blur-sm cursor-not-allowed border-2 border-[#7d9626] text-black"
                            : "hover:bg-white hover:text-black hover:border-2 hover:border-[#7d9626]"
                        } flex items-center justify-center gap-2 `}
                        onClick={() => {
                          buyNow(currentProduct, true);
                        }}
                        disabled={isLoadingBuy}
                      >
                        {isLoadingBuy ? (
                          <div className="flex mx-1 items-center justify-center gap-2">
                            <div className="md:w-5 md:h-5 w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                            <RiShoppingBag3Fill className="text-xl md:text-2xl" />
                            <span>Buying...</span>
                          </div>
                        ) : (
                          <span className="flex mx-1 items-center justify-center gap-2">
                            <RiShoppingBag3Fill className="text-xl md:text-2xl" />{" "}
                            Buy Now
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-300 w-full my-2">
                  <h2 className="my-4 text-lg font-semibold">
                    Description:{" "}
                    <span className="text-gray-600 ml-2  text-sm md:text-base">
                      {currentProduct.description}
                    </span>
                  </h2>
                  <h3 className="my-4 text-lg font-semibold">
                    Category:{" "}
                    <span className="text-gray-600 ml-2 text-sm md:text-base">
                      {currentProduct?.category.name}
                      {currentProduct?.subcategory
                        ? "," + currentProduct.subcategory.name
                        : ""}
                    </span>
                  </h3>

                  <div className="flex gap-4">
                    <p className="text-lg font-semibold">Share: </p>
                    <ul className="flex text-[#ffbd59] items-center justify-center gap-2 ">
                      {icons.map(({ component: Icon, key }) => (
                        <li key={key}>
                          <Icon className="hover:text-[#cd8c2b] cursor-pointer" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <RelatedProducts
          products={productDetails}
          category={currentProduct?.category.name}
          subcategory={
            currentProduct?.subcategory ? currentProduct?.subcategory.name : ""
          }
          currentProduct={currentProduct}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
