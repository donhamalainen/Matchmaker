import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { COLORS } from "@/constants/colors";

type DotProps = {
  index: number;
  x: SharedValue<number>;
};

export const Dot = ({ index, x }: DotProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const animatedDot = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH, // Edellinen sivu
        index * SCREEN_WIDTH, // Nykyinen sivu
        (index + 1) * SCREEN_WIDTH, // Seuraava sivu
      ],
      [10, 20, 10], // Skaalaa sisääntulosta suureksi ja pienemmäksi
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH, // Edellinen sivu
        index * SCREEN_WIDTH, // Nykyinen sivu
        (index + 1) * SCREEN_WIDTH, // Seuraava sivu
      ],
      [0.5, 1, 0.5], // Skaalaa sisääntulosta suureksi ja pienemmäksi
      Extrapolation.CLAMP
    );
    return {
      width: widthAnimation,
      opacity,
    };
  });

  const animatedColor = useAnimatedStyle(() => {
    const backgroundColorAnimation = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      [COLORS.onBoardFirst, COLORS.onBoardSecond, COLORS.onBoardThird]
    );
    return {
      backgroundColor: backgroundColorAnimation,
    };
  });
  return <Animated.View style={[styles.dot, animatedDot, animatedColor]} />;
};

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.black,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});
