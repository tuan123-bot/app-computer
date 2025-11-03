// app/_context/AuthContext.tsx

import axios from "axios";
import { useRouter } from "expo-router";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";

// ⚠️ THAY THẾ BẰNG IP CHÍNH XÁC CỦA MÁY CHỦ BACK-END
const API_BASE_URL = "http://192.168.100.114:5000";
// Lưu ý: Cần import AsyncStorage hoặc SecureStore cho dự án thực tế

// ------------------------------------
// 1. Định nghĩa Kiểu Dữ liệu (Giữ nguyên)
// ------------------------------------
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUserProfile: (authToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ------------------------------------
// 2. Auth Provider
// ------------------------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setUser(null);
    setToken(null);
    router.replace("/(auth)/login");
  }; // Hàm tải profile

  const fetchUserProfile = async (
    authToken: string | null | undefined = token
  ) => {
    if (!authToken) return;
    setIsLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const response = await axios.get(
        `${API_BASE_URL}/api/users/profile`,
        config
      );

      const profileData: UserProfile = response.data;
      setUser(profileData);
      setToken(authToken);
    } catch (error: any) {
      console.error("Lỗi tải profile hoặc Token hết hạn:", error);
      Alert.alert(
        "Lỗi Phiên",
        "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
      );
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Gọi API Login
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password,
      });
      const authToken = response.data.token; // Lưu token và tải profile

      await fetchUserProfile(authToken); // Chuyển hướng đến root tabs
      router.replace("/HomeScreen");
    } catch (error: any) {
      console.error(
        "Lỗi đăng nhập:",
        error.response?.data?.message || error.message
      );
      Alert.alert(
        "Lỗi Đăng nhập",
        error.response?.data?.message || "Kiểm tra email và mật khẩu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, fetchUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ------------------------------------
// 3. Custom Hook (Giữ nguyên)
// ------------------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
