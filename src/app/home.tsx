// ==============================
// IMPORTS
// ==============================
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useResponsive } from "../../utils/responsive";

// ==============================
// TYPES / INTERFACES
// ==============================

/** A single tourist destination card shown in the "Explore Kanyakumari" section. */
interface TouristPlace {
  id: string;
  name: string;
  imageUrl: string;
  distanceLabel: string;
}

/** A single quick-access action shown below the search card. */
interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/** A single tab item in the bottom navigation bar. */
interface NavTab {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

// ==============================
// CONSTANTS
// ==============================

/** Brand colors — DO NOT change; must match Splash / Onboarding / Welcome screens. */
const COLORS = {
  primary: "#008383",
  primaryDark: "#006D6D",
  textDark: "#123B3A",
  textSecondary: "#687474",
  lightTealBg: "#EAF5F4",
  white: "#FFFFFF",
  border: "#E1EDEC",
  shadow: "#0F2E2D",
};

/** Static list of quick-access actions. Replace icons/labels if product needs change. */
const GUEST_QUICK_ACTIONS: QuickAction[] = [
  { id: "nearby", label: "Nearby Stops", icon: "location-outline" },
  { id: "popular", label: "Popular Routes", icon: "trending-up-outline" },
  { id: "help", label: "Help & Report", icon: "help-circle-outline" },
];

const MEMBER_QUICK_ACTIONS: QuickAction[] = [
  ...GUEST_QUICK_ACTIONS.slice(0, 1),
  { id: "favorites", label: "Favorites", icon: "heart-outline" },
  { id: "recent", label: "Recent Searches", icon: "time-outline" },
  GUEST_QUICK_ACTIONS[2],
];

/** Static list of Kanyakumari tourist destinations for the horizontal explore rail. */
const TOURIST_PLACES: TouristPlace[] = [
  {
    id: "kanyakumari",
    name: "Kanyakumari",
    imageUrl:
      "https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=600&q=80",
    distanceLabel: "Land's End",
  },
  {
    id: "vivekananda-rock",
    name: "Vivekananda Rock Memorial",
    imageUrl:
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&q=80",
    distanceLabel: "Ferry point",
  },
  {
    id: "thiruvalluvar-statue",
    name: "Thiruvalluvar Statue",
    imageUrl:
      "https://images.unsplash.com/photo-1580889240911-378a3f0ec4c3?w=600&q=80",
    distanceLabel: "Sea front",
  },
  {
    id: "suchindram",
    name: "Suchindram",
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
    distanceLabel: "Temple town",
  },
  {
    id: "padmanabhapuram",
    name: "Padmanabhapuram Palace",
    imageUrl:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
    distanceLabel: "Heritage site",
  },
];

/** Planned routes are isolated so teammate-owned screens can be connected later. */
const HOME_ROUTES = {
  search: "/search",
  availableBuses: "/available-buses",
  routes: "/routes",
  touristPlaces: "/tourist-places",
  nearbyStops: "/nearby-stops",
  help: "/help",
} as const;

/** Bottom navigation tab configuration. */
const NAV_TABS: NavTab[] = [
  { id: "home", label: "Home", icon: "home-outline", activeIcon: "home" },
  {
    id: "routes",
    label: "Routes",
    icon: "map-outline",
    activeIcon: "map",
  },
  {
    id: "explore",
    label: "Explore",
    icon: "compass-outline",
    activeIcon: "compass",
  },
  {
    id: "help",
    label: "Help",
    icon: "help-circle-outline",
    activeIcon: "help-circle",
  },
];

const MEMBER_NAV_TABS: NavTab[] = [
  NAV_TABS[0],
  {
    id: "favorites",
    label: "Favorites",
    icon: "heart-outline",
    activeIcon: "heart",
  },
  NAV_TABS[2],
  NAV_TABS[1],
  NAV_TABS[3],
];

// ==============================
// HELPER FUNCTIONS
// ==============================

/**
 * Returns a greeting message + emoji based on the current device time.
 * Ranges:
 *  05:00–11:59 -> Good morning
 *  12:00–16:59 -> Good afternoon
 *  17:00–20:59 -> Good evening
 *  21:00–04:59 -> Good night
 */
function getGreetingForCurrentTime(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning! 👋";
  }
  if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon! 👋";
  }
  if (currentHour >= 17 && currentHour < 21) {
    return "Good evening! 👋";
  }
  return "Greeting! 👋";
}

