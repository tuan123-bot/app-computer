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

// const API_URL = "http://10.181.244.17:5000/api/products";
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

  // ✅ THÊM: State cho loading ban đầu (isLoading) và kéo làm mới (isRefreshing)
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ CHỈNH SỬA: Hàm tải dữ liệu, nhận tham số 'isPullToRefresh'
  const fetchProducts = async (isPullToRefresh: boolean = false) => {
    // Chỉ bật spinner loading ban đầu, không làm lại nếu là kéo làm mới
    if (!isPullToRefresh) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true); // Bật spinner làm mới
    }

    try {
      const response = await fetch(API_URL);
      const json = await response.json();

      if (json.status === "success" && Array.isArray(json.data)) {
        const fetchedData: ProductItem[] = json.data;
        setAllProducts(fetchedData);
        setDisplayProducts(fetchedData);
      } else {
        console.error(
          "API returned an error or unexpected format:",
          json.message,
          json
        );
      }
    } catch (error) {
      console.error("Could not fetch data:", error);
    } finally {
      // Ẩn cả hai trạng thái loading
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

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

  // ✅ THÊM: Hàm xử lý sự kiện kéo làm mới
  const handlePullToRefresh = useCallback(() => {
    // Gọi fetchProducts và báo cho nó là Pull-to-Refresh
    fetchProducts(true);
  }, []);

  const handleNavigateToDetail = (productId: string) => {
    router.push(`/productDetail/${productId}`);
  };

  if (isLoading) {
    return (
      <View style={style.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  // ✅ CHỈNH SỬA: BỎ SCROLLVIEW BỌC NGOÀI, SỬ DỤNG ListHeaderComponent
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onSearch={handleSearch} />

      <FlatList
        data={displayProducts}
        renderItem={({ item }) => (
          <ProductCard item={item} onNavigate={handleNavigateToDetail} />
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        // 👈 PROP QUAN TRỌNG NHẤT: Bắt sự kiện kéo làm mới
        onRefresh={handlePullToRefresh}
        // 👈 PROP KIỂM SOÁT SPINNER: Hiển thị vòng tròn loading
        refreshing={isRefreshing}
        // ✅ DÙNG ListHeaderComponent THAY CHO ScrollView
        ListHeaderComponent={() => (
          <>
            <SalePaner />
            {displayProducts.length === 0 && !isLoading && !isRefreshing && (
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
