import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useResponsive } from "../../utils/responsive";
import { POPULAR_ROUTES } from "../data/busData";

const COLORS = {
  primary: "#008383",
  textDark: "#123B3A",
  textSecondary: "#687474",
  lightTeal: "#EAF5F4",
  white: "#FFFFFF",
};
export default function RoutesScreen() {
  const router = useRouter();
  const { moderateScale, moderateVerticalScale, wp } = useResponsive();
  return(
  <View style={styles.screen}>
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: wp(5), paddingBottom: moderateVerticalScale(30) },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconButton}
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(22)}
            color={COLORS.textDark}
          />
        </Pressable>
        <View>
          <Text style={[styles.title, { fontSize: moderateScale(22) }]}>
            Popular Routes
          </Text>
          <Text style={styles.subtitle}>
            Choose a route to see available services
          </Text>
        </View>
      </View>
      {POPULAR_ROUTES.map((route) => (
        <Pressable
          key={route.id}
          style={styles.routeCard}
          onPress={() =>
            router.push({
              pathname: "/available-buses",
              params: { from: route.from, to: route.to },
            } as never)
          }
          accessibilityLabel={`View buses from ${route.from} to ${route.to}`}
        >
          <View style={styles.routeIcon}>
            <Ionicons
              name="map-outline"
              size={moderateScale(22)}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.routeText}>
            <Text style={styles.routeValue}>{route.from}</Text>
            <View style={styles.arrowRow}>
              <View style={styles.line} />
              <Ionicons
                name="arrow-forward"
                size={moderateScale(16)}
                color={COLORS.primary}
              />
              <View style={styles.line} />
            </View>
            <Text style={styles.routeValue}>{route.to}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={moderateScale(18)}
            color={COLORS.textSecondary}
          />
        </Pressable>
      ))}
    </ScrollView>
  </View>)
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  content: { paddingTop: 18 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: { fontFamily: "Poppins-SemiBold", color: COLORS.textDark },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  routeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  routeIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: COLORS.lightTeal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  routeText: { flex: 1 },
  routeValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: COLORS.textDark,
  },
  arrowRow: { flexDirection: "row", alignItems: "center", marginVertical: 3 },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 7,
  },
});
