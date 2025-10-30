// Header.tsx
import EvilIcons from "@expo/vector-icons/EvilIcons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
// ... (style và imports khác)

// Định nghĩa props mà component này nhận
interface HeaderProps {
  onSearch: (keyword: string) => void; // Hàm này sẽ được truyền từ HomeScreen
}

const Header = (props: HeaderProps) => {
  const { onSearch } = props;
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: string) => {
    setSearchText(text);
    // Tùy chọn: Gọi onSearch ngay lập tức khi gõ (real-time filtering)
    // onSearch(text);
  };

  const handleSubmit = () => {
    // Gọi hàm tìm kiếm được truyền từ component cha khi người dùng nhấn Enter
    onSearch(searchText);
  };

  return (
    <View>
      <Text>Tuan-Computer</Text>
      <View style={styles.containerHeader}>
        {/* ✅ Đã đổi style.containerHeader thành styles.containerHeader */}
        <EvilIcons
          name="search"
          size={24}
          color="black"
          onPress={handleSubmit} // Thêm hành động khi nhấn vào icon
        />
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch} // Cập nhật state khi nhập
          onSubmitEditing={handleSubmit} // Kích hoạt tìm kiếm khi nhấn Enter
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

// ... (Đảm bảo styles được định nghĩa)
const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: "row", // Sắp xếp các thành phần ngang hàng (Icon, TextInput, Icon)
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Màu nền nhẹ cho thanh tìm kiếm
    borderRadius: 25, // Bo tròn các góc
    margin: 10,
    paddingHorizontal: 10,
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
