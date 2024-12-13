import { Slot } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/useAuth";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SplashScreen from "@/components/Splash/SplashScreen";

// Default things
export { ErrorBoundary } from "expo-router";
// SplashScreen
preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const [loaded, error] = useFonts({
    ChillaxMedium: require("../assets/fonts/Chillax-Medium.otf"),
    ChillaxSemibold: require("../assets/fonts/Chillax-Semibold.otf"),
    GeneralSansSemibold: require("../assets/fonts/GeneralSans-Semibold.otf"),
    GeneralSansMedium: require("../assets/fonts/GeneralSans-Medium.otf"),
    GeneralSansRegular: require("../assets/fonts/GeneralSans-Regular.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      hideAsync();
      setReady(true);
    }
  }, [loaded, error]);
  if (!loaded && !error) return null;

  const showTheSplash = !ready || !splashAnimationFinished;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar barStyle={"dark-content"} />
        <Slot />
        {showTheSplash && (
          <SplashScreen
            onAnimationFinished={() => setSplashAnimationFinished(true)}
          />
        )}
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
