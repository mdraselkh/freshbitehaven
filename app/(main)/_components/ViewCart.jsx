"use client";
import React, { useEffect, useState } from "react";

import { TbCurrencyTaka } from "react-icons/tb";
import Link from "next/link";
import { AiTwotoneDelete } from "react-icons/ai";
import { IoReturnUpBack } from "react-icons/io5";
import { BsFillCartXFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useStock } from "@/app/context/StockContext";

const ViewCart = () => {
  const { cart, setCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [matchPromoData, setMatchPromoData] = useState("");
  const [error, setError] = useState("");
  const [promoData, setPromoData] = useState([]);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { stock, updateStock } = useStock();


  // UseEffect to watch the `isPromoApplied` state and update localStorage
  useEffect(() => {
    localStorage.setItem("isPromoApplied", JSON.stringify(isPromoApplied));
  }, [isPromoApplied]);

  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);

  const fetchPromos = async () => {
    const response = await fetch("/api/promos");
    const data = await response.json();
    setPromoData(data);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  useEffect(() => {
    const loadCartItems = async () => {
      let items = [];
      const storedCart = localStorage.getItem("cart");
      items = storedCart ? JSON.parse(storedCart)?.cartItems || [] : [];

      setCartItems(items);
    };

    loadCartItems();
  }, [setCart]);

  const handleRemoveItem = async (id) => {
    try {
      const updatedCartItems = cartItems.filter(
        (item) => item.productId !== id
      );
      setCartItems(updatedCartItems);
      setCart({ cartItems: updatedCartItems });

      localStorage.setItem(
        "cart",
        JSON.stringify({ cartItems: updatedCartItems })
      );

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleIncrease = async (item) => {
    const availableStock = stock[item.productId] || 0; // Get available stock for the product
    const currentQuantity =
      cartItems.find((cartItem) => cartItem.productId === item.productId)
        ?.quantity || 0; // Get the current quantity from cart items

    if (currentQuantity < availableStock) {
      // Check if current quantity is less than available stock
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.productId === item.productId) {
          return { ...cartItem, quantity: cartItem.quantity + 1 }; // Increase quantity
        }
        return cartItem;
      });

      // Update state and localStorage
      setCartItems(updatedCartItems);
      setCart({ cartItems: updatedCartItems });
    } else {
      toast.warning("Cannot exceed stock limit"); // Notify the user
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.productId === item.productId) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });

      setCartItems(updatedCartItems);
      setCart({ cartItems: updatedCartItems });
    }
  };

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      let subtotal = 0;
      cartItems.forEach((item) => {
        subtotal += item.quantity * (item.discountPrice || item.price);
      });
      setCartSubtotal(subtotal);
    } else {
      console.warn("cartItems is not an array:", cartItems);
    }
  }, [cartItems]);

  useEffect(() => {
    let calculatedTotal = parseFloat(cartSubtotal) || 0;

    if (
      isPromoApplied &&
      cartItems.length > 0 &&
      cartItems[0].promoDiscount !== ""
    ) {
      calculatedTotal = cartSubtotal - cartItems[0].promoDiscount;
    }

    setTotalAmount(calculatedTotal);
  }, [cartSubtotal, isPromoApplied,cartItems]);

  const handleApplyPromo = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.warn(
        "Please add at least one product to the cart before applying promo code."
      );
      return;
    }

    if (promoCode.trim() === "") {
      setError("Please enter a promo code");
      return;
    }

    const promo = promoData.find(
      (promo) =>
        promo.code.trim().toLowerCase() === promoCode.trim().toLowerCase()
    );

    if (promo) {
      setIsPromoApplied(true);
      setMatchPromoData(promo); // Store the matched promo data
      setError("");
      setPromoCode("");

      // Calculate the discount
      const discountAmount = (cartSubtotal * promo.discountPercentage) / 100;

      // Update cartItems with promo discount and total amount
      const updatedCartItems = cartItems.map((item) => ({
        ...item,
        promoDiscount: discountAmount, // add the discount to each item (or adjust as needed)
        totalAmount: cartSubtotal - discountAmount, // total amount after discount
      }));

      setCartItems(updatedCartItems);
      setCart({ cartItems: updatedCartItems }); // If you have a context or state for cart, update it
      localStorage.setItem(
        "cart",
        JSON.stringify({ cartItems: updatedCartItems })
      );
      const updatedCart = {
        ...JSON.parse(localStorage.getItem("isPromoApplied")),
        isPromoApplied: true,
      };
      localStorage.setItem("isPromoApplied", JSON.stringify(updatedCart));
    } else {
      setIsPromoApplied(false);
      setMatchPromoData("");
      setError("Invalid promo code.");
    }
  };

  // console.log(isPromoApplied);
  // console.log(matchPromoData);

  return (
    <div className="md:py-4 h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className=" text-2xl lg:text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-4">
          Shopping Cart
        </h1>
        <div className="w-full p-2 flex flex-col lg:flex-row items-center justify-center md:items-start md:justify-between gap-6">
          {cartItems.length > 0 ? (
            <div className="flex flex-col w-full">
              <div className="overflow-x-auto w-full bg-[#fff7ec]">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-[#f8d197]">
                    <tr>
                      <th className="px-2 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-2 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-2 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-2 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-2 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-2 py-2 md:px-6 md:py-3 text-left text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.productId}>
                        <td className="px-2 py-2 md:px-6 md:py-3 whitespace-nowrap">
                          <Image
                            src={item.productImage}
                            alt={item.productImage}
                            width={56}
                            height={56}
                            className="w-10 h-10 md:w-20 md:h-20 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-2 py-2 md:px-6 md:py-3 whitespace-nowrap text-xs md:text-sm">
                          <div className="font-medium text-gray-700">
                            {item.productName}
                          </div>
                          <div className="text-gray-500">
                            {item.productSizes}
                          </div>
                        </td>
                        <td className="px-2 py-2 md:px-6 md:py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1 md:space-x-3">
                            <button
                              onClick={() => handleDecrease(item)}
                              className="text-gray-500 bg-white px-2 py-1 md:px-3 rounded-full"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => handleIncrease(item)}
                              className="text-gray-500 bg-white px-2 py-1 md:px-3 rounded-full"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-2 md:px-6 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          <span className="flex items-center justify-center text-black">
                            <TbCurrencyTaka className="text-sm md:text-lg" />
                            {item.discountPrice || item.price}
                          </span>
                        </td>
                        <td className="px-2 py-2 md:px-6 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-700">
                          <span className="flex items-center justify-center text-black">
                            <TbCurrencyTaka className="text-sm md:text-lg" />
                            {(item.discountPrice || item.price) * item.quantity}
                          </span>
                        </td>
                        <td className="px-2 py-2 md:px-6 md:py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-700 p-1 md:p-2 rounded-full bg-[#effbc3] hover:bg-[#7d9626]"
                          >
                            <AiTwotoneDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Link href="/shop" className="py-4">
                <button className="flex items-center border transition-all duration-200 text-sm font-medium bg-white text-[#7d9626] hover:bg-[#7d9626] hover:text-white px-4 py-2 rounded">
                  <IoReturnUpBack className="mr-2 hover:text-white" /> Continue
                  Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <BsFillCartXFill className="text-red-300 text-9xl opacity-50 mb-2" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Browse our products and add items to your cart.
              </p>
              <Link href="/shop">
                <button className="flex items-center border transition-all duration-200 text-sm font-medium bg-white text-[#7d9626] hover:bg-[#7d9626] hover:text-white px-4 py-2 rounded">
                  <IoReturnUpBack className="mr-2 hover:text-white" /> Return To
                  Shop
                </button>
              </Link>
            </div>
          )}

          {/* Summary Section */}
          <div className="w-full lg:w-1/3 bg-gray-50 border p-4 shadow-lg">
            <h2 className="text-xl border-b pb-2 font-semibold text-gray-700 ">
              Order Summary
            </h2>

            <div className="py-5 flex justify-between text-gray-600 ">
              <span className="font-semibold">Subtotal</span>
              <span className="flex items-center">
                <TbCurrencyTaka className="mr-1" /> {cartSubtotal.toFixed(2)}
              </span>
            </div>
            <div className="py-2 text-gray-600 w-full">
              <form
                className="flex mb-4 justify-between"
                onSubmit={handleApplyPromo}
              >
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Gift card or discount code"
                  className="px-4 py-2 border border-gray-300"
                />

                <button
                  type="submit"
                  className="ml-2 bg-gray-400 text-white px-4 py-2 focus:outline-none font-semibold"
                >
                  Apply
                </button>
              </form>

              {/* Display discount or error message */}
              {isPromoApplied && matchPromoData ? (
                <p className="text-green-600 font-semibold">
                  Promo applied! You get {matchPromoData.discountPercentage}%
                  off.
                </p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : null}
            </div>

            {isPromoApplied && matchPromoData ? (
              <div className="py-5 flex justify-between text-gray-600">
                <span className="font-bold">Discount</span>
                <span className="flex items-center text-[#7d9626] font-semibold">
                  <TbCurrencyTaka className="mr-1 " />{" "}
                  {(cartSubtotal * matchPromoData.discountPercentage) / 100 ||
                    0}
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="py-5 flex justify-between text-gray-600">
              <span className="font-bold text-xl">Total</span>
              <span className="flex items-center text-2xl text-[#7d9626] font-semibold">
                <TbCurrencyTaka className="mr-1 " /> {totalAmount.toFixed(2)}
              </span>
            </div>

            <Link href="/checkout">
              <button
                className={`w-full bg-[#7d9626] text-white py-2 flex items-center justify-center mt-6 font-semibold ${
                  isLoading
                    ? "bg-[#7d9626] bg-opacity-50 backdrop-blur-sm cursor-not-allowed border-none text-white"
                    : "hover:bg-white hover:text-black border-2 border-[#7d9626]"
                } `}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 3000); // Adjust the timeout duration (in milliseconds) as needed
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCart;
