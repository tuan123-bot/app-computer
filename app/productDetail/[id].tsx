import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Định nghĩa URL API Backend của bạn (Sử dụng IP cho Android Emulator)
const BASE_URL = "http://10.0.2.2:5000/api/products";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock: number;
  thumbnail: string;
}

// Hàm tạo Style động (đặt ngoài component để tránh render lại không cần thiết)
// KHÔNG dùng trong StyleSheet.create
const getStockStyle = (stock: number) => ({
  fontSize: 16,
  fontWeight: "600" as "600", // Khắc phục lỗi TypeScript/fontWeight
  color: stock > 0 ? "#27AE60" : "#E74C3C",
});

const ProductDetailScreen = () => {
  // 1. Nhận tham số [id] từ URL
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Không có ID sản phẩm được cung cấp.");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/${id}`);

        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const json = await response.json();

        // Backend có thể trả về { status: 'success', data: product } hoặc chỉ product
        const productData = json.data || json;

        if (productData && productData._id) {
          setProduct(productData as Product); // Ép kiểu an toàn hơn
        } else {
          setError("Không tìm thấy sản phẩm này.");
        }
      } catch (e: any) {
        // Ghi lại lỗi chi tiết vào console
        console.error("Lỗi khi tải dữ liệu chi tiết:", e);
        setError(`Không thể tải dữ liệu: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Chạy lại khi ID thay đổi

  // Hiển thị Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải chi tiết sản phẩm...</Text>
      </View>
    );
  }

  // Hiển thị Lỗi
  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Lỗi: {error || "Sản phẩm không tồn tại."}
        </Text>
      </View>
    );
  }

  // 2. Giao diện Chi tiết Sản phẩm
  return (
    <ScrollView style={styles.container}>
      {/* Sử dụng Stack.Screen options để tùy chỉnh Header */}
      <Stack.Screen
        options={{
          headerTitle: product.title.substring(0, 20) + "...",
        }}
      />

      <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {product.price.toLocaleString("vi-VN")} VND
          </Text>
          {product.discountPercentage > 0 && (
            <Text style={styles.discount}>-{product.discountPercentage}%</Text>
          )}
        </View>

        <Text style={styles.heading}>Mô Tả:</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.stockContainer}>
          <Text style={styles.stockLabel}>Tình trạng:</Text>
          {/* Sử dụng hàm getStockStyle để tạo style động */}
          <Text style={getStockStyle(product.stock)}>
            {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
          </Text>
        </View>

        {/* Nút Giỏ hàng/Mua ngay */}
        <View style={styles.buyButtonContainer}>
          <TouchableOpacity
            onPress={() => console.log("Thêm vào giỏ hàng: " + product._id)}
            style={styles.buyButtonContainer}
          >
            <Text style={styles.buyButtonText}>MUA NGAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007AFF",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  thumbnail: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  price: {
    fontSize: 24,
    fontWeight: "700" as "700",
    color: "#E74C3C",
    marginRight: 10,
  },
  discount: {
    backgroundColor: "#2ECC71",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 14,
    overflow: "hidden",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 20,
  },
  stockContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stockLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
    color: "#333",
  },
  // Style cho nút bấm tổng thể
  buyButtonContainer: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    paddingVertical: 15,
  },
  // Text bên trong nút bấm
  buyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductDetailScreen;
