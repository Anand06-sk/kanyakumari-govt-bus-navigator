import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ReportIssue() {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const issueTypes = [
    "Incorrect bus information",
    "Wrong route or stop",
    "Incorrect bus timing",
    "App error / technical problem",
    "Search not working",
    "Other inconvenience",
  ];

  const submitReport = () => {
    if (!issueType) {
      Alert.alert("Select Issue", "Please select the type of issue.");
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        "Enter Details",
        "Please describe the issue or inconvenience."
      );
      return;
    }

    Alert.alert(
      "Report Submitted",
      "Thank you for reporting the issue. Our team will review it.",
      [
        {
          text: "OK",
          onPress: () => {
            setIssueType("");
            setDescription("");
            setEmail("");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="white"
          />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>
            Report an Issue
          </Text>

          <Text style={styles.headerSubtitle}>
            Help us improve the bus navigator
          </Text>
        </View>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => router.push("/help")}
        >
          <Ionicons
            name="help-circle-outline"
            size={26}
            color="white"
          />
        </TouchableOpacity>

      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* INTRO CARD */}
        <View style={styles.introCard}>

          <View style={styles.iconCircle}>
            <Ionicons
              name="warning-outline"
              size={32}
              color="#D97706"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>
              Found a problem?
            </Text>

            <Text style={styles.introText}>
              Tell us about any error, incorrect bus information,
              or inconvenience you experienced.
            </Text>
          </View>

        </View>

        {/* ISSUE TYPE */}
        <Text style={styles.label}>
          What is the problem?
        </Text>

        <View style={styles.optionsContainer}>

          {issueTypes.map((type) => {

            const selected = issueType === type;

            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                ]}
                onPress={() => setIssueType(type)}
              >

                <Ionicons
                  name={
                    selected
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={21}
                  color={
                    selected
                      ? "#159447"
                      : "#777"
                  }
                />

                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {type}
                </Text>

              </TouchableOpacity>
            );
          })}

        </View>

        {/* DESCRIPTION */}
        <Text style={styles.label}>
          Describe the issue
        </Text>

        <TextInput
          style={styles.descriptionInput}
          placeholder="Please explain what went wrong..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        {/* EMAIL */}
        <Text style={styles.label}>
          Email (Optional)
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.note}>
          Your email can be used by the support team to contact you
          if more information is needed.
        </Text>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitReport}
        >

          <Ionicons
            name="send-outline"
            size={20}
            color="white"
          />

          <Text style={styles.submitText}>
            Submit Report
          </Text>

        </TouchableOpacity>

        {/* EXAMPLES */}
        <View style={styles.exampleCard}>

          <View style={styles.exampleHeader}>

            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#159447"
            />

            <Text style={styles.exampleTitle}>
              You can report
            </Text>

          </View>

          <Text style={styles.exampleText}>
            • Bus timing is incorrect{"\n"}
            • Bus route information is wrong{"\n"}
            • A bus stop is missing{"\n"}
            • Search results are incorrect{"\n"}
            • App screen is not working{"\n"}
            • Any other inconvenience
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
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  headerTextWrap: {
    flex: 1,
  },

  helpButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  headerTitle: {
    color: "white",
    fontSize: 21,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#DCE7FF",
    fontSize: 12,
    marginTop: 3,
  },

  content: {
    padding: 16,
    paddingBottom: 50,
  },

  introCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  introTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  introText: {
    color: "#666",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
    marginBottom: 10,
    marginTop: 5,
  },

  optionsContainer: {
    backgroundColor: "white",
    borderRadius: 13,
    padding: 8,
    marginBottom: 20,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 9,
  },

  optionSelected: {
    backgroundColor: "#ECFDF3",
  },

  optionText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 10,
  },

  optionTextSelected: {
    color: "#159447",
    fontWeight: "700",
  },

  descriptionInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E4EA",
    borderRadius: 12,
    minHeight: 130,
    padding: 14,
    fontSize: 14,
    color: "#222",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E4EA",
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#222",
  },

  note: {
    color: "#777",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: "#159447",
    borderRadius: 12,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginBottom: 20,
  },

  submitText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },

  exampleCard: {
    backgroundColor: "#ECFDF3",
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },

  exampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  exampleTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
    marginLeft: 8,
  },

  exampleText: {
    color: "#555",
    fontSize: 13,
    lineHeight: 23,
  },

});