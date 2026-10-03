import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const initialCartState = {
  items: [],
  total_items: 0,
  total_original_price: 0,
  total_discount: 0,
  total_amount: 0,
  delivery_charge: 0,
  final_total: 0,
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(initialCartState);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend API
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(initialCartState);
      return;
    }

    try {
      setLoading(true);
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setCart(initialCartState);
      } else {
        console.error("Failed to fetch cart from server:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("AUTH_REQUIRED");
    }

    try {
      setLoading(true);
      const updatedCart = await cartAPI.addToCart(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;

    try {
      const updatedCart = await cartAPI.updateQuantity(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
      throw err;
    }
  };

  // Remove single item
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const updatedCart = await cartAPI.removeFromCart(productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      throw err;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      await cartAPI.clearCart();
      setCart(initialCartState);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      throw err;
    }
  };

  const value = {
    cart,
    cartCount: cart.total_items || 0,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

