import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

// 🚨 Lấy kiểu dữ liệu chính xác cho tên Icon từ Ionicons
type IoniconsName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IoniconsName;
  color: string;
}

// Hàm helper để tạo Icon
const TabIcon = ({ name, color }: TabIconProps) => {
  return <Ionicons name={name} size={24} color={color} />;
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3498db",
        tabBarInactiveTintColor: "#7f8c8d",
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      {/* -------------------- TAB 1: TRANG CHỦ (DUY NHẤT) -------------------- */}
      <Tabs.Screen
        // Tên file phải là 'HomeScreen.tsx'
        name="HomeScreen"
        options={{
          title: "Trang Chủ",
          tabBarIcon: ({ color }) => (
            <TabIcon name="home-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
});
