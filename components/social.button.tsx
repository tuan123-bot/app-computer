import { Image, StyleSheet, Text, View } from "react-native";
import fb from "../assets/auth/facebook.png";
import gg from "../assets/auth/google.png";
import ShareButton from "./share.button";

const styles = StyleSheet.create({
  welcomeBtn: {
    flex: 1,
    gap: 10,
  },
});
const SocialButton = () => {
  return (
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
    </View>
  );
};
export default SocialButton;
