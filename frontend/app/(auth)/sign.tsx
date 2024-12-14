import { ScreenView } from "@/components/ScreenView";
import { COLORS } from "@/constants/colors";
import { Text } from "@/components/Text";
import {
  StyleProp,
  StyleSheet,
  TextProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/useAuth";
import { router } from "expo-router";
import { useState } from "react";

export default function SignScreen() {
  const [email, setEmail] = useState<string>("hamalainen.don@gmail.com");
  const { onLogin } = useAuth();

  const handleLogin = async (email: string) => {
    const result = await onLogin(email);
    if (result.success) {
      router.replace({
        pathname: "/(auth)/verify",
        params: { email },
      });
    } else {
      alert(result.message);
    }
  };
  return (
    <ScreenView>
      <View style={styles.header}></View>
      <View style={styles.footer}>
        <Button
          title="Jatka sähköpostilla"
          onPress={() => handleLogin(email)}
        />
        <Button
          title="Jatka kirjautumatta"
          onPress={() => router.replace("/(tabs)/home")}
        />
      </View>
    </ScreenView>
  );
}

const Button = ({
  style,
  title,
  onPress,
}: {
  style?: StyleProp<TextProps>;
  title: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text variant="bodySmall" color={COLORS.black}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {},
  footer: {
    width: "100%",
  },

  button: {},
});
