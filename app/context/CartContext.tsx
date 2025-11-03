import React, { createContext, ReactNode, useContext, useState } from "react";

// 🎯 Định nghĩa kiểu dữ liệu sản phẩm
interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
}

// 🎯 Kiểu dữ liệu cho Context
interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeProduct: (productId: string) => void;
  cartTotal: number;
  clearCart: () => void;
}

// 🎯 Tạo Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 🎯 Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product: CartItem) =>
    setCartItems((prev) => [...prev, product]);

  const removeProduct = (id: string) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartCount: cartItems.length,
        cartItems,
        addToCart,
        removeProduct,
        cartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 🎯 Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
