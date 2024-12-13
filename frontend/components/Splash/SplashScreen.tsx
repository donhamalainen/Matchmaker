import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { COLORS } from "@/constants/colors";

type SplashScreenProps = {
  onAnimationFinished: () => void;
};
const SplashScreen = ({ onAnimationFinished }: SplashScreenProps) => {
  const exitProgress = useSharedValue(0);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  useEffect(() => {
    // Viive ennen poistumisanimaatiota
    const exitTimeout = setTimeout(() => {
      exitProgress.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
    }, 3000);

    // Kutsu callback, kun poistumisanimaatio on valmis
    const finishTimeout = setTimeout(() => {
      onAnimationFinished();
    }, 3400);

    return () => {
      clearTimeout(exitTimeout);
      clearTimeout(finishTimeout);
    };
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      exitProgress.value,
      [0, 1],
      [0, SCREEN_HEIGHT]
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.text]}>Matchmaker</Animated.Text>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.white,
  },
});
