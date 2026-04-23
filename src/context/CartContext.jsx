import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const item = localStorage.getItem('cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng từ localStorage:", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === (product._id || product.id));
      if (existingItem) {
        return prevItems.map(item => 
          item.id === (product._id || product.id) 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { 
        id: product._id || product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image || (product.images && product.images[0]) || '',
        quantity: quantity 
      }];
    });
    setIsCartOpen(true); // Mở giỏ hàng khi thêm
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal, 
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
