import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
// CHANGED: useWindowDimensions from react-native swapped for our shared
// useResponsive() hook (utils/responsive.ts) — same live width/height, plus
// ready-made scaling helpers so this component matches every other screen.
import { useResponsive } from "../utils/responsive";

type OnboardingCardProps = {
  image: ImageSourcePropType;
  title: string;
  highlightedTitle: string;
  description: string;
};

export default function OnboardingCard({
  image,
  title,
  description,
  highlightedTitle,
}: OnboardingCardProps) {
  const { width, height, moderateScale, clamp, isTablet, hp } =
    useResponsive();

  // CHANGED: fontSize logic now uses moderateScale (scales with the screen,
  // dampened so it doesn't blow up on tablets) wrapped in clamp() so it can
  // never go below/above a readable range — same intent as the old
  // Math.max/Math.min, just centralized and reused everywhere.
  const titleSize = clamp(moderateScale(28), 20, 32);
  const descriptionSize = clamp(moderateScale(14.5), 13, 18);

  return (
    <View style={styles.card}>
      {/* IMAGE */}
      <View
        style={[
          styles.imageContainer,
          // CHANGED: added minHeight = 30% of screen height. Previously the
          // image only had flex:1, sharing space with the text block below.
          // On short/landscape screens the text content could squeeze the
          // image down to almost nothing. This floor guarantees the image
          // always stays a reasonable size, while flex:1 still lets it grow
          // on taller screens.
          { minHeight: hp(55) },
        ]}
      >
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>

      {/* TEXT CONTENT */}
      <View
        style={[
          styles.content,
          {
            paddingHorizontal: width * 0.07,
            // CHANGED: on tablets, cap the text block width and let it
            // center itself (via card's alignItems: "center") instead of
            // stretching to a 1000px-wide line of text.
            maxWidth: isTablet ? 560 : "100%",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              fontSize: titleSize,
              lineHeight: titleSize * 1.2,
            },
          ]}
        >
          {title}
          {"\n"}

          <Text
            style={[
              styles.highlight,
              {
                fontSize: titleSize,
                lineHeight: titleSize * 1.2,
              },
            ]}
          >
            {highlightedTitle}
          </Text>
        </Text>

        <Text
          style={[
            styles.description,
            {
              fontSize: descriptionSize,
              lineHeight: descriptionSize * 1.45,
              marginTop: height * 0.012,
            },
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },

  imageContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  content: {
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
    // CHANGED: removed the old hardcoded `paddingHorizontal: 25` — it was
    // always overridden by the inline `paddingHorizontal: width * 0.07`
    // above, so keeping both was dead/confusing code, not a real bug.
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#123B3A",
    textAlign: "center",
    // CHANGED: removed static fontSize: 27 / lineHeight: 34. These were
    // always overridden by the responsive inline style anyway.
  },

  highlight: {
    fontFamily: "Poppins_600SemiBold",
    color: "#008C83",
  },

  description: {
    // CHANGED: removed fixed width: "90%" and static marginTop/lineHeight.
    // The 90% fixed width fought with the new tablet maxWidth above, and
    // the marginTop/lineHeight were always overridden by the inline
    // responsive values already. The parent's paddingHorizontal now fully
    // controls how wide the description text block is.
    fontFamily: "Poppins_400Regular",
    color: "#687474",
    textAlign: "center",
  },
});
