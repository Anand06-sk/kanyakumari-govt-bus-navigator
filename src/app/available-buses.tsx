import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useResponsive } from "../../utils/responsive";
import { BUS_CATEGORIES, SAMPLE_BUS_SERVICES } from "../data/busData";

const COLORS = {
  primary: "#008383",
  textDark: "#123B3A",
  textSecondary: "#687474",
  lightTeal: "#EAF5F4",
  border: "#E1EDEC",
  white: "#FFFFFF",
  pale: "#F7FAFA",
};

export default function AvailableBusesScreen() {
  const router = useRouter();
  const { from = "Selected stop", to = "Selected destination" } =
    useLocalSearchParams<{ from?: string; to?: string }>();
  const { moderateScale, moderateVerticalScale, wp } = useResponsive();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredServices = useMemo(
    () =>
      SAMPLE_BUS_SERVICES.filter((service) => {
        const matchesCategory =
          activeCategory === "all" || service.categoryId === activeCategory;
        const searchable =
          `${service.serviceName} ${service.busNumber ?? ""} ${service.tags.join(" ")}`.toLowerCase();
        return (
          matchesCategory && searchable.includes(query.toLowerCase().trim())
        );
      }),
    [activeCategory, query],
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: wp(5),
            paddingBottom: moderateVerticalScale(30),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
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
            Available Buses
          </Text>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.routeSummary}>
          <View style={styles.routePoint}>
            <Text style={styles.routeLabel}>From</Text>
            <Text style={styles.routeValue} numberOfLines={1}>
              {from}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="arrow-right"
            size={moderateScale(20)}
            color={COLORS.primary}
          />
          <View style={styles.routePoint}>
            <Text style={styles.routeLabel}>To</Text>
            <Text style={styles.routeValue} numberOfLines={1}>
              {to}
            </Text>
          </View>
        </View>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={moderateScale(18)}
            color={COLORS.textSecondary}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search service or bus number"
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Pressable
            onPress={() => setActiveCategory("all")}
            style={[styles.chip, activeCategory === "all" && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                activeCategory === "all" && styles.chipTextActive,
              ]}
            >
              All
            </Text>
          </Pressable>
          {BUS_CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setActiveCategory(category.id)}
              style={[
                styles.chip,
                activeCategory === category.id && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  activeCategory === category.id && styles.chipTextActive,
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.sectionTitle}>Service categories</Text>
        {filteredServices.length === 0 ? (
          <Text style={styles.emptyText}>No matching services found.</Text>
        ) : (
          filteredServices.map((service) => {
            const category = BUS_CATEGORIES.find(
              (item) => item.id === service.categoryId,
            );
            return (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <Ionicons
                    name={
                      (category?.icon ??
                        "bus-outline") as keyof typeof Ionicons.glyphMap
                    }
                    size={moderateScale(22)}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.serviceBody}>
                  <View style={styles.serviceHeading}>
                    <Text style={styles.categoryName}>{category?.name}</Text>
                    <Text style={styles.sampleLabel}>SAMPLE</Text>
                  </View>
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                  <Text style={styles.availability}>
                    {service.availability}
                  </Text>
                  <View style={styles.tagRow}>
                    {service.tags.map((tag) => (
                      <Text key={tag} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  content: { paddingTop: 16 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: "Poppins-SemiBold", color: COLORS.textDark },
  routeSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.lightTeal,
    borderRadius: 16,
    padding: 16,
  },
  routePoint: { flex: 1 },
  routeLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  routeValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 3,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 13,
    marginTop: 18,
    minHeight: 50,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: COLORS.textDark,
    marginLeft: 8,
  },
  chips: { paddingVertical: 16, gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chipTextActive: { color: COLORS.white },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: COLORS.textDark,
    marginBottom: 10,
  },
  serviceCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: COLORS.lightTeal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  serviceBody: { flex: 1 },
  serviceHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: COLORS.textDark,
  },
  sampleLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 9,
    color: COLORS.primary,
    backgroundColor: COLORS.lightTeal,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  serviceName: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  availability: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: COLORS.textDark,
    marginTop: 8,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: COLORS.primary,
    backgroundColor: COLORS.pale,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
  },
  emptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: COLORS.textSecondary,
    paddingVertical: 18,
  },
});
