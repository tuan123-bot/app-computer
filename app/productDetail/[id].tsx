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
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";

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
  // ✅ SỬA LỖI HOOKS: Di chuyển useCart vào trong component
  const { addToCart } = useCart();

  // 1. Nhận tham số [id] từ URL
  const { id } = useLocalSearchParams();
  console.log("-----------------------------------------");
  console.log("ID SẢN PHẨM NHẬN ĐƯỢC:", id);
  console.log("TYPE CỦA ID:", typeof id);
  console.log("-----------------------------------------");

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
        // 1. Thực hiện Fetch
        const response = await fetch(`${BASE_URL}/${id}`);

        // 2. Ném lỗi cho các Status code không thành công (ví dụ: 404, 500)
        if (!response.ok) {
          // Chúng ta thử đọc body của lỗi để lấy thông tin chi tiết hơn
          const errorBody = await response.text();
          // Ghi lại lỗi chi tiết vào console (nếu cần)
          console.error("Lỗi Response Body:", errorBody);

          // Ném lỗi chi tiết hơn
          throw new Error(
            `Lỗi HTTP: ${response.status} - ${response.statusText}`
          );
        }

        // 3. Đọc JSON
        const json = await response.json();

        // 4. KIỂM TRA LỖI NHÚNG TRONG JSON (Dành cho status 200 nhưng nội dung báo lỗi)
        if (json.status === "error") {
          throw new Error(
            json.message || "Lỗi dữ liệu từ máy chủ không xác định."
          );
        }

        const productData = json.data || json;

        // 5. Kiểm tra dữ liệu hợp lệ (sử dụng 'id' thay vì '_id' nếu Backend trả về 'id')
        if (productData && productData._id) {
          setProduct(productData as Product);
        } else {
          setError(
            "Không tìm thấy sản phẩm này hoặc cấu trúc dữ liệu không hợp lệ."
          );
        }
      } catch (e: any) {
        // Bắt tất cả các lỗi đã được throw ở trên (Lỗi HTTP, Lỗi JSON nhúng, Lỗi Fetch mạng)
        console.error("LỖI CUỐI CÙNG BỊ BẮT:", e);
        // Dòng code này sẽ hoạt động tốt với các lỗi đã được throw
        setError(`Không thể tải dữ liệu: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Chạy lại khi ID thay đổi

  // Hàm xử lý sự kiện Thêm vào Giỏ hàng
  const handleAddToCartPress = () => {
    if (product) {
      // ✅ SỬA LOGIC: Gửi dữ liệu sản phẩm cần thiết cho Context
      const itemToAdd = {
        id: product._id,
        title: product.title,
        price: product.price,
      };
      addToCart(itemToAdd);
      console.log(`Đã thêm sản phẩm ${product.title} vào giỏ hàng.`);
    }
  };

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
    <SafeAreaView style={{ flex: 1 }}>
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
              <Text style={styles.discount}>
                -{product.discountPercentage}%
              </Text>
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
              // ✅ GỌI HÀM XỬ LÝ KHI BẤM NÚT
              onPress={handleAddToCartPress}
              style={styles.buyButtonContainer}
            >
              <Text style={styles.buyButtonText}>thêm vào giỏ hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
