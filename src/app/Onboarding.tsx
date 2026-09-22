import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import OnboardingCard from "../../components/OnboardingCard";
// CHANGED: shared responsive hook instead of raw useWindowDimensions.
import { useResponsive } from "../../utils/responsive";

const onboardingData = [
  {
    id: "1",
    image: require("../../assets/images/onboarding1.jpeg"),
    title: "Find the Right Bus",
    highlightedTitle: "at the Right Place",
    description: "Search any route, check timings, fares & more.",
  },
  {
    id: "2",
    image: require("../../assets/images/onboarding2.jpeg"),
    title: "Know Your Route",
    highlightedTitle: "with Ease",
    description: "Get route details, stops, fare & travel time.",
  },
  {
    id: "3",
    image: require("../../assets/images/onboarding3.jpeg"),
    title: "Explore Kanyakumari",
    highlightedTitle: "with Confidence",
    description: "Travel simple, safe & tourist friendly.",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const { width, moderateScale, wp, isTablet, clamp } = useResponsive();
  const flatListRef = useRef<FlatList>(null);

  // CHANGED: track the previous width so we can detect orientation changes /
  // window resizes (foldables, Android split-screen, web resizing).
  const prevWidthRef = useRef(width);

  // CHANGED: NEW — without this, rotating the device (or resizing the
  // window) shifts each slide's pixel width, but the FlatList's internal
  // scroll offset stays the same. Result: the "current" slide visually
  // jumps to show half of the next/previous card. This effect re-snaps the
  // list to the correct offset for the current index whenever width changes.
  useEffect(() => {
    if (prevWidthRef.current !== width) {
      prevWidthRef.current = width;
      flatListRef.current?.scrollToOffset({
        offset: width * currentIndex,
        animated: false,
      });
    }
  }, [width, currentIndex]);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });

      return;
    }

    try {
      router.push("/welcome");
    } catch {
      console.log("Get Started -> welcome page");
    }
  };

  const handleSkip = () => {
    try {
      router.push("/welcome");
    } catch {
      console.log("Skip onboarding -> welcome page");

      flatListRef.current?.scrollToIndex({
        index: onboardingData.length - 1,
        animated: true,
      });
    }
  };

  const isLastSlide =
    currentIndex === onboardingData.length - 1;

  // CHANGED: dot, button and text sizes now computed with moderateScale so
  // they grow a little on tablets/large phones and shrink a little on small
  // phones (iPhone SE etc.) instead of staying a fixed pixel size that looks
  // tiny on a tablet and cramped on a small screen.
  const dotSize = clamp(moderateScale(8), 6, 10);
  const activeDotWidth = clamp(moderateScale(24), 18, 30);
  const navButtonSize = clamp(moderateScale(52), 46, 64);
  const pillHeight = clamp(moderateScale(38), 34, 46);
  const skipFontSize = clamp(moderateScale(13), 12, 15);
  const nextFontSize = clamp(moderateScale(15), 14, 17);
  const getStartedFontSize = clamp(moderateScale(16), 15, 19);

  return (
    <View style={styles.container}>
      {/* ONBOARDING SLIDES */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={{ width, height: "100%", flex: 1 }}>
            <OnboardingCard
              image={item.image}
              title={item.title}
              highlightedTitle={item.highlightedTitle}
              description={item.description}
            />
          </View>
        )}
      />

      {/* BOTTOM CONTROLS */}
      <View
        style={[
          styles.bottomSection,
          isLastSlide && styles.lastBottomSection,
          // CHANGED: on tablets, cap the bottom control bar's width and
          // center it — full-width buttons/rows look stretched and awkward
          // on a 10"+ screen.
          isTablet && { maxWidth: 560, alignSelf: "center", width: "100%" },
        ]}
      >
        {isLastSlide ? (
          <>
            {/* DOTS */}
            <View style={styles.dots}>
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                    },
                    currentIndex === index && [
                      styles.activeDot,
                      { width: activeDotWidth },
                    ],
                  ]}
                />
              ))}
            </View>

            {/* GET STARTED */}
            <TouchableOpacity
              style={[
                styles.getStartedButton,
                {
                  height: navButtonSize,
                  borderRadius: navButtonSize / 2,
                  // CHANGED: cap max width on tablets so the button doesn't
                  // stretch edge-to-edge on a wide screen.
                  maxWidth: isTablet ? 400 : "100%",
                  width: isTablet ? wp(60) : "100%",
                },
              ]}
              activeOpacity={0.8}
              onPress={handleNext}
            >
              <Text
                style={[
                  styles.getStartedText,
                  { fontSize: getStartedFontSize },
                ]}
              >
                Get Started
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* SKIP */}
            <TouchableOpacity
              style={[
                styles.skipButton,
                { height: pillHeight, borderRadius: pillHeight / 2 },
              ]}
              activeOpacity={0.8}
              onPress={handleSkip}
            >
              <Text style={[styles.skipText, { fontSize: skipFontSize }]}>
                Skip
              </Text>
            </TouchableOpacity>

            {/* DOTS */}
            <View style={styles.dots}>
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                    },
                    currentIndex === index && [
                      styles.activeDot,
                      { width: activeDotWidth },
                    ],
                  ]}
                />
              ))}
            </View>

            {/* NEXT */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: navButtonSize,
                  height: navButtonSize,
                  borderRadius: navButtonSize / 2,
                },
              ]}
              activeOpacity={0.8}
              onPress={handleNext}
            >
              <Text style={[styles.buttonText, { fontSize: nextFontSize }]}>
                Next
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  flatList: {
    flex: 1,
  },

  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop:30,
  },

  lastBottomSection: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 30,
    gap: 12,
  },

  skipButton: {
    minWidth: 58,
    backgroundColor: "#EAF5F4",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    // CHANGED: removed fixed height: 38 — now driven by pillHeight above.
  },

  skipText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#123B3A",
    // CHANGED: removed fixed fontSize: 13 — now driven by skipFontSize above.
  },

  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  dot: {
    backgroundColor: "#D0D5D5",
    marginHorizontal: 4,
    // CHANGED: removed fixed width/height/borderRadius (8/8/4) — now driven
    // by dotSize above so dots scale with the screen too.
  },

  activeDot: {
    backgroundColor: "#008C83",
    // CHANGED: removed fixed width: 24 — now driven by activeDotWidth above.
  },

  button: {
    backgroundColor: "#008C83",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    // CHANGED: removed fixed width/height/borderRadius (52/52/26) — now
    // driven by navButtonSize above.
  },

  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    // CHANGED: removed fixed fontSize: 15 — now driven by nextFontSize above.
  },

  getStartedButton: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    backgroundColor: "#008C83",
    // CHANGED: removed fixed width: "100%" / height: 52 / borderRadius: 26 —
    // now driven inline above (with a tablet-aware max width).
  },

  getStartedText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    // CHANGED: removed fixed fontSize: 16 — now driven by getStartedFontSize.
  },
});
