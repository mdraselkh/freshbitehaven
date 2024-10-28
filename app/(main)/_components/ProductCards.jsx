"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useStock } from "@/app/context/StockContext"; // Importing the useStock context
import { RiShoppingBag3Fill } from "react-icons/ri";

const ProductCards = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = useCart();
  const { stock, updateStock } = useStock();
  const [isLoading, setIsLoading] = useState(false);

  const productId = String(product.id);
  // console.log(stock);

  useEffect(() => {
    // Initialize the stock from local storage
    const storedStock = JSON.parse(localStorage.getItem("stock")) || {};

    if (product.stock > 0) {
      storedStock[productId] = product.stock;
      localStorage.setItem("stock", JSON.stringify(storedStock)); // Set initial stock in localStorage
      // setStock(storedStock[productId]);
    }

    console.log(
      "Product Stock:",
      product.stock,
      "Current Stock in LocalStorage:",
      storedStock[productId]
    );
  }, [productId, product.stock, stock]); // Only run when productId or product.stock changes

  const increaseQuantity = () => {
    if (quantity < (stock[productId] || 0)) {
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

  const addToCart = async () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const currentStock = stock[product.id] || product.stock;

        if (currentStock <= 0) {
          toast.error("Product is out of stock");
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
            toast.error("Cannot add more than available stock");
            return;
          }

          updatedCartItems[existingItemIndex].quantity = newQuantity;
        } else {
          updatedCartItems.push(cartItem);
        }

        setCart({ cartItems: updatedCartItems });

        // Update stock using context
        updateStock(product.id, -quantity); // Reduce stock by quantity added to cart
        toast.success("Item added to cart");
        setQuantity(1);
      } catch {
        console.log("Error adding product to cart");
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  console.log(stock);

  const path = (item) => {
    const formattedItem = item
      .toLowerCase()
      .replace(/&/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    return formattedItem;
  };

  return (
    <div className="overflow-hidden shadow w-[195px] md:w-[240px] lg:w-[248px] border-2 hover:shadow-2xl hover:transform hover:transition-transform hover:duration-300">
      <div className="relative group">
        {product.sizes[0].discountPrice && (
          <div className="absolute top-1 left-1 bg-red-100 text-white text-xs sm:text-xs px-2 py-1 rounded z-10">
            <span className="flex items-center text-red-500 font-bold">
              {parseFloat(
                product.sizes[0].price - product.sizes[0].discountPrice
              ).toFixed(2)}
              <TbCurrencyTaka /> Save
            </span>
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={200}
          className="object-fit h-[195px] md:h-[240px] lg:h-[248px] w-[195px] md:w-[240px] lg:w-[248px] duration-300 ease-in-out transition-transform transform p-2 z-0"
        />
        <Link
          href={`/product-category/${path(product.category.name)}${
            product.subcategory ? "/" + path(product.subcategory.name) : ""
          }/${product.id}`}
        >
          <div className="absolute inset-0 bg-gray-500 bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-95">
            <FaBoxOpen className="md:text-4xl text-2xl text-gray-800 p-3 rounded-full w-16 h-16 hover:text-[#ffbd59] bg-gray-50" />
          </div>
        </Link>
      </div>
      <div className="sm:p-3 px-3 py-2 lg:w-[248px] md:w-[240px] w-[195px]">
        <div className="h-[35px]">
          <h3 className="text-xs md:text-base font-semibold text-gray-800 ">
            {product.name} {product.sizes[0].weight}
            <span className="sm:mx-2 mx-1">{product.localName}</span>
          </h3>
        </div>
        <div className="flex items-center justify-between sm:mt-4 mt-1">
          <div>
            {product.sizes[0].discountPrice ? (
              <div className="flex items-center">
                <p className="text-[#7d9626] sm:mr-2 flex items-center font-bold text-sm md:text-lg">
                  <TbCurrencyTaka className="sm:text-xl text-lg" />
                  {product.sizes[0].discountPrice.toLocaleString()}
                </p>
                <p className="text-gray-400 flex items-center font-semibold text-xs md:text-sm line-through">
                  <TbCurrencyTaka className="sm:text-xl text-lg" />
                  {product.sizes[0].price.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-[#7d9626] flex items-center font-bold text-sm md:text-lg">
                <TbCurrencyTaka className="sm:text-xl text-lg" />
                {product.sizes[0].price.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center md:space-x-3 space-x-1 bg-white">
            <button
              className="md:px-2 md:py-1 px-1 rounded bg-slate-50"
              onClick={decreaseQuantity}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className="md:px-2 md:py-1 px-1 rounded bg-slate-50"
              onClick={increaseQuantity}
            >
              +
            </button>
          </div>
        </div>
        <div className="sm:mt-4 mt-1">
          {stock[productId] <= 0 ? (
            <button
              className="md:px-3 md:py-2 p-2 w-full text-black font-semibold sm:text-base text-xs border-2 border-gray-300 bg-gray-200 cursor-not-allowed"
              disabled
            >
              <span className="flex mx-1 items-center justify-center gap-2">
                <RiShoppingBag3Fill className="text-xl md:text-2xl" /> Out of
                Stock
              </span>
            </button>
          ) : (
            <button
              className={`md:px-3 md:py-2 p-2 w-full text-black font-semibold sm:text-base text-xs border-2 border-[#ffbd59] bg-[#ffbd59] ${
                                   isLoading
                                     ? "bg-[#ffbd59] bg-opacity-50 backdrop-blur-sm cursor-not-allowed border-none text-black"
                                     : "hover:bg-white  hover:text-[#ffbd59]"
                                 } duration-300 flex items-center justify-center gap-2`}
              onClick={addToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                  <RiShoppingBag3Fill className="text-xl md:text-2xl" />
                  <span>Adding to Bag...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RiShoppingBag3Fill className="text-xl md:text-2xl" />
                  <span>Add to Bag</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCards;
