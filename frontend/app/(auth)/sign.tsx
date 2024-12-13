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

export default function SignScreen() {
  const { onLogin, onRegister } = useAuth();
  return (
    <ScreenView>
      <View style={styles.header}></View>
      <View style={styles.footer}>
        <Button title="Jatka sähköpostilla" onPress={onRegister} />
        <Button title="Jatka kirjautumatta" onPress={onRegister} />
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
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
