import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
// CHANGED: shared responsive hook instead of raw useWindowDimensions.
import { useResponsive } from "../../utils/responsive";

export default function SplashScreen() {
  const { height, moderateScale, clamp, hp, isTablet } = useResponsive();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/Onboarding");
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // CHANGED: titleSize/subtitleSize now use moderateScale + clamp instead of
  // raw width * 0.xx math — same idea, but shared with every other screen
  // and dampened so it doesn't get oversized on tablets.
  const titleSize = clamp(moderateScale(38), 28, 46);
  const subtitleSize = clamp(moderateScale(19), 16, 23);

  // These stay as % of height since vertical position naturally should
  // track screen height, not a font-scaling curve.
  const titleTop = hp(62);
  const subtitleMargin = hp(1.2);
  const loaderMargin = hp(4.5);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/splashBackground.png")}
        style={styles.background}
        resizeMode="cover"
      />

      <View
        style={[
          styles.content,
          {
            paddingTop: titleTop,
            // CHANGED: on tablets, cap the content column width and center
            // it so the title/subtitle don't sprawl across a huge screen.
            maxWidth: isTablet ? 500 : "100%",
            alignSelf: "center",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              fontSize: titleSize,
              lineHeight: titleSize * 1.15,
            },
          ]}
        >
          Kanyakumari
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: subtitleSize,
              marginTop: subtitleMargin,
              lineHeight: subtitleSize * 1.3,
            },
          ]}
        >
          Govt Bus Navigator
        </Text>

        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={{ marginTop: loaderMargin }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    // CHANGED: removed the redundant resizeMode: "cover" here — it's now
    // set once as a prop on <Image>, since setting it in both places is
    // confusing (the prop wins on most RN versions, but it's ambiguous).
  },

  content: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
