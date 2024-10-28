'use client';
import React, { createContext, useContext, useEffect, useState } from "react";

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stock, setStock] = useState({});
console.log(stock);
  // Load initial stock from localStorage or API on first render
  useEffect(() => {
    const storedStock = JSON.parse(localStorage.getItem("stock")) || {};
    setStock(storedStock);
  }, []);
  console.log(stock);

  // Function to update stock
  const updateStock = (productId, quantityChange) => {
console.log(productId,quantityChange);
    setStock((prevStock) => {
      const updatedStock = {
        ...prevStock,
        [productId]: (prevStock[productId] || 0) + quantityChange,
      };

      // console.log(updateStock);

      // Store updated stock in localStorage
      localStorage.setItem("stock", JSON.stringify(updatedStock));
      return updatedStock;
    });
  };

  return (
    <StockContext.Provider value={{ stock, updateStock }}>
      {children}
    </StockContext.Provider>
  );
};

// Custom hook to use stock context
export const useStock = () => {
  return useContext(StockContext);
};
