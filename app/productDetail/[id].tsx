import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";

const API_BASE_URL = "http://192.168.100.114:5000/api/products";
const IMAGE_BASE_URL = "http://192.168.100.114:5000";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock: number;
  thumbnail: string;
}

const getFullUri = (path: string) =>
  path?.startsWith("/") ? `${IMAGE_BASE_URL}${path}` : path;

const ProductDetailScreen = () => {
  const { addToCart } = useCart();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return setError("Không có ID sản phẩm.");

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/${id}`);
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
        const json = await res.json();
        const data = json.data || json;
        data?._id ? setProduct(data) : setError("Không tìm thấy sản phẩm.");
      } catch (e: any) {
        setError(`Không thể tải dữ liệu: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) return Alert.alert("Hết hàng", "Sản phẩm đã hết.");

    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
    Alert.alert("Thành công", `Đã thêm ${product.title} vào giỏ hàng!`);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải chi tiết sản phẩm...</Text>
      </View>
    );

  if (error || !product)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Lỗi: {error || "Sản phẩm không tồn tại."}
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{ headerTitle: `${product.title.slice(0, 20)}...` }}
        />
        <Image
          source={{ uri: getFullUri(product.thumbnail) }}
          style={styles.thumbnail}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {product.price.toLocaleString("vi-VN")} VND
            </Text>
            {product.discountPercentage > 0 && (
              <Text style={styles.discount}>
                -{product.discountPercentage}%
              </Text>
            )}
          </View>

          <Text style={styles.heading}>Mô tả:</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.stock}>
            {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
          </Text>

          <TouchableOpacity
            onPress={handleAddToCart}
            style={[
              styles.buyButton,
              { backgroundColor: product.stock > 0 ? "#3498db" : "#ccc" },
            ]}
            disabled={product.stock <= 0}
          >
            <Text style={styles.buyText}>
              {product.stock <= 0 ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#007AFF" },
  errorText: { color: "red" },
  thumbnail: { width: "100%", height: 300, resizeMode: "cover" },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#333" },
  priceRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  price: { fontSize: 22, fontWeight: "700", color: "#E74C3C" },
  discount: {
    marginLeft: 10,
    backgroundColor: "#2ECC71",
    color: "#fff",
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  heading: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  description: { fontSize: 16, color: "#555", marginBottom: 20 },
  stock: { fontSize: 16, fontWeight: "600", color: "#27AE60" },
  buyButton: { borderRadius: 10, paddingVertical: 15, marginTop: 10 },
  buyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductDetailScreen;
