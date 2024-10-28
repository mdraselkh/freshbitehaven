'use client';


import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ cartItems: [] });

  useEffect(() => {
  
    const savedCart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    setCart(savedCart);
  }, []);

  useEffect(() => {
    
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

