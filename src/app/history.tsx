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

type HistoryItem = {
  id: string;
  route: string;
  date: string;
  time: string;
};

export default function History() {
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([
    {
      id: "1",
      route: "Bengaluru → Mysuru",
      date: "Today",
      time: "9:15 AM",
    },
    {
      id: "2",
      route: "Bengaluru → Chennai",
      date: "Yesterday",
      time: "6:40 PM",
    },
    {
      id: "3",
      route: "Mysuru → Bengaluru",
      date: "Yesterday",
      time: "10:20 AM",
    },
    {
      id: "4",
      route: "Bengaluru → Mangaluru",
      date: "2 days ago",
      time: "4:30 PM",
    },
  ]);

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

  // DELETE ONE SEARCH
  const deleteSearch = (id: string) => {
    Alert.alert(
      "Delete Search",
      "Are you sure you want to remove this search from your history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSearchHistory((current) =>
              current.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  };

  // CLEAR ALL HISTORY
  const clearHistory = () => {
    if (searchHistory.length === 0) {
      Alert.alert(
        "Search History",
        "Your search history is already empty."
      );
      return;
    }

    Alert.alert(
      "Clear Search History",
      "Are you sure you want to delete all recent searches?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            setSearchHistory([]);
          },
        },
      ]
    );
  };

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
        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* HEADER TITLE */}
        <Text style={styles.headerTitle}>
          Search History
        </Text>

        {/* BALANCE */}
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* RECENT SEARCHES TITLE + COUNT */}

        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.purple,
              },
            ]}
          >
            RECENT SEARCHES
          </Text>

          <Text
            style={[
              styles.searchCount,
              {
                color: colors.secondary,
              },
            ]}
          >
            {searchHistory.length} recent{" "}
            {searchHistory.length === 1
              ? "search"
              : "searches"}
          </Text>
        </View>

        {/* SEARCH HISTORY */}

        {searchHistory.length > 0 ? (
          <View
            style={[
              styles.historyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {searchHistory.map((item, index) => (
              <React.Fragment key={item.id}>
                <View style={styles.historyItem}>
                  {/* ICON */}

                  <View
                    style={[
                      styles.historyIcon,
                      {
                        backgroundColor:
                          colors.greenLight,
                      },
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={21}
                      color={colors.green}
                    />
                  </View>

                  {/* SEARCH DETAILS */}

                  <View style={styles.historyContent}>
                    <Text
                      style={[
                        styles.routeText,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {item.route}
                    </Text>

                    <Text
                      style={[
                        styles.dateText,
                        {
                          color: colors.secondary,
                        },
                      ]}
                    >
                      {item.date} • {item.time}
                    </Text>
                  </View>

                  {/* DELETE */}

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      deleteSearch(item.id)
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.red}
                    />
                  </TouchableOpacity>
                </View>

                {index <
                  searchHistory.length - 1 && (
                  <View
                    style={[
                      styles.divider,
                      {
                        backgroundColor:
                          colors.border,
                      },
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        ) : (
          /* EMPTY HISTORY */

          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    colors.greenLight,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={30}
                color={colors.green}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No Search History
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                {
                  color: colors.secondary,
                },
              ]}
            >
              Your recent bus searches will
              appear here.
            </Text>
          </View>
        )}

        {/* CLEAR HISTORY */}

        {searchHistory.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearHistory}
            activeOpacity={0.8}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={colors.red}
            />

            <Text style={styles.clearButtonText}>
              Clear Search History
            </Text>
          </TouchableOpacity>
        )}

        {/* FOOTER */}

        <Text style={styles.footer}>
          Govt Bus{"\n"}
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

  // RECENT SEARCHES HEADER
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 9,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  searchCount: {
    fontSize: 12,
    marginLeft: 10,
  },

  // HISTORY CARD
  historyCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },

  historyItem: {
    minHeight: 78,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  historyContent: {
    flex: 1,
  },

  routeText: {
    fontSize: 15,
    fontWeight: "600",
  },

  dateText: {
    fontSize: 12,
    marginTop: 4,
  },

  deleteButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    marginLeft: 70,
  },

  // EMPTY HISTORY
  emptyCard: {
    minHeight: 190,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  emptySubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 18,
  },

  // CLEAR BUTTON
  clearButton: {
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

  clearButtonText: {
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
    lineHeight: 20,
  },
});
