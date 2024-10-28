"use client";

import { useState, useEffect } from "react";

import { TbCurrencyTaka } from "react-icons/tb";

import { toast } from "react-toastify";

import { useCart } from "@/app/context/CartContext";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";

const CheckOut = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const { cart, setCart } = useCart();
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
  });

  const [cityWiseShippingData, setCityWiseShippingData] = useState({});
  const [shippingCost, setShippingCost] = useState(0);
  const [cityId, setCityId] = useState(null);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    // Check if router is defined
    if (!router) return;

    const storedCart = JSON.parse(localStorage.getItem("isPromoApplied")) || {};
    setIsPromoApplied(storedCart.isPromoApplied || false);

    const handleBeforeUnload = () => {
      removePromoDiscount();
    };

    // Check if router.events exists
    if (router.events) {
      // Attach event to remove promo when navigating away from Checkout page
      window.addEventListener("beforeunload", handleBeforeUnload);
      router.events.on("routeChangeStart", handleBeforeUnload);
    }

    return () => {
      // Cleanup the event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (router.events) {
        router.events.off("routeChangeStart", handleBeforeUnload);
      }
    };
  }, [router]);

  const removePromoDiscount = () => {
    const updatedCart = {
      ...JSON.parse(localStorage.getItem("isPromoApplied")),
      isPromoApplied: false,
    };
    localStorage.setItem("isPromoApplied", JSON.stringify(updatedCart));
    setIsPromoApplied(false);
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    const formattedPhone = phone.replace(/-/g, "");

    if (formattedPhone.length === 11) {
      fetchCustomerDetails(formattedPhone);
    }
    setDeliveryDetails((prev) => ({ ...prev, phone: formattedPhone }));
  };

  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);

  useEffect(() => {
    const loadCartItems = async () => {
      let items = [];
      const storedCart = localStorage.getItem("cart");
      items = storedCart ? JSON.parse(storedCart)?.cartItems || [] : [];

      setCartItems(items);
    };

    loadCartItems();
  }, [setCart]);

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * (item.discountPrice || item.price),
        0
      );
      setCartSubtotal(subtotal);
    } else {
      console.warn("cartItems is not an array:", cartItems);
    }
  }, [cartItems]);

  // console.log("cartitems", cartItems);

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
  }, [cartSubtotal, isPromoApplied, cartItems]);

  useEffect(() => {
    const fetchShippingCosts = async () => {
      try {
        const response = await fetch("/api/shipping-costs");
        const data = await response.json();
        // console.log(data);

        const cityData = data.reduce((acc, cost) => {
          acc[cost.city] = { cost: cost.cost, id: cost.id };
          return acc;
        }, {});

        setCityWiseShippingData(cityData);
      } catch (error) {
        console.error("Failed to fetch shipping costs:", error);
      }
    };

    fetchShippingCosts();
  }, []);

  const handleCityChange = (e) => {
    const city = e.target.value;
    if (city) {
      const { cost, id } = cityWiseShippingData[city];
      setShippingCost(cost);
      setCityId(id);
      setDeliveryDetails({ ...deliveryDetails, city: city });
    } else {
      setShippingCost(0);
      setCityId(null);
    }
  };

  const fetchCustomerDetails = async (phone) => {
    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data) {
        const shippingInfo = cityWiseShippingData[data.city] || { cost: 0 };

        console.log(shippingInfo);

        setDeliveryDetails({
          fullname: data.fullname,
          phone: data.phone,
          address: data.address,
          city: data.city,
        });

        setShippingCost(shippingInfo.cost);
        setCityId(shippingInfo.id);
      } else {
        // If no data is returned, reset delivery details
        setDeliveryDetails({
          fullname: "",
          address: "",
          city: "",
        });

        console.error("Customer not found. Please check the phone number.");
      }
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    }
  };

  const handleStock = async () => {
    try {
      const cartItem = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      console.log(cartItem);
      // Make a PATCH request to update stock
      const response = await fetch("/api/products/update-stock", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItem }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }

      const result = await response.json();
      console.log(result.message);
      // toast.success(result.message); // Notify user of success
      // Optionally, navigate to a success page or reset the cart
    } catch (error) {
      toast.error(error.message); // Notify user of the error
    }
  };

  const validateForm = (data) => {
    const errors = {};

    const phoneNumber = data.phone;
    if (!phoneNumber) {
      errors.phone = "Phone number is required";
    } else if (!/^01[3-9]\d{8}$/.test(phoneNumber)) {
      errors.phone = "Enter a valid phone number";
    }

    if (!data.fullname) {
      errors.fullname = "Name is required";
    }

    if (!data.address) {
      errors.address = "Address is required";
    }

    if (!data.city) {
      errors.city = "City is required";
    }

    if (!data.paymentMethod) {
      errors.paymentMethod = "Payment method is required";
    }

    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowTick(false);

    setTimeout(async () => {
      if (cartItems.length === 0) {
        toast.warn(
          "Please add at least one product to the cart before placing an order."
        );
        setIsLoading(false); // Ensure loading state resets on exit
        return;
      }

      const formData = new FormData(e.target);

      const data = {
        customer: {
          fullname: formData.get("fullname"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          city: formData.get("city"),
        },
        totalAmount: totalAmount + shippingCost,
        orderNote: orderNote,
        paymentMethod: paymentMethod,
        shippingCostId: cityId,
        discount:
          cartItems.length > 0 && cartItems[0]?.promoDiscount
            ? cartItems[0]?.promoDiscount
            : 0,
        orderItems: cartItems.map((item) => ({
          productName: item.productName,
          weight: item.productSizes,
          price: item.price || item.discountPrice,
          quantity: item.quantity,
          totalPrice: item.quantity * (item.price || item.discountPrice),
        })),
      };

      const errors = validateForm({
        fullname: formData.get("fullname"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        paymentMethod: paymentMethod,
      });

      setErrors(errors);

      // Stop execution if there are validation errors
      if (Object.keys(errors).length > 0) {
        setIsLoading(false); // Reset loading state if there are errors
        return;
      }

      try {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Failed to order: ${response.statusText}`);
        }

        const result = await response.json();

        e.target.reset();
        resetCart();

        console.log("API response:", result);
        if (result.success) {
          toast.success("Order placed successfully!");
          handleStock();
        } else {
          toast.warn(
            `Something went Wrong! Please try again some time."}`
          );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        // toast.error("An unexpected error occurred.");
      } finally {
        setShowTick(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }, 2500);
  };

  const resetCart = () => {
    setDeliveryDetails({
      fullname: "",
      phone: "",
      address: "",
      city: "",
    });
    setCart({ cartItems: [] });
    localStorage.removeItem("cart");
    setOrderNote("");
    setCartItems([]);
    setCartSubtotal(0);
    setTotalAmount(0);
    setShippingCost(0);
    setPaymentMethod("");
  };

  const handleCleared = (event) => {
    event.preventDefault();

    setDeliveryDetails({
      phone: "",
      fullname: "",
      address: "",
      city: "",
    });

    setErrors({});
  };

  const total = totalAmount + shippingCost;

  return (
    <div className="py-4 mb-8">
      <div className="container mx-auto px-4 w-full max-w-7xl">
        <div className="">
          <div>
            <h1 className="md:text-3xl text-2xl font-semibold pb-4 text-center md:text-left">
              Billing & Shipping
            </h1>
          </div>

          <div className="bg-white md:py-3 w-full">
            <form
              id="checkout-form"
              onSubmit={onSubmit}
              className="space-y-4 flex flex-col md:flex-row items-start justify-between gap-8"
            >
              <div className="md:w-1/2 w-full">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg md:text-xl font-semibold pb-4">
                    Contact Information
                  </h1>
                  <div className="flex items-center">
                    <button
                      className="text-center rounded-full p-2 bg-red-50 hover:bg-red-100 transition duration-200"
                      onClick={handleCleared}
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="font-semibold">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      placeholder="Enter your phone number"
                      // defaultValue={session?.user?.phone || ''}
                      value={deliveryDetails.phone || ""}
                      onChange={handlePhoneChange}
                      className={`p-3 border rounded-md ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs">{errors.phone}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="fullname"
                      placeholder="Enter your full name"
                      // defaultValue={session?.user?.fullname || ''}
                      value={deliveryDetails.fullname}
                      onChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          fullname: e.target.value,
                        })
                      }
                      className={`p-3 border rounded-md ${
                        errors.fullname ? "border-red-500" : ""
                      }`}
                    />
                    {errors.fullname && (
                      <p className="text-red-500 text-xs">{errors.fullname}</p>
                    )}
                  </div>
                </div>

                <h1 className="text-lg md:text-xl font-semibold my-4">
                  Delivery Address
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="font-semibold">
                      Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="address"
                      placeholder="Enter street"
                      className={`p-3 border rounded-md ${
                        errors.address ? "border-red-500" : ""
                      }`}
                      value={deliveryDetails.address}
                      onChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          address: e.target.value,
                        })
                      }
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs">{errors.address}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold">
                      City<span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={deliveryDetails.city}
                      onChange={handleCityChange}
                      className={`p-3 border rounded-md bg-white ${
                        errors.city ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select city</option>
                      {Object.entries(cityWiseShippingData).map(([city]) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>

                    {errors.city && (
                      <p className="text-red-500 text-xs">{errors.city}</p>
                    )}
                  </div>
                </div>
                <h1 className="text-lg md:text-xl font-semibold my-4">
                  Additional Information
                </h1>
                <div className="col-span-2 flex flex-col">
                  <label className="font-semibold">Order Note (Optional)</label>
                  <textarea
                    name="orderNote"
                    value={orderNote}
                    placeholder="Add any additional notes"
                    className="w-full p-3 border rounded-md"
                    rows={6}
                    onChange={(e) => setOrderNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:w-1/3 w-full bg-gray-50 p-6 border-2 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Review Your Order{" "}
                  <span className="text-gray-500">
                    ({cartItems.length} Items)
                  </span>
                </h2>
                <div>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-start justify-start sm:gap-4 gap-2 border-b hover:bg-gray-200 sm:p-4 p-2"
                      >
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={40}
                          height={40}
                          className="sm:w-16 sm:h-16 w-10 h-10 object-cover"
                        />
                        <div className="flex flex-col items-start justify-center text-xs sm:gap-2 sm:text-sm">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-semibold">
                              {item.productName}
                            </h4>
                            {item.productLocalName && (
                              <h4 className="font-semibold">
                                {item.productLocalName}
                              </h4>
                            )}
                            <p className="text-sm font-semibold text-gray-600">
                              - {item.productSizes}
                            </p>
                          </div>
                          <p className="text-sm font-semibold flex items-center text-gray-500">
                            {item.quantity}{" "}
                            <IoCloseSharp className="text-red-500 ml-2" />{" "}
                            {item.discountPrice ? (
                              <span className="flex items-center justify-center text-[#7d9626]">
                                <TbCurrencyTaka className="xl:text-xl lg:text-lg" />
                                {item.discountPrice.toLocaleString()}
                              </span>
                            ) : (
                              <span className="flex items-center justify-center text-[#7d9626]">
                                <TbCurrencyTaka className="xl:text-xl lg:text-lg" />
                                {item.price.toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h2 className="text-center text-gray-500">Cart is empty</h2>
                  )}
                </div>

                <div className="py-5 flex justify-between text-gray-600 border-b">
                  {cartItems.length > 0 && cartItems[0]?.promoDiscount ? (
                    <span className="font-semibold">
                      Subtotal (After discount)
                    </span>
                  ) : (
                    <span className="font-semibold">Subtotal</span>
                  )}
                  <span className="flex items-center">
                    <TbCurrencyTaka className="mr-1" />{" "}
                    {totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="py-5 flex justify-between text-gray-600 border-b">
                  <span className="font-semibold">Shipping</span>
                  <span className="flex items-center">
                    <TbCurrencyTaka className="mr-1" /> {shippingCost}
                  </span>
                </div>
                <div className="py-5 flex justify-between text-gray-600">
                  <span className="font-bold text-xl">Total</span>
                  <span className="flex items-center text-2xl text-[#7d9626] font-semibold">
                    <TbCurrencyTaka className="mr-1 " />{" "}
                    {total.toLocaleString()}
                  </span>
                </div>
                <div className="py-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border bg-gray-100 px-2 py-1 w-full cursor-pointer">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash-on-delivery"
                          checked={paymentMethod === "cash-on-delivery"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2 cursor-pointer"
                        />
                        <Image
                          src="/cod.png"
                          alt="cash"
                          width={50}
                          height={30}
                        />
                      </label>
                    </div>
                    <div className="border bg-gray-100 px-2 py-1 w-full cursor-pointer">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bkash"
                          checked={paymentMethod === "bkash"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2 cursor-pointer"
                        />
                        <Image
                          src="/bkash.png"
                          alt="bkash"
                          width={50}
                          height={30}
                        />
                      </label>
                    </div>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs">
                      {errors.paymentMethod}
                    </p>
                  )}
                  <button
                    className={`w-full bg-[#7d9626] text-white py-2 flex items-center justify-center mt-6 font-semibold ${
                      isLoading
                        ? "bg-[#7d9626] bg-opacity-50 backdrop-blur-sm cursor-not-allowed border-none text-white"
                        : "hover:bg-[#728626]"
                    }`}
                    type="submit"
                    disabled={isLoading}
                    
                  >
                    {isLoading ? (
                      showTick ? (
                        <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full animate-check">
                          <AiOutlineCheckCircle className="text-white text-xl" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      )
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
