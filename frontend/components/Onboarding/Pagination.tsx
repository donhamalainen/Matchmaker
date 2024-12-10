import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { OnboardingData } from "@/data/onboarding";
import { SharedValue } from "react-native-reanimated";
import { Dot } from "./Dot";

type PaginationProps = {
  data: OnboardingData[];
  x: SharedValue<number>;
};

export const Pagination = ({ data, x }: PaginationProps) => {
  return (
    <View style={styles.container}>
      {data.map((_, index) => (
        <Dot key={index} index={index} x={x} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
