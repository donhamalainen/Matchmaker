import { ScreenView } from "@/components/ScreenView";
import { COLORS } from "@/constants/colors";
import { Text } from "@/components/Text";
import { Pressable, StyleSheet, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { ICON_SIZE, ICON_SIZE_SMALL } from "@/constants/sizing";

export default function ContinueScreen() {
  return (
    <ScreenView>
      <View style={styles.content}>
        <Button onPress={() => router.replace("/(auth)/sign")} />
        <Text variant="bodySmall" style={styles.privacy}>
          Jatkamalla hyväksyt sovellusen tietosuojaselosteen ja käyttöehdot.
        </Text>
      </View>
    </ScreenView>
  );
}

const Button = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text variant="buttonBody" style={styles.buttonText}>
        Jatka
      </Text>
      <AntDesign
        name="right"
        size={ICON_SIZE_SMALL}
        color={COLORS.black}
        style={styles.icon}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingBottom: 40,
    justifyContent: "flex-end",
  },
  privacy: {
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.buttonBackground,
    flexDirection: "row",
    padding: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    textAlign: "center",
  },
  icon: {
    position: "absolute",
    right: 20,
  },
});
