import { APP_COLOR } from "@/backend/utils/constant";
import ShareInput from "@/components/input/share.input";
import ShareButton from "@/components/share.button";
import SocialButton from "@/components/social.button";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = "http://192.168.100.114:5000";
const REGISTER_API_URL = `${BASE_URL}/api/register`;

const style = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    marginHorizontal: 20,
  },
});

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State để quản lý nút bấm

  const handleSignUp = async () => {
    // Simple validation
    if (!name || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);

    let success = false;
    let message = "Đã xảy ra lỗi không xác định.";

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send name, email, password to the server
        body: JSON.stringify({ name, email, password }),
      });

      // Lấy dữ liệu phản hồi JSON
      const data = await response.json();

      if (response.ok && response.status === 201) {
        success = true;
        message = data.msg || "Đăng ký tài khoản mới thành công!";
        // Clear input fields on success
        setName("");
        setEmail("");
        setPassword("");
      } else {
        // Xử lý lỗi từ server (ví dụ: email đã tồn tại)
        message = data.msg || "Đăng ký thất bại. Vui lòng thử lại.";
      }
    } catch (error) {
      // Bắt lỗi kết nối mạng (ví dụ: không thể tìm thấy server)
      console.error("Lỗi kết nối API:", error);
      message = `Không thể kết nối đến máy chủ: ${REGISTER_API_URL}. Vui lòng kiểm tra Server Backend, IP và Tường lửa.`;
    } finally {
      // Hiển thị kết quả cuối cùng
      Alert.alert(success ? "Thành công" : "Lỗi", message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={style.container}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "black" }}>
            Trang Đăng Kí
          </Text>
        </View>

        <ShareInput value={name} setValue={setName} title="Họ và tên" />

        <ShareInput
          value={email}
          setValue={setEmail}
          keyboardType="email-address"
          title="Email"
        />

        <ShareInput
          value={password}
          setValue={setPassword}
          title="Password"
          secureTextEntry={true}
        />

        <ShareButton
          title={loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÍ"} // Display loading state
          onPress={handleSignUp}
          disabled={loading} // Disable button when loading
          textStyle={{
            textTransform: "uppercase",
            color: "white", // Giữ màu chữ trắng
          }}
          buttonStyle={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            marginHorizontal: 50,
            borderRadius: 30,
            // KHÔI PHỤC STYLE BUTTON BAN ĐẦU CỦA BẠN (Và thêm logic disabled)
            backgroundColor: loading ? APP_COLOR.GREY : APP_COLOR.ORANGE,
          }}
          pressStyle={{ alignSelf: "stretch" }}
        />

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center", color: "black" }}>
            Đã có tài khoản ?
          </Text>
          <Link href={"/(auth)/login"}>
            <Text style={{ color: "black", textDecorationLine: "underline" }}>
              Đăng nhập
            </Text>
          </Link>
        </View>
        <SocialButton />
      </View>
    </SafeAreaView>
  );
};
export default SignUp;
