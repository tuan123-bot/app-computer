import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// ⚠️ THAY THẾ IP NÀY BẰNG IP LAN CHÍNH XÁC CỦA MÁY CHỦ EXPRESS CỦA BẠN
const BACKEND_API_URL = "http://192.168.100.114:5000/api/orders";

const CheckoutScreen = () => {
  const router = useRouter();

  const { token } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Transfer">("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  const isValid =
    name.trim() !== "" && phone.trim() !== "" && address.trim() !== "";

  // 🧾 XỬ LÝ ĐẶT HÀNG
  const handlePlaceOrder = async () => {
    if (!token) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để hoàn tất đơn hàng.");
      router.push("/(auth)/login");
      return;
    }

    if (!isValid || isProcessing) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin hoặc đang xử lý.");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      customerName: name,
      customerPhone: phone,
      deliveryAddress: address,
      paymentMethod:
        paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản",
      totalAmount: cartTotal,
      // 🎯 FIX LỖI: Thêm trường 'qty: 1' vào mỗi item
      items: cartItems.map((item) => ({
        title: item.title,
        price: item.price,
        qty: 1, // 👈 BỔ SUNG SỐ LƯỢNG MẶC ĐỊNH LÀ 1
      })),
    };

    try {
      const response = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
        }
        throw new Error(
          result.message ||
            "Đặt hàng thất bại. Vui lòng kiểm tra kết nối Server."
        );
      }

      Alert.alert(
        "Đặt hàng thành công! 🎉",
        "Đơn hàng của bạn đã được gửi tới Admin. Mã ĐH: " + result.orderId,
        [
          {
            text: "Hoàn tất",
            onPress: () => {
              clearCart();
              router.push("/HomeScreen");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("LỖI GỬI ĐƠN HÀNG:", error);
      Alert.alert("Lỗi Đặt Hàng", error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 💳 COMPONENT CHỌN PHƯƠNG THỨC THANH TOÁN
  const PaymentOption = ({
    method,
    label,
  }: {
    method: "COD" | "Transfer";
    label: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.paymentButton,
        paymentMethod === method && styles.paymentButtonActive,
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <Text
        style={[
          styles.paymentButtonText,
          paymentMethod === method && styles.paymentButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.fullContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🛒 Thông Tin Thanh Toán</Text>

        {/* THÔNG TIN KHÁCH HÀNG */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Thông tin giao hàng</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ tên người nhận *"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ nhận hàng chi tiết *"
            value={address}
            onChangeText={setAddress}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Phương thức thanh toán</Text>
          <View style={styles.paymentOptions}>
            <PaymentOption
              method="COD"
              label="Thanh toán khi nhận hàng (COD)"
            />
            <PaymentOption method="Transfer" label="Chuyển khoản Ngân hàng" />
          </View>
        </View>

        {/* TÓM TẮT ĐƠN HÀNG */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Tóm tắt đơn hàng</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Tổng sản phẩm ({cartItems.length}):
            </Text>
            <Text style={styles.summaryValue}>
              {cartTotal.toLocaleString("vi-VN")} VND
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
            <Text style={styles.summaryValue}>Miễn phí</Text>
          </View>

          <View
            style={[
              styles.summaryRow,
              {
                borderTopWidth: 1,
                borderTopColor: "#ddd",
                paddingTop: 10,
                marginTop: 10,
              },
            ]}
          >
            <Text style={styles.summaryTotalLabel}>TỔNG CỘNG:</Text>
            <Text style={styles.summaryTotalValue}>
              {cartTotal.toLocaleString("vi-VN")} VND
            </Text>
          </View>
        </View>

        {/* NÚT ĐẶT HÀNG */}
        <TouchableOpacity
          onPress={handlePlaceOrder}
          style={[
            styles.placeOrderButton,
            (!isValid || isProcessing) && styles.placeOrderButtonDisabled,
          ]}
          disabled={!isValid || isProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.placeOrderButtonText}>
            {isProcessing ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐẶT HÀNG"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --- STYLES (Giữ nguyên) ---
const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContainer: { padding: 20, paddingTop: 50, paddingBottom: 100 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#333",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  paymentOptions: { flexDirection: "column", gap: 10 },
  paymentButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  paymentButtonActive: { borderColor: "#27AE60", backgroundColor: "#E8F8F5" },
  paymentButtonText: { fontSize: 16, color: "#555", fontWeight: "500" },
  paymentButtonTextActive: { color: "#27AE60", fontWeight: "bold" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 16, color: "#555" },
  summaryValue: { fontSize: 16, fontWeight: "600", color: "#333" },
  summaryTotalLabel: { fontSize: 18, fontWeight: "bold", color: "#333" },
  summaryTotalValue: { fontSize: 20, fontWeight: "bold", color: "#E74C3C" },
  placeOrderButton: {
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  placeOrderButtonDisabled: { backgroundColor: "#A9A9A9" },
  placeOrderButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default CheckoutScreen;
