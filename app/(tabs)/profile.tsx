// app/(tabs)/profile.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://192.168.100.114:5000";
const DEFAULT_AVATAR = "https://i.imgur.com/vH97N7x.png";

interface OrderItem {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrderHistory = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number | null | undefined) =>
    (amount || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          `${API_BASE_URL}/api/orders/myorders`,
          config
        );
        const data = res.data.data || res.data;
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        Alert.alert("Lỗi", "Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) return <ActivityIndicator style={styles.center} size="small" />;
  if (orders.length === 0)
    return <Text style={styles.emptyText}>Bạn chưa đặt đơn hàng nào.</Text>;

  return (
    <View style={styles.sectionContainer}>
      {orders.map((o) => (
        <View key={o._id} style={styles.orderCard}>
          <Text style={styles.orderText}>
            Mã ĐH: {o._id?.slice(-6) || "N/A"}
          </Text>
          <Text style={styles.orderText}>
            Tổng tiền: {formatCurrency(o.totalAmount)}
          </Text>
          <Text style={styles.orderStatus}>Trạng thái: {o.status}</Text>
          {o.createdAt && (
            <Text style={{ fontSize: 12, color: "#999" }}>
              Ngày: {new Date(o.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const ChangePasswordForm = () => {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!token) return;
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp.");
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        `${API_BASE_URL}/api/users/password`,
        { currentPassword, newPassword },
        config
      );
      Alert.alert("Thành công", "Mật khẩu đã được cập nhật!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      Alert.alert(
        "Lỗi",
        e.response?.data?.message || "Không thể đổi mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <TextInput
        label="Mật khẩu hiện tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Xác nhận Mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleChangePassword}
        loading={loading}
        disabled={loading}
      >
        Cập nhật Mật khẩu
      </Button>
    </View>
  );
};

const ProfileScreen = () => {
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");

  if (isLoading)
    return <ActivityIndicator style={styles.center} size="large" />;
  if (!user) return <Text style={styles.center}>Vui lòng đăng nhập...</Text>;

  const avatarUri = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_BASE_URL}/${user.avatar}`
    : DEFAULT_AVATAR;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Thông báo", "Chức năng cập nhật ảnh đại diện")
            }
          >
            <Avatar.Image size={90} source={{ uri: avatarUri }} />
          </TouchableOpacity>
          <Text style={styles.userName}>{user.name || "Người dùng"}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Button
            mode="outlined"
            icon="logout"
            onPress={logout}
            style={styles.logoutButton}
          >
            Đăng xuất
          </Button>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "orders" && styles.activeTab]}
            onPress={() => setActiveTab("orders")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "orders" && styles.activeTabText,
              ]}
            >
              Lịch sử Đơn hàng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "password" && styles.activeTab]}
            onPress={() => setActiveTab("password")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "password" && styles.activeTabText,
              ]}
            >
              Đổi Mật khẩu
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "orders" && <OrderHistory />}
        {activeTab === "password" && <ChangePasswordForm />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f8f8" },
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileHeader: {
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  userEmail: { fontSize: 14, color: "#666" },
  logoutButton: { marginTop: 15, borderColor: "#ff3b30", borderWidth: 1 },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#007aff" },
  tabText: { fontSize: 16, color: "#666", fontWeight: "500" },
  activeTabText: { color: "#007aff" },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  orderCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderText: { fontSize: 14 },
  orderStatus: { fontSize: 14, fontWeight: "bold", color: "green" },
  input: { marginBottom: 10, backgroundColor: "#f9f9f9" },
  emptyText: { textAlign: "center", padding: 20, color: "#999" },
});

export default ProfileScreen;
