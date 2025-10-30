import ShareInput from "@/components/input/share.input";
import ShareButton from "@/components/share.button";
import SocialButton from "@/components/social.button";
import { APP_COLOR } from "@/utils/constant";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const BASE_URL = "http://10.0.2.2:5000";
const LOGIN_API_URL = `${BASE_URL}/api/login`;

const style = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    marginHorizontal: 20,
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Simple validation
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Password.");
      return;
    }

    setLoading(true);

    let success = false;
    let message = "Đã xảy ra lỗi không xác định.";

    try {
      // Gọi API Đăng nhập
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && response.status === 200) {
        success = true;
        message = data.msg || "Đăng nhập thành công!";
        // TODO: Xử lý lưu Token JWT tại đây
        router.navigate("/(tabs)/HomeScreen");
      } else {
        message =
          data.msg || "Đăng nhập thất bại. Kiểm tra Email hoặc Mật khẩu.";
      }
    } catch (error) {
      // Bắt lỗi kết nối mạng (Network Timeout)
      console.error("Lỗi kết nối API:", error);
      message = `Không thể kết nối đến máy chủ: ${LOGIN_API_URL}. Vui lòng kiểm tra Server Backend, IP và Tường lửa.`;
    } finally {
      Alert.alert(success ? "Thành công" : "Lỗi", message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={style.container}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "black" }}>
            Trang Đăng Nhập
          </Text>
        </View>

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
          title={loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
          onPress={handleLogin}
          disabled={loading}
          textStyle={{
            textTransform: "uppercase",
            color: "white",
          }}
          buttonStyle={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            marginHorizontal: 50,
            borderRadius: 30,
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
            Chưa có tài khoản ?
          </Text>
          <Link href={"/(auth)/signup"}>
            <Text style={{ color: "black", textDecorationLine: "underline" }}>
              Đăng kí
            </Text>
          </Link>
        </View>
        <SocialButton />
      </View>
    </SafeAreaView>
  );
};
export default Login;
