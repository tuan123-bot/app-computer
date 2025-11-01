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

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CartProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          // Đặt tùy chọn mặc định để ẩn header cho tất cả các Stack Screen
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* 🚨 KHÔNG CẦN options={{ headerShown: false }} Ở ĐÂY NỮA */}
          <Stack.Screen name="(tabs)" />

          {/* Các màn hình xác thực (auth) */}
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/signup" />

          {/* Màn hình chi tiết sản phẩm (nếu muốn có header) */}
          <Stack.Screen name="productDetail/[id]" />
          <Stack.Screen name="context/CartContext.tsx" />
          <Stack.Screen name="(tabs)/checkout.tsx" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CartProvider>
  );
}
