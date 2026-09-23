import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const faqs = [
  {
    question: "How do I find a bus to my destination?",
    answer:
      "Enter your starting location and destination on the Search screen. The app will show the available government buses and their routes.",
  },
  {
    question: "Can I find buses available at a specific time?",
    answer:
      "Yes. Select your required travel time. The app will show buses available around that time.",
  },
  {
    question: "How can I see the bus route?",
    answer:
      "Select a bus from the search results. The Bus Details page will show the complete route and important stops.",
  },
  {
    question: "How do I know which bus reaches my destination?",
    answer:
      "Enter your starting point and destination. The app will display buses that travel towards your selected destination.",
  },
  {
    question: "Can I see the bus arrival and departure time?",
    answer:
      "Yes. The search results and Bus Details page display the available bus timings.",
  },
  {
    question: "What if there is no direct bus?",
    answer:
      "The app can show alternative routes and available buses that can help you reach your destination.",
  },
  {
    question: "Can I see the stops between my starting point and destination?",
    answer:
      "Yes. Open the selected bus route to view the stops between your starting point and destination.",
  },
  {
    question: "How do I choose between different buses?",
    answer:
      "You can compare the available buses based on route, timing, stops and destination, then select a suitable bus.",
  },
  {
    question: "Can I check buses for tourist places?",
    answer:
      "Yes. You can search routes to tourist destinations in Kanyakumari and view available government buses.",
  },
  {
    question: "What should I do if the bus information is incorrect?",
    answer:
      "Use the Report & Feedback section to report incorrect bus timings, routes, stops or other information.",
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

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

        <View>
          <Text style={styles.headerTitle}>
            Help Center
          </Text>

          <Text style={styles.headerSubtitle}>
            Kanyakumari Govt Bus Navigator
          </Text>
        </View>

      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* INTRODUCTION */}
        <View style={styles.introCard}>

          <View style={styles.introIcon}>
            <Ionicons
              name="help-circle-outline"
              size={36}
              color="#159447"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>
              How can we help?
            </Text>

            <Text style={styles.introText}>
              Find buses, routes, timings and stops for your journey.
            </Text>
          </View>

        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>

          <Ionicons
            name="search-outline"
            size={22}
            color="#777"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search your question..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
            >
              <Ionicons
                name="close-circle"
                size={21}
                color="#999"
              />
            </TouchableOpacity>
          )}

        </View>

        {/* FAQ TITLE */}
        <Text style={styles.sectionTitle}>
          Frequently Asked Questions
        </Text>

        {/* FAQ LIST */}
        {filteredFAQs.length === 0 ? (

          <View style={styles.noResult}>

            <Ionicons
              name="search-outline"
              size={40}
              color="#999"
            />

            <Text style={styles.noResultTitle}>
              No questions found
            </Text>

            <Text style={styles.noResultText}>
              Try searching for bus, route, timing or destination.
            </Text>

          </View>

        ) : (

          filteredFAQs.map((faq) => {

            const actualIndex = faqs.indexOf(faq);
            const isOpen = openIndex === actualIndex;

            return (
              <TouchableOpacity
                key={faq.question}
                activeOpacity={0.8}
                style={[
                  styles.faqCard,
                  isOpen && styles.faqCardOpen,
                ]}
                onPress={() =>
                  setOpenIndex(
                    isOpen ? null : actualIndex
                  )
                }
              >

                {/* QUESTION */}
                <View style={styles.questionRow}>

                  <View style={styles.questionIcon}>

                    <Ionicons
                      name="help-outline"
                      size={19}
                      color="#159447"
                    />

                  </View>

                  <Text style={styles.question}>
                    {faq.question}
                  </Text>

                  <Ionicons
                    name={
                      isOpen
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={21}
                    color="#555"
                  />

                </View>

                {/* ANSWER */}
                {isOpen && (

                  <View style={styles.answerBox}>

                    <View style={styles.answerLine} />

                    <Text style={styles.answer}>
                      {faq.answer}
                    </Text>

                  </View>

                )}

              </TouchableOpacity>
            );
          })

        )}

        {/* CONTACT SUPPORT */}
        <View style={styles.supportCard}>

          <View style={styles.supportIcon}>

            <Ionicons
              name="headset-outline"
              size={34}
              color="#159447"
            />

          </View>

          <Text style={styles.supportTitle}>
            Still need help?
          </Text>

          <Text style={styles.supportText}>
            If you cannot find the information you need,
            contact the support team.
          </Text>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={() =>
              alert("Support request opened")
            }
          >

            <Ionicons
              name="chatbubble-ellipses-outline"
              size={19}
              color="white"
            />

            <Text style={styles.buttonText}>
              Contact Support
            </Text>

          </TouchableOpacity>

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
    backgroundColor: "#ECFDF3",
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  introIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
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

  searchBox: {
    backgroundColor: "white",
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E4EA",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 22,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 9,
    color: "#222",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#20242A",
    marginBottom: 12,
    marginTop: 5,
  },

  faqCard: {
    backgroundColor: "white",
    borderRadius: 13,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },

  faqCardOpen: {
    borderWidth: 1,
    borderColor: "#B7E5C8",
  },

  questionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  questionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ECFDF3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    paddingRight: 8,
    lineHeight: 20,
  },

  answerBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    flexDirection: "row",
  },

  answerLine: {
    width: 3,
    backgroundColor: "#159447",
    borderRadius: 2,
    marginRight: 10,
  },

  answer: {
    flex: 1,
    color: "#626975",
    fontSize: 13,
    lineHeight: 20,
  },

  noResult: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },

  noResultTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 10,
  },

  noResultText: {
    color: "#777",
    textAlign: "center",
    marginTop: 5,
    fontSize: 13,
  },

  supportCard: {
    backgroundColor: "#ECFDF3",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginTop: 15,
  },

  supportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  supportTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
  },

  supportText: {
    color: "#666",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  supportButton: {
    backgroundColor: "#159447",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 15,
  },

  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },

});