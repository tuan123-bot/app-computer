import { APP_COLOR } from "@/backend/utils/constant";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    gap: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  inputGroup: {},
  eye: {
    position: "absolute",
    right: 10,
    top: 18,
  },
});

interface IProps {
  title?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  value: any;
  setValue: (v: any) => void;
}
const ShareInput = (props: IProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const {
    title,
    keyboardType,
    secureTextEntry = false,
    value,
    setValue,
  } = props;
  return (
    <View style={style.inputGroup}>
      {title && <Text style={style.text}>{title}</Text>}
      <View>
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text)}
          onFocus={() => {
            setIsFocus(true);
          }}
          onBlur={() => {
            setIsFocus(false);
          }}
          style={[
            style.input,
            { borderColor: isFocus ? APP_COLOR.ORANGE : APP_COLOR.GREY },
          ]}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isShowPassword}
        />
        {secureTextEntry && (
          <FontAwesome5
            style={style.eye}
            name={isShowPassword ? "eye" : "eye-slash"}
            size={15}
            color="black"
            onPress={() => {
              setIsShowPassword(!isShowPassword);
            }}
          />
        )}
      </View>
    </View>
  );
};
export default ShareInput;
