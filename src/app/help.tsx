import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const emergencyContacts = [
  ["Police Help", "100", "shield-checkmark-outline"],
  ["National Emergency", "112", "call-outline"],
  ["Ambulance", "108", "medkit-outline"],
  ["Women Helpline", "181", "woman-outline"],
  ["Fire & Rescue", "101", "flame-outline"],
];

export default function Index() {

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Safety, Help & Feedback
        </Text>
        <Text style={styles.headerSubtitle}>
          Kanyakumari Govt Bus Navigator
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Ionicons
            name="warning-outline"
            size={30}
            color="#E53935"
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>
              Need Emergency Help?
            </Text>

            <Text style={styles.bannerText}>
              Contact the appropriate emergency service.
            </Text>
          </View>
        </View>

        {/* Emergency Contacts */}
        <Text style={styles.sectionTitle}>
          Emergency Contacts
        </Text>

        {emergencyContacts.map((item) => (
          <View style={styles.contactCard} key={item[0]}>

            <View style={styles.iconBox}>
              <Ionicons
                name={item[2] as any}
                size={25}
                color="#E53935"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>
                {item[0]}
              </Text>

              <Text style={styles.number}>
                {item[1]}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => callNumber(item[1])}
            >
              <Ionicons
                name="call"
                size={17}
                color="white"
              />

              <Text style={styles.callText}>
                Call
              </Text>
            </TouchableOpacity>

          </View>
        ))}

        {/* Help Center */}
        <Text style={styles.sectionTitle}>
          Help Center
        </Text>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => router.push("/qns")}
        >
          <Ionicons
            name="help-circle-outline"
            size={28}
            color="#159447"
          />

          <View style={{ flex: 1 }}  >
            <Text style={styles.menuTitle}>
              Frequently Asked Questions
            </Text>

            <Text style={styles.menuText}>
              Find answers to common bus travel questions.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#777"
          />
        </TouchableOpacity>

        {/* Feedback */}
        <Text style={styles.sectionTitle}>
          Report & Feedback
        </Text>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => router.push("/report")}
        >
          <Ionicons
            name="flag-outline"
            size={28}
            color="#159447"
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>
              Report an Issue
            </Text>

            <Text style={styles.menuText}>
              Report wrong fare, missing stop, route or timing issues.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#777"
          />
        </TouchableOpacity>

        {/* Guidelines */}
        <Text style={styles.sectionTitle}>
          App Guidelines
        </Text>

        <View style={styles.guidelines}>

          <Text style={styles.guide}>
            ✓ Check the bus route before boarding.
          </Text>

          <Text style={styles.guide}>
            ✓ Use emergency contacts when necessary.
          </Text>

          <Text style={styles.guide}>
            ✓ Report incorrect information.
          </Text>

          <Text style={styles.guide}>
            ✓ Do not share sensitive information.
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    backgroundColor: "#176b22",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  headerTitle: {
    color: "white",
    fontSize: 21,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#DCE7FF",
    marginTop: 5,
    fontSize: 13,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  emergencyBanner: {
    backgroundColor: "#FFF1F1",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  bannerTitle: {
    color: "#8B1E1E",
    fontSize: 16,
    fontWeight: "800",
  },

  bannerText: {
    color: "#777",
    fontSize: 13,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#20242A",
    marginTop: 8,
    marginBottom: 12,
  },

  contactCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  contactTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  number: {
    color: "#777",
    marginTop: 3,
  },

  callButton: {
    backgroundColor: "#E53935",
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  callText: {
    color: "white",
    fontWeight: "700",
  },

  menuCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    elevation: 2,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  menuText: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },

  guidelines: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
  },

  guide: {
    color: "#555",
    marginBottom: 10,
    fontSize: 13,
  },

});