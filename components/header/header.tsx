// Header.tsx (CẬP NHẬT HOÀN TOÀN)

import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useRouter } from "expo-router"; // Cần cho điều hướng
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../app/context/AuthContext"; // Import Context đã tạo

// Định nghĩa props
interface HeaderProps {
  onSearch: (keyword: string) => void;
}

const Header = (props: HeaderProps) => {
  const router = useRouter();
  const { user } = useAuth(); // <<-- LẤY TRẠNG THÁI NGƯỜI DÙNG
  const { onSearch } = props;
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: string) => {
    setSearchText(text);
    // Tùy chọn: onSearch(text);
  };

  const handleSubmit = () => {
    onSearch(searchText);
  };

  // Hàm xử lý khi nhấn vào nút Đăng nhập/Profile
  const handleProfilePress = () => {
    if (user) {
      // Đã đăng nhập: Chuyển đến trang Profile
      router.push("/(tabs)/profile");
    } else {
      // Chưa đăng nhập: Chuyển đến trang Login
      router.push("/(auth)/login");
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Đổi tên style chính để dễ quản lý hơn */}
      <View style={styles.logoAndAuthRow}>
        {/* 1. Logo */}
        <Text style={styles.logoText}>Tuan-Computer</Text>

        {/* 2. Nút Đăng nhập/Profile */}
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.authButton}
        >
          <Text style={styles.authText}>
            {/* Hiển thị tên nếu đã đăng nhập, hoặc lời mời nếu chưa */}
            {user ? user.name : "Đăng nhập / Đăng ký"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <EvilIcons
          name="search"
          size={24}
          color="#4F46E5" // Thêm màu sắc rõ ràng hơn
          onPress={handleSubmit}
        />
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

// ---------------------------
// STYLE SHEET ĐÃ CẬP NHẬT
// ---------------------------
const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white", // Đảm bảo nền trắng
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937", // Màu chữ đậm
  },
  logoAndAuthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  authButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: "#F3F4F6", // Nền nhẹ
  },
  authText: {
    fontSize: 14,
    color: "#4F46E5", // Màu tím chủ đạo
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 40,
    paddingLeft: 5,
    paddingRight: 10,
  },
});

export default Header;
