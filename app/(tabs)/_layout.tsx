import { Tabs } from "expo-router";
import React from "react";
// Bạn cần đảm bảo đã cài đặt expo/vector-icons (ví dụ: npm install @expo/vector-icons)
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

const TabLayout = () => {
  // ✅ Lấy số lượng sản phẩm trong giỏ hàng từ Context
  const { cartCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF", // Màu icon khi được chọn
        tabBarInactiveTintColor: "#8E8E93", // Màu icon khi không được chọn
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      {/* 1. TAB TRANG CHỦ */}
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Trang Chủ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 2. TAB GIỎ HÀNG (Bạn cần tạo file cart.tsx bên cạnh index.tsx) */}
      <Tabs.Screen
        name="card"
        options={{
          title: "Giỏ Hàng",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),

          // ✅ LOGIC HUY HIỆU (BADGE) MÀU ĐỎ:
          // Chỉ hiển thị huy hiệu nếu cartCount > 0
          tabBarBadge: cartCount > 0 ? cartCount : undefined,

          // Tùy chỉnh màu sắc và style của huy hiệu
          tabBarBadgeStyle: {
            backgroundColor: "#E74C3C", // Màu đỏ rực
            color: "white", // Chữ trắng
            fontWeight: "bold",
            fontSize: 12,
            minWidth: 20,
            lineHeight: 18,
            borderRadius: 10,
          },
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
