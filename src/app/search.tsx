import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useResponsive } from "../../utils/responsive";

const LOCATIONS = [
  "Nagercoil",
  "Kanyakumari",
  "Suchindram",
  "Colachel",
  "Marthandam",
  "Padmanabhapuram",
];

export default function SearchLocationScreen() {
  const router = useRouter();
  const { field, from, to, userName } = useLocalSearchParams<{
    field?: string;
    from?: string;
    to?: string;
    userName?: string;
  }>();
  const { moderateScale, moderateVerticalScale, wp } = useResponsive();
  const selectedField = field === "to" ? "to" : "from";

  const selectLocation = (value: string) => {
    router.replace({
      pathname: "/home",
      params: {
        from: selectedField === "from" ? value : from,
        to: selectedField === "to" ? value : to,
        userName,
      },
    } as never);
  };

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.header,
          { paddingHorizontal: wp(5), paddingTop: moderateVerticalScale(18) },
        ]}
      >
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
        <View style={styles.headerText}>
          <Text style={[styles.title, { fontSize: moderateScale(21) }]}>
            Select {selectedField === "from" ? "From" : "To"}
          </Text>
          <Text style={styles.subtitle}>Choose a stop to plan your route</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: wp(5),
            paddingBottom: moderateVerticalScale(30),
          },
        ]}
      >
        {LOCATIONS.map((location) => (
          <Pressable
            key={location}
            style={styles.locationRow}
            onPress={() => selectLocation(location)}
            accessibilityLabel={`Select ${location}`}
          >
            <View style={styles.locationIcon}>
              <Ionicons
                name="location-outline"
                size={moderateScale(20)}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.locationText}>{location}</Text>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(18)}
              color={COLORS.textSecondary}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const COLORS = {
  primary: "#008383",
  textDark: "#123B3A",
  textSecondary: "#687474",
  lightTeal: "#EAF5F4",
  border: "#E1EDEC",
  white: "#FFFFFF",
};
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { marginLeft: 10 },
  title: { fontFamily: "Poppins-SemiBold", color: COLORS.textDark },
  subtitle: {
    fontFamily: "Poppins-Regular",
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  content: { paddingTop: 16 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.lightTeal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationText: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: COLORS.textDark,
  },
});
