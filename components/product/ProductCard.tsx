import Feather from "@expo/vector-icons/Feather";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CARD_MARGIN = 6;
const NUM_COLUMNS = 2;
const CARD_WIDTH = width / NUM_COLUMNS - CARD_MARGIN * 2;

// 🚨 Interface cho dữ liệu sản phẩm (Khớp với HomeScreen)
interface ProductItem {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
}

// 🚨 Interface cho props của Card (Đổi onPress thành onNavigate)
interface ProductCardProps {
  item: ProductItem;
  onNavigate: (id: string) => void; // Hàm điều hướng nhận ID
}

const ProductCard = (props: ProductCardProps) => {
  // 🚨 SỬA: Lấy prop onNavigate
  const { item, onNavigate } = props;

  // Tính giá gốc (làm tròn)
  const originalPrice = Math.round(
    item.price / (1 - item.discountPercentage / 100)
  );

  return (
    <TouchableOpacity
      // 🚨 SỬA: Gọi onNavigate với ID sản phẩm
      onPress={() => onNavigate(item._id)}
      style={[
        styles.card,
        { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
      ]}
    >
      <View>
        {/* Vùng ảnh và nhãn giảm giá */}
        <View style={styles.imageContainer}>
          {/* Nhãn giảm giá: Dùng discountPercentage từ API */}
          {item.discountPercentage > 0 && (
            <Text style={styles.discountLabel}>
              -{item.discountPercentage}%
            </Text>
          )}

          {/* Icon Trái tim */}
          <TouchableOpacity style={styles.heartIcon}>
            <Feather name="heart" size={16} color="white" />
          </TouchableOpacity>

          {/* Hình ảnh: Dùng thumbnail URI từ API */}
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Thông tin sản phẩm */}
        <Text style={styles.storeName}>{"Seller Store"}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Dòng Đánh giá (Giả định thêm) */}
        <View style={styles.ratingRow}>
          <Feather name="star" size={10} color="#FFC700" />
          <Text style={styles.ratingText}>4.0 (12)</Text>
        </View>

        {/* Giá: Dùng price và originalPrice */}
        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>
            {/* 🚨 Tối ưu: Hiển thị giá VND có định dạng */}
            {item.price.toLocaleString("vi-VN")} VND
          </Text>
          {item.discountPercentage > 0 && (
            <Text style={styles.oldPrice}>
              {originalPrice.toLocaleString("vi-VN")} VND
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2, // Bóng đổ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    backgroundColor: "#f7f7f7",
    height: CARD_WIDTH,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  // --- Label và Icon ---
  discountLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#DC3545", // Đỏ
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
    fontSize: 10,
    fontWeight: "bold" as "bold",
    overflow: "hidden",
  },
  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 50,
    padding: 5,
    zIndex: 10,
  },
  productImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  // --- Thông tin ---
  storeName: {
    fontSize: 10,
    color: "#6c757d",
    marginTop: 4,
    paddingHorizontal: 8,
  },
  title: {
    fontWeight: "600" as "600",
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
    minHeight: 32, // Đảm bảo chiều cao cho 2 dòng
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  ratingText: {
    fontSize: 10,
    color: "gray",
    marginLeft: 3,
  },
  // --- Giá ---
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline", // Căn chỉnh theo đường cơ sở (baseline)
    marginTop: 2,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  currentPrice: {
    fontWeight: "bold" as "bold",
    fontSize: 15,
    color: "#333",
  },
  oldPrice: {
    fontSize: 11,
    color: "#6c757d",
    textDecorationLine: "line-through",
    marginLeft: 5,
  },
});

export default ProductCard;
