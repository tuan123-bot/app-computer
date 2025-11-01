import React, { createContext, ReactNode, useContext, useState } from "react";

// ✅ 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU SẢN PHẨM TRONG GIỎ HÀNG
interface CartItem {
  id: string; // Hoặc _id, tùy thuộc vào Backend của bạn
  title: string;
  price: number;
  thumbnail: string; // Thêm thumbnail để khớp với CartScreen
}

// ✅ 2. CẬP NHẬT KIỂU DỮ LIỆU CHO CONTEXT
interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;

  // 🎯 THÊM 2 THUỘC TÍNH CẦN THIẾT CHO TRANG THANH TOÁN
  cartTotal: number; // Tổng giá trị giỏ hàng
  clearCart: () => void; // Hàm xóa sạch giỏ hàng
  // Tùy chọn: Thêm hàm removeItem đã được bạn nhắc đến
  // removeItem: (id: string) => void;
}

// Giá trị mặc định
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Tạo Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 🎯 1. TÍNH TOÁN CART TOTAL
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  // 🎯 2. TẠO HÀM CLEAR CART
  const clearCart = () => {
    setCartItems([]);
  };

  const addToCart = (product: CartItem) => {
    // Logic đơn giản: Thêm mới sản phẩm, không xử lý số lượng
    setCartItems((prevItems) => [...(prevItems || []), product]);
  };

  // Tùy chọn: Thêm hàm xóa 1 item (nếu bạn cần)
  /*
  const removeItem = (idToRemove: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
  };
  */

  return (
    // ✅ 3. CUNG CẤP CÁC GIÁ TRỊ MỚI VÀO CONTEXT
    <CartContext.Provider
      value={{
        cartCount: cartItems.length,
        cartItems,
        addToCart,
        cartTotal, // 👈 Đã thêm
        clearCart, // 👈 Đã thêm
        // removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom Hook để sử dụng Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
