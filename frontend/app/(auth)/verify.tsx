import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ScreenView } from "@/components/ScreenView";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/useAuth";
import { COLORS } from "@/constants/colors";

const Verify = () => {
  const { onVerify } = useAuth();
  const [otp, setOtp] = useState<string>("");
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();

  const handleVerify = async () => {
    if (otp.length === 6) {
      try {
        const result = await onVerify(email, otp);
        if (result.success) {
          Alert.alert("Kirjautuminen onnistui", result.message);
          router.replace("/(tabs)/home");
        } else {
          Alert.alert("Virhe", result.message);
        }
      } catch (error) {
        Alert.alert("Virhe", "Jokin meni pieleen. Yritä uudelleen.");
      }
    } else {
      Alert.alert("Virhe", "Syötä 6-numeroinen OTP.");
    }
  };

  return (
    <ScreenView>
      <View style={styles.container}>
        <Text style={styles.title}>Syötä vahvistuskoodi</Text>
        <Text style={styles.subtitle}>
          Vahvistuskoodi on lähetetty osoitteeseen {email}.
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={6}
          placeholder="123456"
          value={otp}
          onChangeText={setOtp}
        />
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Vahvista</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/(auth)/sign" })}
        >
          <Text style={styles.resendText}>Syötä sähköposti uudelleen</Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  );
};

export default Verify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  resendText: {
    color: COLORS.secondary,
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
