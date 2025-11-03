import Header from "@/components/header/header";
import SalePaner from "@/components/header/salepaner";
import ProductCard from "@/components/product/ProductCard";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ⚠️ Đảm bảo IP BACKEND đã được thiết lập chính xác
const API_URL = "http://192.168.100.114:5000/api/products";

const style = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

interface ProductItem {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
}

const HomeScreen = () => {
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [displayProducts, setDisplayProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ SỬ DỤNG useCallback CHO HÀM BẤT ĐỒNG BỘ (Fix lỗi performance)
  const fetchProducts = useCallback(
    async (isPullToRefresh: boolean = false) => {
      if (!isPullToRefresh) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const response = await fetch(API_URL);
        const apiData = await response.json(); // Nhận dữ liệu thô

        // 🎯 SỬA LỖI ĐỊNH DẠNG API: Backend đã được sửa để trả về mảng trực tiếp
        if (Array.isArray(apiData)) {
          const fetchedData: ProductItem[] = apiData;
          setAllProducts(fetchedData);
          setDisplayProducts(fetchedData);
        } else {
          // Trường hợp API trả về Object lỗi hoặc định dạng cũ
          console.error(
            "API trả về định dạng không mong muốn hoặc lỗi:",
            apiData
          );
          setError("Lỗi: Không thể tải dữ liệu sản phẩm.");
          setAllProducts([]);
          setDisplayProducts([]);
        }
      } catch (error) {
        console.error("Could not fetch data:", error);
        setError("Không thể kết nối đến Server Backend.");
        setAllProducts([]);
        setDisplayProducts([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  ); // Dependency rỗng vì API_URL là hằng số

  useEffect(() => {
    // ⚠️ Loại bỏ hàm bọc ngoài để gọi trực tiếp fetchProducts
    fetchProducts();
  }, [fetchProducts]); // Thêm fetchProducts vào dependency array

  const handleSearch = useCallback(
    (keyword: string) => {
      if (!keyword || keyword.trim() === "") {
        setDisplayProducts(allProducts);
        return;
      }

      const lowerCaseKeyword = keyword.toLowerCase().trim();
      const filtered = allProducts.filter((product) => {
        return product.title.toLowerCase().includes(lowerCaseKeyword);
      });

      setDisplayProducts(filtered);
    },
    [allProducts]
  );

  const handlePullToRefresh = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const handleNavigateToDetail = (productId: string) => {
    router.push(`/productDetail/${productId}`);
  };

  if (isLoading) {
    return (
      <View style={style.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 10 }}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (error && displayProducts.length === 0) {
    return (
      <View style={style.center}>
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onSearch={handleSearch} />

      <FlatList
        // ✅ Đảm bảo luôn truyền mảng (an toàn)
        data={displayProducts || []}
        renderItem={({ item }) => (
          <ProductCard item={item} onNavigate={handleNavigateToDetail} />
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        onRefresh={handlePullToRefresh}
        refreshing={isRefreshing}
        ListHeaderComponent={() => (
          <>
            <SalePaner />
            {displayProducts.length === 0 &&
              !isLoading &&
              !isRefreshing &&
              !error && (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Text style={{ color: "#9CA3AF" }}>
                    Không tìm thấy sản phẩm nào.
                  </Text>
                </View>
              )}
          </>
        )}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </SafeAreaView>
  );
};
export default HomeScreen;
