import { Pressable, StyleSheet, View, Alert } from "react-native";
import React from "react";
import { useAuth } from "@/context/useAuth";
import { useState } from "react";
import { ScreenView } from "@/components/ScreenView";
import { Text } from "@/components/Text";
import { TextInput } from "@/components/TextInput";
import { COLORS } from "@/constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ICON_SIZE_SMALL } from "@/constants/sizing";

type InputFieldProps = {
  setUsername: (username: string) => void;
  username: string;
  setPassword: (password: string) => void;
  password: string;
};
export default function SignScreen() {
  const { onLogin } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (username === "" || password === "") {
      Alert.alert(
        "Täytä kaikki kentät",
        "Käyttäjätunnus ja salasana ovat pakollisia."
      );
      return;
    }
    const result = await onLogin(username, password);

    if (result.success) {
      Alert.alert("Onnistui", result.message);
    } else {
      Alert.alert("Virhe", result.message);
    }
  };
  return (
    <ScreenView>
      <View style={styles.header}>
        <Text variant="title">Tervehdys!</Text>
        <Text variant="body" style={styles.headerSubtext}>
          Kirjaudu sisään käyttäjätunnuksella ja salasanalla.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <InputField
          setPassword={setPassword}
          setUsername={setUsername}
          username={username}
          password={password}
        />
        <Pressable
          onPress={() => console.log("onPressed")}
          style={styles.forgot}
        >
          {/* <Text variant="body" style={styles.forgotText}>
            Unohtuiko salasana?
          </Text> */}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Button
          text="Kirjaudu sisään"
          bgColor={COLORS.buttonBackground}
          onPress={handleLogin}
        />
        <Button
          text="Rekisteröidy"
          bgColor={COLORS.lightBackground}
          onPress={() => console.log("register")}
        />
      </View>
    </ScreenView>
  );
}
type ButtonProps = {
  onPress: () => void;
  text: string;
  bgColor?: string;
  // style?: StyleProp<ViewStyle>;
};
const Button = ({ onPress, text, bgColor }: ButtonProps) => {
  return (
    <Pressable
      // {...props}
      onPress={onPress}
      style={[styles.button, { backgroundColor: bgColor }]}
    >
      <Text variant="buttonBody" style={styles.buttonText}>
        {text}
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
const InputField = ({
  setUsername,
  username,
  setPassword,
  password,
}: InputFieldProps) => {
  return (
    <>
      <TextInput
        placeholder="Käyttäjänimi"
        placeholderTextColor={COLORS.primary}
        keyboardType="default"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Salasana"
        placeholderTextColor={COLORS.primary}
        keyboardType="default"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSubtext: {
    marginVertical: 10,
    paddingHorizontal: 40,
    fontSize: 20,
    textAlign: "center",
  },
  inputContainer: {
    paddingBottom: 20,
  },
  forgot: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  forgotText: { color: COLORS.black },

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

  footer: {
    flex: 1,
    gap: 10,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
});