// ==============================
// COMPONENT
// ==============================
export default function HomeScreen() {
  const { moderateScale, moderateVerticalScale, wp, isTablet } =
    useResponsive();
  const router = useRouter();
  const { from, to, userName } = useLocalSearchParams<{
    from?: string;
    to?: string;
    userName?: string;
  }>();
  const isAuthenticated = Boolean(userName);

  // ------------------------------
  // State: search fields + swap animation trigger + greeting text
  // ------------------------------
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [greeting, setGreeting] = useState<string>(getGreetingForCurrentTime());
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isGuestMenuVisible, setGuestMenuVisible] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const recentSearchesY = useRef<number>(0);

  const quickActions = isAuthenticated
    ? MEMBER_QUICK_ACTIONS
    : GUEST_QUICK_ACTIONS;
  const navTabs = isAuthenticated ? MEMBER_NAV_TABS : NAV_TABS;

  // Recompute greeting whenever the screen regains focus (e.g. returning from another tab).
  useFocusEffect(
    useCallback(() => {
      setGreeting(getGreetingForCurrentTime());
    }, []),
  );

  useEffect(() => {
    if (from !== undefined) setFromLocation(from);
    if (to !== undefined) setToLocation(to);
  }, [from, to]);

  // Swap the "From" and "To" fields.
  const handleSwapLocations = useCallback(() => {
    setFromLocation((prevFrom) => {
      setToLocation(prevFrom);
      return toLocation;
    });
  }, [toLocation]);

  const handleSearchBuses = useCallback(() => {
    router.push({
      pathname: HOME_ROUTES.availableBuses,
      params: { from: fromLocation, to: toLocation },
    } as never);
  }, [fromLocation, router, toLocation]);

  const handleLocationPress = useCallback(
    (field: "from" | "to") => {
      router.push({
        pathname: HOME_ROUTES.search,
        params: {
          field,
          from: fromLocation,
          to: toLocation,
          userName,
        },
      } as never);
    },
    [fromLocation, router, toLocation, userName],
  );

  const handleQuickActionPress = useCallback(
    (actionId: string) => {
      if (actionId === "nearby") {
        void (async () => {
          const permission = await Location.requestForegroundPermissionsAsync();
          if (permission.status === Location.PermissionStatus.GRANTED) {
            Alert.alert("Nearby stops", "Nearby stops will be available soon.");
          } else {
            Alert.alert(
              "Location permission needed",
              "Allow location access to find stops near you.",
            );
          }
        })();
        return;
      }

      if (actionId === "recent") {
        if (!isAuthenticated) return;

        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({
            y: recentSearchesY.current,
            animated: true,
          });
        });
        return;
      }

      const routeByAction: Record<string, string> = {
        nearby: HOME_ROUTES.nearbyStops,
        popular: HOME_ROUTES.routes,
        favorites: "/favorites",
        help: HOME_ROUTES.help,
      };
      const route = routeByAction[actionId];
      if (route) router.push(route as never);
    },
    [isAuthenticated, router],
  );

  const handleTouristPlacesPress = useCallback(() => {
    router.push(HOME_ROUTES.touristPlaces as never);
  }, [router]);

  const handleNavPress = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      const routeByTab: Record<string, string> = {
        favorites: "/favorites",
        routes: "/routes",
        explore: HOME_ROUTES.touristPlaces,
        help: HOME_ROUTES.help,
      };
      const route = routeByTab[tabId];
      if (route) router.push(route as never);
    },
    [router],
  );

  // Card width for the horizontally scrolling tourist places rail.
  const touristCardWidth = useMemo(
    () => (isTablet ? wp(38) : wp(62)),
    [isTablet, wp],
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: wp(5) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================== */}
        {/* HEADER */}
        {/* ============================== */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextGroup}>
            <Text
              style={[styles.greetingText, { fontSize: moderateScale(20) }]}
            >
              {isAuthenticated ? `${greeting} ${userName}` : greeting}
            </Text>
            <Text
              style={[styles.subtitleText, { fontSize: moderateScale(14) }]}
            >
              Where do you want to go?
            </Text>
          </View>
          {/* PROFILE NAVIGATION */}

          <TouchableOpacity
            style={styles.profileIconButton}
            activeOpacity={0.7}
            onPress={() => {
              if (isAuthenticated) {
                router.push("/profile" as never);
              } else {
                setGuestMenuVisible(true);
              }
            }}
            accessibilityLabel={
              isAuthenticated ? "Open profile" : "Open guest account menu"
            }
          >
            <Ionicons
              name="person-circle-outline"
              size={moderateScale(30)}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* ============================== */}
        {/* BUS SEARCH */}
        {/* ============================== */}
        <View
          style={[
            styles.searchCard,
            {
              padding: moderateScale(18),
              marginTop: moderateVerticalScale(20),
            },
          ]}
        >
          {/* FROM field */}
          <TouchableOpacity
            style={styles.searchFieldRow}
            activeOpacity={0.7}
            onPress={() => handleLocationPress("from")}
            accessibilityLabel="Select starting point"
          >
            <View style={styles.searchIconWrap}>
              <Ionicons
                name="radio-button-on-outline"
                size={moderateScale(18)}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.searchFieldTextGroup}>
              <Text style={styles.searchFieldLabel}>From</Text>
              <Text
                style={[
                  styles.searchFieldValue,
                  !fromLocation && styles.searchFieldPlaceholder,
                ]}
                numberOfLines={1}
              >
                {fromLocation || "Select starting point"}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(16)}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {/* Divider with swap button */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapLocations}
              activeOpacity={0.7}
              accessibilityLabel="Swap starting point and destination"
            >
              <MaterialCommunityIcons
                name="swap-vertical"
                size={moderateScale(18)}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <View style={styles.dividerLine} />
          </View>

          {/* TO field */}
          <TouchableOpacity
            style={styles.searchFieldRow}
            activeOpacity={0.7}
            onPress={() => handleLocationPress("to")}
            accessibilityLabel="Select destination"
          >
            <View style={styles.searchIconWrap}>
              <Ionicons
                name="location-outline"
                size={moderateScale(18)}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.searchFieldTextGroup}>
              <Text style={styles.searchFieldLabel}>To</Text>
              <Text
                style={[
                  styles.searchFieldValue,
                  !toLocation && styles.searchFieldPlaceholder,
                ]}
                numberOfLines={1}
              >
                {toLocation || "Select destination"}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(16)}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {/* Search button */}
          <TouchableOpacity
            style={[
              styles.searchButton,
              { marginTop: moderateVerticalScale(16) },
            ]}
            onPress={handleSearchBuses}
            activeOpacity={0.85}
            accessibilityLabel="Search buses"
          >
            <Ionicons
              name="search"
              size={moderateScale(18)}
              color={COLORS.white}
              style={{ marginRight: moderateScale(8) }}
            />
            <Text style={styles.searchButtonText}>Search Buses</Text>
          </TouchableOpacity>
        </View>

        {/* ============================== */}
        {/* QUICK ACTIONS */}
        {/* ============================== */}
        <View
          style={[
            styles.quickActionsRow,
            { marginTop: moderateVerticalScale(22) },
          ]}
        >
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionItem}
              activeOpacity={0.7}
              onPress={() => handleQuickActionPress(action.id)}
              accessibilityLabel={action.label}
            >
              <View style={styles.quickActionIconCircle}>
                <Ionicons
                  name={action.icon}
                  size={moderateScale(20)}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.quickActionLabel} numberOfLines={2}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ============================== */}
        {/* TOURIST PLACES */}
        {/* ============================== */}
        <View style={{ marginTop: moderateVerticalScale(26) }}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Explore Kanyakumari</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleTouristPlacesPress}
              accessibilityLabel="See all tourist places"
            >
              <Text style={styles.sectionSeeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: wp(5) }}
            style={{ marginTop: moderateVerticalScale(12) }}
          >
            {TOURIST_PLACES.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={[
                  styles.touristCard,
                  { width: touristCardWidth, marginRight: moderateScale(14) },
                ]}
                activeOpacity={0.85}
                onPress={handleTouristPlacesPress}
                accessibilityLabel={`Explore ${place.name}`}
              >
                <Image
                  source={{ uri: place.imageUrl }}
                  style={styles.touristCardImage}
                  resizeMode="cover"
                />
                <View style={styles.touristCardOverlay} />
                <View style={styles.touristCardTextWrap}>
                  <Text style={styles.touristCardTitle} numberOfLines={1}>
                    {place.name}
                  </Text>
                  <View style={styles.touristCardMetaRow}>
                    <Ionicons
                      name="bus-outline"
                      size={moderateScale(12)}
                      color={COLORS.white}
                    />
                    <Text style={styles.touristCardMetaText}>
                      {place.distanceLabel}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {isAuthenticated && (
          <View
            style={[
              styles.recentSearchesSection,
              { marginTop: moderateVerticalScale(26) },
            ]}
            onLayout={(event) => {
              recentSearchesY.current = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
            <Text style={styles.recentSearchesEmptyText}>
              You haven’t searched for any routes yet.
            </Text>
          </View>
        )}

        {/* ============================== */}
        {/* KNOW BEFORE YOU GO */}
        {/* ============================== */}
        <View
          style={[styles.infoCard, { marginTop: moderateVerticalScale(26) }]}
        >
          <View style={styles.infoCardIconCircle}>
            <Ionicons
              name="bus-outline"
              size={moderateScale(22)}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.infoCardTextGroup}>
            <Text style={styles.infoCardTitle}>Know Before You Go</Text>
            <Text style={styles.infoCardDescription}>
              Know your route before you go. Check intermediate stops,
              approximate fare and travel time before boarding.
            </Text>
          </View>
        </View>

        {/* ============================== */}
        {/* ACCOUNT PROMOTION */}
        {/* ============================== */}
        <View
          style={[
            styles.accountPromoCard,
            { marginTop: moderateVerticalScale(16) },
          ]}
        >
          <View style={styles.accountPromoAccent} />
          <View style={styles.accountPromoContent}>
            <View style={styles.accountPromoIconCircle}>
              <Ionicons
                name="sparkles-outline"
                size={moderateScale(21)}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.accountPromoEyebrow}>
              YOUR TRAVEL COMPANION
            </Text>
            <Text style={styles.accountPromoTitle}>
              Make your journeys easier
            </Text>
            <Text style={styles.accountPromoDescription}>
              {isAuthenticated
                ? "Your saved routes and recent searches will appear here."
                : "Create an account to save favorite routes, view search history and manage your profile."}
            </Text>
            {!isAuthenticated && (
              <View style={styles.accountPromoActions}>
                <TouchableOpacity
                  style={styles.accountPrimaryButton}
                  activeOpacity={0.85}
                  onPress={() => router.push("/login")}
                  accessibilityLabel="Login"
                >
                  <Text style={styles.accountPrimaryButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.accountSecondaryButton}
                  activeOpacity={0.85}
                  onPress={() => router.push("/signup")}
                  accessibilityLabel="Sign Up"
                >
                  <Text style={styles.accountSecondaryButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Bottom spacer so content clears the bottom nav bar */}
        <View style={{ height: moderateVerticalScale(90) }} />
      </ScrollView>

      <Modal
        visible={isGuestMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGuestMenuVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setGuestMenuVisible(false)}
            accessibilityLabel="Close guest account menu"
          />
          <View style={styles.guestMenuCard}>
            <View style={styles.guestMenuHeader}>
              <View style={styles.guestAvatar}>
                <Ionicons
                  name="person"
                  size={moderateScale(21)}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.guestMenuHeaderText}>
                <Text style={styles.guestMenuTitle}>Guest Account</Text>
                <Text style={styles.guestMenuSubtitle}>Not logged in</Text>
              </View>
              <TouchableOpacity
                onPress={() => setGuestMenuVisible(false)}
                style={styles.closeMenuButton}
                accessibilityLabel="Close account menu"
              >
                <Ionicons
                  name="close"
                  size={moderateScale(20)}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.guestMenuDivider} />
            <TouchableOpacity
              style={styles.guestMenuAction}
              onPress={() => {
                setGuestMenuVisible(false);
                router.push("/login");
              }}
              accessibilityLabel="Login"
            >
              <Ionicons
                name="lock-closed-outline"
                size={moderateScale(20)}
                color={COLORS.primary}
              />
              <Text style={styles.guestMenuActionText}>Login</Text>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(17)}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.guestMenuAction}
              onPress={() => {
                setGuestMenuVisible(false);
                router.push("/signup");
              }}
              accessibilityLabel="Sign Up"
            >
              <Ionicons
                name="create-outline"
                size={moderateScale(20)}
                color={COLORS.primary}
              />
              <Text style={styles.guestMenuActionText}>Sign Up</Text>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(17)}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
            <View style={styles.guestMenuDivider} />
            <TouchableOpacity
              style={styles.guestMenuAction}
              onPress={() => setGuestMenuVisible(false)}
              accessibilityLabel="Open settings"
            >
              <Ionicons
                name="settings-outline"
                size={moderateScale(20)}
                color={COLORS.textSecondary}
              />
              <Text style={styles.guestMenuActionText}>Settings</Text>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(17)}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.guestMenuAction}
              onPress={() => setGuestMenuVisible(false)}
              accessibilityLabel="Open help and support"
            >
              <Ionicons
                name="help-circle-outline"
                size={moderateScale(20)}
                color={COLORS.textSecondary}
              />
              <Text style={styles.guestMenuActionText}>Help &amp; Support</Text>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(17)}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================== */}
      {/* BOTTOM NAVIGATION */}
      {/* ============================== */}
      <View
        style={[
          styles.bottomNav,
          {
            paddingBottom: moderateVerticalScale(
              Platform.OS === "ios" ? 22 : 12,
            ),
          },
        ]}
      >
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.navTabItem}
              activeOpacity={0.7}
              onPress={() => handleNavPress(tab.id)}
              accessibilityLabel={tab.label}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={moderateScale(22)}
                color={isActive ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.navTabLabel,
                  isActive && styles.navTabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },

  // ---- Header ----
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: 12,
  },
  greetingText: {
    fontFamily: "Poppins-SemiBold",
    color: COLORS.textDark,
  },
  subtitleText: {
    fontFamily: "Poppins-Regular",
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  profileIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightTealBg,
  },

  // ---- Search card ----
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  searchFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  searchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.lightTealBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  searchFieldTextGroup: {
    flex: 1,
  },
  searchFieldLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  searchFieldValue: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: COLORS.textDark,
    marginTop: 2,
  },
  searchFieldPlaceholder: {
    color: COLORS.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  swapButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  searchButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: COLORS.white,
  },

  // ---- Quick actions ----
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionItem: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.lightTealBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickActionLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: COLORS.textDark,
    textAlign: "center",
  },

  // ---- Section headers ----
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: COLORS.textDark,
  },
  sectionSeeAll: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: COLORS.primary,
  },

  // ---- Tourist place cards ----
  touristCard: {
    height: 150,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: COLORS.lightTealBg,
  },
  touristCardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  touristCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 59, 58, 0.35)",
  },
  touristCardTextWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
  },
  touristCardTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
  touristCardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  touristCardMetaText: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: COLORS.white,
    marginLeft: 4,
  },

  // ---- Recent searches section ----
  recentSearchesSection: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.lightTealBg,
  },
  recentSearchesTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: COLORS.textDark,
  },
  recentSearchesEmptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },

  // ---- Guest information and account promotion ----
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.lightTealBg,
  },
  infoCardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoCardTextGroup: {
    flex: 1,
  },
  infoCardTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: COLORS.textDark,
  },
  infoCardDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  accountPromoCard: {
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: COLORS.textDark,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },
  accountPromoAccent: {
    height: 4,
    backgroundColor: COLORS.primary,
  },
  accountPromoContent: {
    padding: 18,
  },
  accountPromoIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  accountPromoEyebrow: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    letterSpacing: 1,
    color: "#9BD7D2",
  },
  accountPromoTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.white,
    marginTop: 4,
  },
  accountPromoDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#C9DDDB",
    marginTop: 6,
  },
  accountPromoActions: {
    flexDirection: "row",
    marginTop: 16,
  },
  accountPrimaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  accountPrimaryButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: COLORS.white,
  },
  accountSecondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6BA9A5",
  },
  accountSecondaryButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: COLORS.white,
  },

  // ---- Guest account menu ----
  modalBackdrop: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 74,
    paddingHorizontal: 16,
    backgroundColor: "rgba(18, 59, 58, 0.16)",
  },
  guestMenuCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  guestMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestAvatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightTealBg,
  },
  guestMenuHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  guestMenuTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: COLORS.textDark,
  },
  guestMenuSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeMenuButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  guestMenuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  guestMenuAction: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 4,
  },
  guestMenuActionText: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.textDark,
    marginLeft: 12,
  },

  // ---- Bottom navigation ----
  bottomNav: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  navTabItem: {
    flex: 1,
    alignItems: "center",
  },
  navTabLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  navTabLabelActive: {
    fontFamily: "Poppins-Medium",
    color: COLORS.primary,
  },
});
