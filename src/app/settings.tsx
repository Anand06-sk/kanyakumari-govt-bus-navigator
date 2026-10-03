import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  arrow?: boolean;
};

export default function Settings() {
  // SETTINGS STATE
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [offlineData, setOfflineData] = useState(false);
  const [language, setLanguage] = useState("English");

  // THEME
  const colors = {
    green: "#087F6B",
    greenLight: "#E8F5F2",
    purple: "#7043A8",
    background: darkMode ? "#101717" : "#F6F8F8",
    card: darkMode ? "#182020" : "#FFFFFF",
    text: darkMode ? "#FFFFFF" : "#273333",
    secondary: darkMode ? "#AAB8B8" : "#929999",
    border: darkMode ? "#2A3838" : "#E8EEEE",
  };

  // LANGUAGE
  const changeLanguage = () => {
    Alert.alert("Select Language", "", [
      {
        text: "English",
        onPress: () => setLanguage("English"),
      },
      {
        text: "Kannada",
        onPress: () => setLanguage("Kannada"),
      },
      {
        text: "Hindi",
        onPress: () => setLanguage("Hindi"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  // PROFILE
  const openProfile = () => {
    router.push("/profile");
  };

  // PRIVACY & SECURITY
  const privacySecurity = () => {
    Alert.alert(
      "Privacy & Security",
      "Manage password and privacy",
      [
        {
          text: "Change Password",
          onPress: () =>
            Alert.alert(
              "Change Password",
              "Password changing will be available here."
            ),
        },
        {
          text: "Privacy Settings",
          onPress: () =>
            Alert.alert(
              "Privacy Settings",
              "Privacy settings will be available here."
            ),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // LOCATION SERVICES
  const toggleLocation = (value: boolean) => {
    setLocationServices(value);

    if (value) {
      Alert.alert(
        "Location Services",
        "Location will be used to find nearby buses."
      );
    } else {
      Alert.alert(
        "Location Services",
        "Location services have been turned off."
      );
    }
  };

  // CLEAR SEARCH HISTORY
  const clearSearchHistory = () => {
    Alert.alert(
      "Clear Search History",
      "Are you sure you want to delete all recent searches?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Search History Cleared",
              "All recent searches have been deleted."
            ),
        },
      ]
    );
  };

  // HELP & SUPPORT
  const helpSupport = () => {
    Alert.alert(
      "Help & Support",
      "How can we help you?",
      [
        {
          text: "FAQs",
          onPress: () =>
            Alert.alert(
              "FAQs",
              "Frequently asked questions will be available here."
            ),
        },
        {
          text: "Contact Support",
          onPress: () =>
            Alert.alert(
              "Contact Support",
              "Support: support@govtbus.com"
            ),
        },
        {
          text: "Report a Problem",
          onPress: () =>
            Alert.alert(
              "Report a Problem",
              "You can report an issue with the app here."
            ),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // TERMS & PRIVACY
  const termsPrivacy = () => {
    Alert.alert(
      "Terms & Privacy",
      "Terms of service and privacy information will be available here."
    );
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
            {
              backgroundColor: colors.greenLight,
            },
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
              {
                color: colors.text,
              },
            ]}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={[
                styles.menuSubtitle,
                {
                  color: colors.secondary,
                },
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
  const SectionTitle = ({
    title,
  }: {
    title: string;
  }) => (
    <Text
      style={[
        styles.sectionTitle,
        {
          color: colors.purple,
        },
      ]}
    >
      {title}
    </Text>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
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
          {
            backgroundColor: colors.green,
          },
        ]}
      >
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

        <Text style={styles.headerTitle}>
          Settings
        </Text>

        <View style={styles.headerSide} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* =================================================
            ACCOUNT
        ================================================= */}

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
          <MenuItem
            icon="person-outline"
            title="Profile"
            subtitle="Manage your personal information"
            onPress={openProfile}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          <MenuItem
            icon="lock-closed-outline"
            title="Privacy & Security"
            subtitle="Manage password and privacy"
            onPress={privacySecurity}
          />
        </View>

        {/* =================================================
            PREFERENCES
        ================================================= */}

        <SectionTitle title="PREFERENCES" />

        <View
          style={[
            styles.menuCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* LANGUAGE */}

          <MenuItem
            icon="language-outline"
            title="Language"
            subtitle={language}
            onPress={changeLanguage}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          {/* NOTIFICATIONS */}

          <View style={styles.menuItem}>
            <View
              style={[
                styles.menuIcon,
                {
                  backgroundColor: colors.greenLight,
                },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={colors.green}
              />
            </View>

            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Notifications
              </Text>

              <Text
                style={[
                  styles.menuSubtitle,
                  {
                    color: colors.secondary,
                  },
                ]}
              >
                Receive bus and booking updates
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: "#D5DCDC",
                true: "#8ACFC3",
              }}
              thumbColor={
                notifications
                  ? colors.green
                  : "#FFFFFF"
              }
            />
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          {/* DARK MODE */}

          <View style={styles.menuItem}>
            <View
              style={[
                styles.menuIcon,
                {
                  backgroundColor: colors.greenLight,
                },
              ]}
            >
              <Ionicons
                name="moon-outline"
                size={21}
                color={colors.green}
              />
            </View>

            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Dark Mode
              </Text>

              <Text
                style={[
                  styles.menuSubtitle,
                  {
                    color: colors.secondary,
                  },
                ]}
              >
                Change app appearance
              </Text>
            </View>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: "#D5DCDC",
                true: "#8ACFC3",
              }}
              thumbColor={
                darkMode
                  ? colors.green
                  : "#FFFFFF"
              }
            />
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          {/* LOCATION SERVICES */}

          <View style={styles.menuItem}>
            <View
              style={[
                styles.menuIcon,
                {
                  backgroundColor: colors.greenLight,
                },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={21}
                color={colors.green}
              />
            </View>

            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Location Services
              </Text>

              <Text
                style={[
                  styles.menuSubtitle,
                  {
                    color: colors.secondary,
                  },
                ]}
              >
                Use location for nearby buses
              </Text>
            </View>

            <Switch
              value={locationServices}
              onValueChange={toggleLocation}
              trackColor={{
                false: "#D5DCDC",
                true: "#8ACFC3",
              }}
              thumbColor={
                locationServices
                  ? colors.green
                  : "#FFFFFF"
              }
            />
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          {/* OFFLINE DATA */}

          <View style={styles.menuItem}>
            <View
              style={[
                styles.menuIcon,
                {
                  backgroundColor: colors.greenLight,
                },
              ]}
            >
              <Ionicons
                name="cloud-download-outline"
                size={21}
                color={colors.green}
              />
            </View>

            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Offline Data
              </Text>

              <Text
                style={[
                  styles.menuSubtitle,
                  {
                    color: colors.secondary,
                  },
                ]}
              >
                Save bus information for offline use
              </Text>
            </View>

            <Switch
              value={offlineData}
              onValueChange={setOfflineData}
              trackColor={{
                false: "#D5DCDC",
                true: "#8ACFC3",
              }}
              thumbColor={
                offlineData
                  ? colors.green
                  : "#FFFFFF"
              }
            />
          </View>
        </View>

        {/* =================================================
            DATA & HISTORY
        ================================================= */}

        <SectionTitle title="DATA & HISTORY" />

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
            icon="trash-outline"
            title="Clear Search History"
            subtitle="Delete all recent searches"
            onPress={clearSearchHistory}
          />
        </View>

        {/* =================================================
            SUPPORT
        ================================================= */}

        <SectionTitle title="SUPPORT" />

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
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="FAQs and contact support"
            onPress={helpSupport}
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          <MenuItem
            icon="document-text-outline"
            title="Terms & Privacy"
            subtitle="Terms of service and privacy"
            onPress={termsPrivacy}
          />
        </View>

        {/* =================================================
            FOOTER
        ================================================= */}

        <Text
          style={[
            styles.footer,
            {
              color: colors.secondary,
            },
          ]}
        >
          Govt Bus{"\n"}
          Version 1.0.0{"\n"}
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
    minHeight: 68,
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

  // DIVIDER

  divider: {
    height: 1,
    marginLeft: 70,
  },

  // FOOTER

  footer: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 30,
    lineHeight: 20,
  },
});