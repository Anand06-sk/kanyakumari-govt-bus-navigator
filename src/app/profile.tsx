import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type User = {
  name: string;
  email: string;
  phone: string;
  location: string;
  verified: boolean;
};

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  arrow?: boolean;
};

export default function Profile() {
  // USER DATA
  const [user] = useState<User>({
    name: "Arun Kumar",
    email: "arunkumar@gmail.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    verified: true,
  });

  // SEARCH HISTORY
  const [searchHistory] = useState([
    "Bengaluru → Mysuru",
    "Bengaluru → Chennai",
    "Mysuru → Bengaluru",
    "Bengaluru → Mangaluru",
  ]);

  // FAVORITES
  const favorites = [
    "KSRTC Express",
    "KSRTC Airavat",
    "KSRTC Rajahamsa",
  ];

  // THEME
  const colors = {
    green: "#087F6B",
    greenLight: "#E8F5F2",
    purple: "#7043A8",
    background: "#F6F8F8",
    card: "#FFFFFF",
    text: "#273333",
    secondary: "#929999",
    border: "#E8EEEE",
    red: "#E04B4B",
  };

  // MENU ITEM
  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    arrow = true,
  }: MenuItemProps) => {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.menuIcon,
            { backgroundColor: colors.greenLight },
          ]}
        >
          <Ionicons
            name={icon}
            size={21}
            color={colors.green}
          />
        </View>

        <View style={styles.menuContent}>
          <Text
            style={[
              styles.menuTitle,
              { color: colors.text },
            ]}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={[
                styles.menuSubtitle,
                { color: colors.secondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {arrow && (
          <Ionicons
            name="chevron-forward"
            size={19}
            color="#A5AAAA"
          />
        )}
      </TouchableOpacity>
    );
  };

  // SECTION TITLE
  const SectionTitle = ({ title }: { title: string }) => (
    <Text
      style={[
        styles.sectionTitle,
        { color: colors.purple },
      ]}
    >
      {title}
    </Text>
  );

  // LOGOUT
  const logout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Logged Out",
              "You have been logged out."
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <StatusBar
        backgroundColor={colors.green}
        barStyle="light-content"
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.green },
        ]}
      >
        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.headerTitle}>
          My Profile
        </Text>

        {/* SETTINGS BUTTON */}
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => router.push("/settings")}
        >
          <Ionicons
            name="settings-outline"
            size={23}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* PROFILE CARD */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.green },
          ]}
        >
          {/* AVATAR */}
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={44}
              color={colors.green}
            />
          </View>

          {/* USER INFORMATION */}
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {user.name}
            </Text>

            <Text style={styles.email}>
              {user.email}
            </Text>

            {user.verified && (
              <View style={styles.verifiedRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color="#FFFFFF"
                />

                <Text style={styles.verifiedText}>
                  Verified User
                </Text>
              </View>
            )}
          </View>

          {/* EDIT */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              Alert.alert(
                "Edit Profile",
                "Profile editing screen"
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* USER DETAILS */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* PHONE */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="call-outline"
                size={19}
                color={colors.green}
              />
            </View>

            <View>
              <Text
                style={[
                  styles.detailLabel,
                  { color: colors.secondary },
                ]}
              >
                Phone
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  { color: colors.text },
                ]}
              >
                {user.phone}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.detailDivider,
              { backgroundColor: colors.border },
            ]}
          />

          {/* LOCATION */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="location-outline"
                size={19}
                color={colors.green}
              />
            </View>

            <View>
              <Text
                style={[
                  styles.detailLabel,
                  { color: colors.secondary },
                ]}
              >
                Location
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  { color: colors.text },
                ]}
              >
                {user.location}
              </Text>
            </View>
          </View>
        </View>

        {/* ACCOUNT */}
        <SectionTitle title="ACCOUNT" />

        <View
          style={[
            styles.menuCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* FAVORITES */}
          <MenuItem
            icon="heart-outline"
            title="Favorites"
            subtitle={`${favorites.length} saved buses`}
            onPress={() =>
              Alert.alert(
                "Favorites",
                favorites.join("\n")
              )
            }
          />

          <View style={styles.divider} />

          {/* SEARCH HISTORY */}
          <MenuItem
            icon="time-outline"
            title="Search History"
            subtitle={`${searchHistory.length} recent searches`}
            onPress={() => router.push("/history")}
          />

          <View style={styles.divider} />

          {/* REPORTS */}
          <MenuItem
            icon="document-text-outline"
            title="Reports"
            subtitle="View submitted reports"
            onPress={() => router.push("/report")}
          />
        </View>

        {/* APP */}
        <SectionTitle title="APP" />

        <View
          style={[
            styles.menuCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <MenuItem
            icon="information-circle-outline"
            title="About App"
            subtitle="Govt Bus • Version 1.0.0"
            onPress={() =>
              Alert.alert(
                "Govt Bus",
                "Reach with Confidence\n\nVersion 1.0.0"
              )
            }
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.red}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <Text style={styles.footer}>
          Reach with Confidence
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  // HEADER
  // Same header height as Settings page
  header: {
    height: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingTop: 10,
  },

  headerSide: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },

  // PAGE
  container: {
    padding: 18,
    paddingBottom: 45,
  },

  // PROFILE CARD
  profileCard: {
    borderRadius: 20,
    padding: 19,
    flexDirection: "row",
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#D5F1EB",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  email: {
    color: "#D7F0EA",
    fontSize: 13,
    marginTop: 4,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  verifiedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  // DETAILS
  detailsCard: {
    marginTop: 15,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 5,
  },

  detailRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E8F5F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  detailLabel: {
    fontSize: 11,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },

  detailDivider: {
    height: 1,
    marginLeft: 62,
  },

  // SECTION
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 9,
  },

  // MENU CARD
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },

  menuItem: {
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  menuSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#E8EEEE",
    marginLeft: 70,
  },

  // LOGOUT
  logoutButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FFF3F3",
    borderWidth: 1,
    borderColor: "#FFD7D7",
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: "#E04B4B",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },

  // FOOTER
  footer: {
    textAlign: "center",
    color: "#9BA5A5",
    fontSize: 12,
    marginTop: 24,
  },
});