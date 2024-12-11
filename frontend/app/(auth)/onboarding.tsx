import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { RenderItemOnBoarding } from "@/components/Onboarding/RenderItemOnBoarding";
import onboardingData, { OnboardingData } from "@/data/onboarding";
import { View, StyleSheet, FlatList, ViewToken } from "react-native";
import { Pagination } from "@/components/Onboarding/Pagination";
import { CustomButton } from "@/components/Onboarding/CustomButton";

export default function OnboardingScreen() {
  const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);

  // Päivitetään `flatlistIndex` vierityksen aikana
  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      flatListIndex.value = viewableItems[0].index!;
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });
  return (
    <View style={styles.container}>
      {/* Animoitu FlatList */}
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item, index }) => (
          <RenderItemOnBoarding item={item} index={index} x={x} />
        )}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 50,
        }}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Pagination ja CustomButton footerissa */}
      <View style={styles.footer}>
        <Pagination data={onboardingData} x={x} />
        <CustomButton
          dataLength={onboardingData.length}
          flatListRef={flatListRef}
          flatlistIndex={flatListIndex}
          x={x}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 30,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
/*

<ScrollView
        ref={scrollRef}
        horizontal
        // pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Text>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footerContainer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text variant="bodySmall" style={styles.buttonTextNext}>
            Get
          
          <AntDesign name="right" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>
*/
