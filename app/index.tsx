import ShareButton from "@/components/share.button";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import fb from "../assets/auth/facebook.png";
import gg from "../assets/auth/google.png";
import bg from "../assets/auth/welcome-background.png";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  welcomeText: {
    flex: 0.6,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 10,
  },
  welcomeBtn: {
    flex: 0.4,
  },
  heading: {
    fontSize: 40,
    fontWeight: "600",
  },
  body: {
    fontSize: 30,
    color: "orange",
    marginVertical: 10,
  },
  footer: {},
});

const WelcomePagev = () => {
  return (
    <ImageBackground style={{ flex: 1 }} source={bg}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={["transparent", "rgba(0,0,0,0.8)"]}
      >
        <View style={styles.container}>
          <View style={styles.welcomeText}>
            <Text style={styles.heading}>Welcome to</Text>
            <Text style={styles.body}>Tuan-computer</Text>
            <Text style={styles.footer}>
              Bạn muốn mua máy tính đến với Tuan_computer
            </Text>
          </View>
          <View style={styles.welcomeBtn}>
            <Text
              style={{
                textAlign: "center",
              }}
            >
              <Text>Đăng nhập với</Text>
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 30,
                paddingVertical: 10,
              }}
            >
              <ShareButton
                title="facebook"
                onPress={() => {
                  alert("me");
                }}
                buttonStyle={{
                  justifyContent: "center",
                  borderRadius: 30,
                  backgroundColor: "white",
                }}
                textStyle={{ textTransform: "uppercase" }}
                icon={<Image source={fb} />}
              />
              <ShareButton
                title="Google"
                onPress={() => {
                  alert("me");
                }}
                buttonStyle={{
                  justifyContent: "center",
                  borderRadius: 30,
                  paddingHorizontal: 30,
                  backgroundColor: "white",
                }}
                textStyle={{ textTransform: "uppercase" }}
                icon={<Image source={gg} />}
              />
            </View>
            <View style={{ paddingBottom: 10 }}>
              <ShareButton
                title="Đăng nhập với email"
                onPress={() => {
                  router.navigate("/(auth)/login");
                }}
                textStyle={{
                  color: "#fff",
                  paddingVertical: 5,
                }}
                buttonStyle={{
                  justifyContent: "center",
                  borderRadius: 30,
                  marginHorizontal: 50,
                  paddingVertical: 10,
                  backgroundColor: "#2c2c2c",
                }}
                pressStyle={{ alignSelf: "stretch" }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                Chưa có tài khoản ?
              </Text>
              <Link href={"/(auth)/signup"}>
                <Text
                  style={{ color: "white", textDecorationLine: "underline" }}
                >
                  Đăng kí
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};
export default WelcomePagev;
