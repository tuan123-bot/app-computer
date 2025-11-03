import { APP_COLOR } from "@/backend/utils/constant";
import ShareInput from "@/components/input/share.input";
import ShareButton from "@/components/share.button";
import SocialButton from "@/components/social.button";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../app/context/AuthContext";

const style = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    marginHorizontal: 20,
  },
});

const Login = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Password.");
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
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
          title={isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
          onPress={handleLogin}
          disabled={isLoading}
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
            backgroundColor: isLoading ? APP_COLOR.GREY : APP_COLOR.ORANGE,
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
            Chưa có tài khoản?
          </Text>

          <Link href={"/(auth)/signup"}>
            <Text style={{ color: "black", textDecorationLine: "underline" }}>
              Đăng ký
            </Text>
          </Link>
        </View>

        <SocialButton />
      </View>
    </SafeAreaView>
  );
};

export default Login;
