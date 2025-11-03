import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../app/context/AuthContext";

const { width } = Dimensions.get("window");

const CARD_MARGIN = 6;
const NUM_COLUMNS = 2;
const CARD_WIDTH = width / NUM_COLUMNS - CARD_MARGIN * 2;

const BASE_URL = "http://192.168.100.114:5000";

interface ProductItem {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
}

interface ProductCardProps {
  item: ProductItem;
  onNavigate: (id: string) => void;
}

// 🎯 HÀM XỬ LÝ URI HÌNH ẢNH
const getFullUri = (path: string | undefined): string | undefined => {
  if (path && path.startsWith("/uploads")) {
    return `${BASE_URL}${path}`;
  }
  return path;
};

const ProductCard = (props: ProductCardProps) => {
  const { item, onNavigate } = props;
  const { token } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const originalPrice = Math.round(
    item.price / (1 - item.discountPercentage / 100)
  );

  // 🎯 HÀM XỬ LÝ KHI NHẤN TRÁI TIM
  const handleToggleFavorite = async () => {
    if (!token) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để lưu sản phẩm yêu thích.");
      return;
    }

    const newState = !isFavorite;
    setIsFavorite(newState);

    const endpoint = `${BASE_URL}/api/users/favorites/${item._id}`;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(endpoint, { isFavorite: newState }, config);

      Alert.alert(
        "Thành công",
        newState ? "Đã thêm vào yêu thích!" : "Đã xóa khỏi yêu thích!"
      );
    } catch (error: any) {
      console.error(
        "Lỗi lưu trạng thái yêu thích:",
        error.response?.data || error.message
      );
      setIsFavorite(!newState);
      Alert.alert(
        "Lỗi",
        "Không thể lưu trạng thái yêu thích. Vui lòng thử lại."
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onNavigate(item._id)}
      style={[
        styles.card,
        { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
      ]}
    >
      <View>
        {/* 🔹 Hình ảnh và giảm giá */}
        <View style={styles.imageContainer}>
          {item.discountPercentage > 0 && (
            <Text style={styles.discountLabel}>
              -{item.discountPercentage}%
            </Text>
          )}

          {/* ❤️ Icon trái tim */}
          <TouchableOpacity
            style={styles.heartIcon}
            onPress={handleToggleFavorite}
          >
            <Feather
              name={isFavorite ? "heart" : "heart"}
              size={18}
              color={isFavorite ? "#FF6347" : "white"}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.4,
                shadowRadius: 2,
              }}
            />
            {isFavorite && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="heart" size={18} color="#FF6347" />
              </View>
            )}
          </TouchableOpacity>

          {/* 🖼 Hình sản phẩm */}
          <Image
            source={{ uri: getFullUri(item.thumbnail) }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* 🏪 Thông tin sản phẩm */}
        <Text style={styles.storeName}>{"Seller Store"}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* ⭐ Đánh giá */}
        <View style={styles.ratingRow}>
          <Feather name="star" size={10} color="#FFC700" />
          <Text style={styles.ratingText}>4.0 (12)</Text>
        </View>

        {/* 💰 Giá */}
        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>
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
    elevation: 2,
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
  discountLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#DC3545",
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
    fontSize: 10,
    fontWeight: "bold",
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
  storeName: {
    fontSize: 10,
    color: "#6c757d",
    marginTop: 4,
    paddingHorizontal: 8,
  },
  title: {
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
    minHeight: 32,
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
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  currentPrice: {
    fontWeight: "bold",
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
