// app/(tabs)/WishlistScreen.tsx

import ProductCard from "@/components/product/ProductCard"; // Import ProductCard
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext"; // Cần token người dùng

// ⚠️ CẦN THAY THẾ BẰNG IP CHÍNH XÁC CỦA MÁY CHỦ
const API_BASE_URL = "http://192.168.100.114:5000";
// 🎯 GIẢ ĐỊNH: Backend có API này để trả về DANH SÁCH SẢN PHẨM YÊU THÍCH
const API_WISHLIST_URL = `${API_BASE_URL}/api/users/wishlist`;

// Giao diện sản phẩm (đã đồng bộ)
interface ProductItem {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
}

const WishlistScreen = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Hàm tải danh sách sản phẩm yêu thích
  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return; // Không tải nếu chưa đăng nhập
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(API_WISHLIST_URL, config);

      // Giả định API Backend trả về mảng sản phẩm trực tiếp (hoặc response.data.products)
      const productsData = Array.isArray(response.data)
        ? response.data
        : response.data.products;

      if (Array.isArray(productsData)) {
        setWishlist(productsData as ProductItem[]);
      } else {
        setWishlist([]);
        console.warn("API Wishlist trả về định dạng không phải mảng.");
      }
    } catch (err: any) {
      console.error("Lỗi tải Wishlist:", err);
      setError("Không thể tải danh sách yêu thích.");
      if (err.response?.status === 401) {
        // Tự động đăng xuất nếu token hết hạn
        // logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Hàm điều hướng đến chi tiết sản phẩm (cần cho ProductCard)
  const handleNavigateToDetail = (productId: string) => {
    router.push(`/productDetail/${productId}`);
  };

  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Vui lòng đăng nhập để xem danh sách yêu thích.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Đang tải danh sách...</Text>
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>💔 Danh sách yêu thích trống.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sản phẩm đã thích ({wishlist.length})</Text>

      <FlatList
        data={wishlist}
        renderItem={({ item }) => (
          // Sử dụng lại component ProductCard
          <ProductCard item={item} onNavigate={handleNavigateToDetail} />
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
  },
  loadingText: {
    marginTop: 10,
    color: "#FF6347",
  },
  listContent: {
    paddingHorizontal: 10,
  },
});

export default WishlistScreen;
