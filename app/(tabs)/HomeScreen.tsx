import Header from "@/components/header/header";
import SalePaner from "@/components/header/salepaner";
import ProductCard from "@/components/product/ProductCard";
import { useRouter } from "expo-router"; // 🚨 Import useRouter
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Chú ý: 10.0.2.2 là địa chỉ localhost khi chạy trên Android Emulator
const API_URL = "http://10.0.2.2:5000/api/products";

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
  const router = useRouter(); // Khởi tạo router

  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [displayProducts, setDisplayProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
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
      setIsLoading(false);
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

  // 🚨 HÀM MỚI: Xử lý chuyển hướng đến trang chi tiết
  const handleNavigateToDetail = (productId: string) => {
    // Sử dụng route động để chuyển sang màn hình productDetail/[id].tsx
    router.push("/productDetail/[id]");
  };

  if (isLoading) {
    return (
      <View style={style.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onSearch={handleSearch} />
      <ScrollView style={{ flex: 1 }}>
        <SalePaner />
        <FlatList
          data={displayProducts}
          renderItem={({ item }) => (
            // 🚨 SỬA: Truyền hàm điều hướng onNavigate xuống ProductCard
            <ProductCard item={item} onNavigate={handleNavigateToDetail} />
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 8 }} // Thêm padding cho đẹp
        />
        {displayProducts.length === 0 && !isLoading && (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#9CA3AF" }}>
              Không tìm thấy sản phẩm nào.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;
