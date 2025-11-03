import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
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

// 🎯 ĐỊNH NGHĨA BASE_URL CỦA SERVER
const BASE_URL = "http://192.168.100.114:5000";

interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
}

// 🎯 HÀM TẠO FULL URI
const getFullUri = (path: string): string => {
  if (path && path.startsWith("/uploads")) {
    return `${BASE_URL}${path}`;
  }
  return path;
};

// Component hiển thị chi tiết một sản phẩm trong giỏ hàng
const CartItemRow = ({ item }: { item: CartItem }) => {
  const { removeProduct } = useCart();
  const fullUri = getFullUri(item.thumbnail);

  return (
    <View style={styles.cartItem}>
      {/* Ảnh sản phẩm */}
      <Image
        source={{ uri: fullUri }}
        style={styles.itemThumbnail}
        resizeMode="cover"
      />

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemPrice}>
          {item.price.toLocaleString("vi-VN")} VND
        </Text>
      </View>

      {/* Nút xóa */}
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.itemQuantity}>x1</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeProduct(item.id)}
        >
          <Feather name="trash-2" size={18} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartScreen = () => {
  const router = useRouter();
  const { cartCount, cartItems } = useCart();

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cartCount > 0) {
      router.push("./checkout");
    }
  };

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

  const CartFooter = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalValue}>
          {cartTotal.toLocaleString("vi-VN")} VND
        </Text>
      </View>

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
        ListHeaderComponent={<View style={{ height: 10 }} />}
      />

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
    paddingBottom: 100,
  },
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
    color: "#27AE60",
    marginTop: 4,
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  removeButton: {
    padding: 5,
    marginTop: 5,
  },
  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
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
