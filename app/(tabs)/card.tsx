import { useRouter } from "expo-router"; // 👈 Import useRouter
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/CartContext";

// Giả định CartItem từ Context đã được cập nhật
interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string; // ✅ Đã thêm
}

// Component hiển thị chi tiết một sản phẩm trong giỏ hàng
const CartItemRow = ({ item }: { item: CartItem }) => (
  <View style={styles.cartItem}>
    {/* 1. HIỂN THỊ HÌNH ẢNH */}
    <Image
      source={{ uri: item.thumbnail }}
      style={styles.itemThumbnail}
      resizeMode="cover"
    />

    <View style={styles.itemDetails}>
      {/* 2. HIỂN THỊ TÊN SẢN PHẨM */}
      <Text style={styles.itemTitle} numberOfLines={2}>
        {item.title}
      </Text>

      {/* 3. HIỂN THỊ GIÁ */}
      <Text style={styles.itemPrice}>
        {item.price.toLocaleString("vi-VN")} VND
      </Text>
    </View>

    {/* Placeholder cho số lượng hoặc nút xóa */}
    <Text style={styles.itemQuantity}>x1</Text>
  </View>
);

const CartScreen = () => {
  const router = useRouter(); // Khởi tạo router
  const { cartCount, cartItems } = useCart(); // Lấy dữ liệu giỏ hàng

  // Tính Tổng giá tiền
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Xử lý chuyển hướng đến trang Thanh toán (Cần tạo file checkout.tsx)
  const handleCheckout = () => {
    if (cartCount > 0) {
      router.push("/"); // Ví dụ: Chuyển sang route /checkout.tsx
    }
  };

  // Nếu giỏ hàng trống
  if (cartCount === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🛒 Trang Giỏ Hàng</Text>
        <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>
        <Text style={styles.emptySubtitle}>
          Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm!
        </Text>
      </View>
    );
  }

  // Footer (Thanh toán & Tổng tiền)
  const CartFooter = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalValue}>
          {cartTotal.toLocaleString("vi-VN")} VND
        </Text>
      </View>

      {/* NÚT THANH TOÁN */}
      <TouchableOpacity
        onPress={handleCheckout}
        style={styles.checkoutButton}
        activeOpacity={0.8}
      >
        <Text style={styles.checkoutButtonText}>
          TIẾN HÀNH THANH TOÁN ({cartCount})
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.fullContainer}>
      <Text style={styles.title}>🛒 Trang Giỏ Hàng</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => <CartItemRow item={item as CartItem} />}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<View style={{ height: 10 }} />} // Khoảng cách đầu danh sách
      />

      {/* ⚠️ LIST FOOTER KHÔNG CỐ ĐỊNH. TA SẼ SỬ DỤNG VIEW BÊN NGOÀI ĐỂ CỐ ĐỊNH THANH TOÁN */}
      <CartFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 50,
    paddingBottom: 15,
    color: "#333",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E74C3C",
    marginTop: 50,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 100, // Tạo khoảng trống để Footer không che mất item cuối
  },
  // --- Cart Item Style ---
  cartItem: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  itemThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemDetails: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#27AE60", // Màu xanh lá cây
    marginTop: 4,
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  // --- Footer/Summary Style ---
  summaryContainer: {
    position: "absolute", // Cố định ở dưới cùng
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30, // Thêm padding cho vùng an toàn (safe area)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    color: "#555",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  checkoutButton: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartScreen;
