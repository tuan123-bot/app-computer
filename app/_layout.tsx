import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { CartProvider } from "./context/CartContext";
// 🎯 BỔ SUNG: Import AuthProvider
import { AuthProvider } from "./context/AuthContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 1. 🎯 BỌC BẰNG AUTH PROVIDER Ở CẤP CAO NHẤT
    <AuthProvider>
      <CartProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />

            {/* Các màn hình xác thực (auth) */}
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/signup" />

            {/* Màn hình chi tiết sản phẩm */}
            <Stack.Screen name="productDetail/[id]" />

            {/* 🛑 LỖI CẤU TRÚC: Cần xóa các dòng này */}
            {/* <Stack.Screen name="context/CartContext.tsx" /> 
            <Stack.Screen name="(tabs)/checkout.tsx" /> 
            */}

            {/* 💡 SỬA LỖI: Màn hình checkout phải được truy cập qua cấu trúc tabs/checkout */}
            {/* Nếu bạn muốn checkout là màn hình riêng, hãy định nghĩa nó mà không có .tsx */}
            <Stack.Screen name="checkout" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}
