import {
  KeyboardType,
  TextInput as NativeTextInput,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { Text, TextStyles } from "./Text";

type Props = {
  label?: string | undefined;
  placeholder: string;
  placeholderTextColor?: string;
  value: string | number | undefined;
  onChangeText: (text: string) => void;

  style?: StyleProp<TextStyle>;
  maxLength?: number;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
};

export const TextInput = (props: Props) => {
  return (
    <View style={styles.container}>
      {props.label && (
        <Text variant="input" color={COLORS.black} style={styles.title}>
          {props.label}
        </Text>
      )}
      <NativeTextInput
        {...props}
        placeholderTextColor={props.placeholderTextColor}
        placeholder={props.placeholder}
        value={props.value?.toString() ?? ""}
        onChangeText={props.onChangeText}
        style={[styles.input, props.style]}
        keyboardType={props.keyboardType}
        maxLength={props.maxLength}
        selectionColor={COLORS.primary}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  title: {
    marginBottom: 5,
  },
  input: {
    ...TextStyles.input,
    padding: 20,
    textAlign: "left",
    backgroundColor: COLORS.lightBackground,
    color: COLORS.inputText,
    borderRadius: 12,
  },
});
