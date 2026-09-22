import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useResponsive } from "../../utils/responsive";

const COLORS = {
  primary: "#008383",
  textDark: "#123B3A",
  textSecondary: "#687474",
  lightTeal: "#EAF5F4",
  white: "#FFFFFF",
};

export default function FavoritesScreen() {
  const router = useRouter();
  const { moderateScale, wp } = useResponsive();
  return(
  <View style={[styles.screen, { paddingHorizontal: wp(5) }]}>
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
      <Text style={[styles.title, { fontSize: moderateScale(21) }]}>
        Favorites
      </Text>
    </View>
    <View style={styles.emptyState}>
      <View style={styles.iconCircle}>
        <Ionicons
          name="heart-outline"
          size={moderateScale(28)}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>Your saved routes</Text>
      <Text style={styles.emptyText}>
        Favorite routes will appear here when connected to your account.
      </Text>
    </View>
  </View>);
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white, paddingTop: 18 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: { fontFamily: "Poppins-SemiBold", color: COLORS.textDark },
  emptyState: { alignItems: "center", marginTop: 90, paddingHorizontal: 24 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.lightTeal,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: COLORS.textDark,
    marginTop: 16,
  },
  emptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
});
