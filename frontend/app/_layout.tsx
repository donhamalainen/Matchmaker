import { Slot } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider } from "@/context/useAuth";
import { StatusBar } from "react-native";

// Default things
export { ErrorBoundary } from "expo-router";
preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ChillaxMedium: require("../assets/fonts/Chillax-Medium.otf"),
    ChillaxSemibold: require("../assets/fonts/Chillax-Semibold.otf"),
    GeneralSansSemibold: require("../assets/fonts/GeneralSans-Semibold.otf"),
    GeneralSansMedium: require("../assets/fonts/GeneralSans-Medium.otf"),
    GeneralSansRegular: require("../assets/fonts/GeneralSans-Regular.otf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;

  return (
    <AuthProvider>
      <StatusBar barStyle={"dark-content"} />
      <Slot />
    </AuthProvider>
  );
}
