import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  imageWrapper: {
    width: width * 0.99,
    height: width * 0.5,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  imageCover: {
    width: "100%", // Ảnh sẽ chiếm 100% chiều rộng của wrapper
    height: "100%", // Ảnh sẽ chiếm 100% chiều cao của wrapper
  },
});

const SalePaner = () => {
  return (
    <View>
      <TouchableOpacity>
        <View style={style.container}>
          <View style={style.imageWrapper}>
            <Image
              style={style.imageCover}
              resizeMode="cover"
              source={require("../../assets/paner/paner.webp")}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default SalePaner;
