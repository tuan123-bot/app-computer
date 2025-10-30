import React, { createContext, ReactNode, useContext, useState } from "react";

// ✅ 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU SẢN PHẨM TRONG GIỎ HÀNG
interface CartItem {
  id: string; // Hoặc _id, tùy thuộc vào Backend của bạn
  title: string;
  price: number;
  // Thêm các trường khác cần thiết cho giỏ hàng
}

// ✅ 2. CẬP NHẬT KIỂU DỮ LIỆU CHO CONTEXT
interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
}

// Giá trị mặc định
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Tạo Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // ✅ DÙNG: State để lưu danh sách sản phẩm, KHỞI TẠO BẰNG MẢNG RỖNG []
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    // ✅ SỬA LỖI: Thêm kiểm tra dự phòng (prevItems || []) để tránh lỗi spread operator
    setCartItems((prevItems) => [...(prevItems || []), product]);
  };

  return (
    // ✅ CUNG CẤP GIÁ TRỊ ĐÚNG CHO CONTEXT
    <CartContext.Provider
      value={{
        cartCount: cartItems.length,
        cartItems,
        addToCart,
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
