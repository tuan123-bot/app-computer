// components/header/SalePaner.tsx (Đã thêm chức năng tự động trượt và API)

import axios from "axios"; // Cần axios cho API
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Constants
const CARD_MARGIN = 6;
const CARD_WIDTH = width - CARD_MARGIN * 2; // Chiều rộng của banner

// ⚠️ ĐỊA CHỈ API ĐỂ LẤY BANNER TỪ BACKEND
const API_URL = "http://192.168.100.114:5000/api/banners";

interface BannerItem {
  _id: string;
  image: string; // URL hoặc đường dẫn ảnh
  link: string; // Link khi bấm vào
}

const SalePaner = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // Chỉ số slide hiện tại
  const flatListRef = useRef<FlatList<BannerItem>>(null);

  // --- Logic Tải Banner từ Backend ---
  const fetchBanners = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;

      if (Array.isArray(data)) {
        setBanners(data);
      } else if (data && Array.isArray(data.banners)) {
        // Nếu API trả về { banners: [...] }
        setBanners(data.banners);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Lỗi tải banner:", error);
      // Giả định banner mặc định nếu lỗi
      setBanners([
        { _id: "default", image: "https://i.imgur.com/kS9wE8j.png", link: "" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // --- Logic Tự động Trượt (Auto Scroll) ---
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % banners.length;
        // Scroll tới slide tiếp theo
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000); // Trượt sau mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp khi unmount
  }, [banners.length]);

  // --- Hàm Render Từng Item ---
  const renderItem = ({ item }: { item: BannerItem }) => {
    const uri = item.image.startsWith("http")
      ? item.image
      : `${API_URL.split("/api")[0]}${item.image}`;

    return (
      <TouchableOpacity
        style={{ width: CARD_WIDTH, marginHorizontal: CARD_MARGIN }}
        onPress={() => console.log("Banner link:", item.link)}
        activeOpacity={0.8}
      >
        <Image
          style={styles.imageCover}
          resizeMode="cover"
          source={{ uri: uri }} // Sử dụng URL đã fix
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="small" style={{ height: width * 0.5 }} />;
  }

  if (banners.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginVertical: 20 }}>
        Không có banner nào.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled // Bắt buộc cho hiệu ứng trượt từng trang
        showsHorizontalScrollIndicator={false}
        // Cần thêm logic onScroll để cập nhật activeIndex thủ công nếu cần
      />
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  imageCover: {
    width: "100%",
    height: width * 0.4, // Chiều cao cố định dựa trên chiều rộng màn hình
    borderRadius: 8,
  },
});

export default SalePaner;
