import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BusOption, places } from "./touristplaces";

export default function TouristPlacesDetails() {
  const { placeId } = useLocalSearchParams<{ placeId?: string }>();
  const selectedPlace = places.find((place) => place.id === placeId);

  if (!selectedPlace) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Place Not Found</Text>
          <Text style={styles.muted}>Tourist place information could not be found.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>← Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View>
          <Image source={{ uri: selectedPlace.image }} style={styles.heroImage} />
          <Pressable style={styles.backCircle} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{selectedPlace.category}</Text>
          <Text style={styles.title}>{selectedPlace.name}</Text>
          <Text style={styles.location}>📍 {selectedPlace.location}</Text>
          <Text style={styles.description}>{selectedPlace.description}</Text>

          <View style={styles.infoGrid}>
            <Info title="Visiting Time" value={selectedPlace.timing} />
            <Info title="Entry Fee" value={selectedPlace.entryFee} />
            <Info title="Best Time" value={selectedPlace.bestTime} />
            <Info title="Distance" value={selectedPlace.distance} />
          </View>

          <Text style={styles.sectionTitle}>Bus Details</Text>
          <Text style={styles.sectionSubtitle}>Sample Bus Information · Verify timings before travelling</Text>
          {selectedPlace.buses.map((bus) => <BusCard key={bus.busNo} bus={bus} />)}

          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>← Back to Tourist Places</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return <View style={styles.infoBox}><Text style={styles.infoTitle}>{title}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

function BusCard({ bus }: { bus: BusOption }) {
  return (
    <View style={styles.busCard}>
      <View style={styles.busHeader}><Text style={styles.busNumber}>BUS {bus.busNo}</Text><Text style={styles.fare}>{bus.fare}</Text></View>
      <Text style={styles.route}>{bus.from} → {bus.to}</Text>
      <View style={styles.timeRow}><Info title="Departure" value={bus.departure} /><Info title="Arrival" value={bus.arrival} /></View>
      <Text style={styles.stopTitle}>Stops</Text>
      <Text style={styles.stops}>{bus.stops.join("  ↓  ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F8F6" },
  scroll: { paddingBottom: 28 },
  heroImage: { width: "100%", height: 260, backgroundColor: "#DDE5E0" },
  backCircle: { position: "absolute", top: 18, left: 18, width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  backIcon: { color: "#17211B", fontSize: 24, fontWeight: "900" },
  content: { padding: 17 },
  category: { color: "#168A54", fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  title: { marginTop: 5, color: "#17211B", fontSize: 28, lineHeight: 34, fontWeight: "900" },
  location: { marginTop: 6, color: "#68736D", fontWeight: "700" },
  description: { marginTop: 13, color: "#59635D", fontSize: 14, lineHeight: 21 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 },
  infoBox: { flex: 1, minWidth: "47%", backgroundColor: "#FFFFFF", borderRadius: 13, borderWidth: 1, borderColor: "#E1E8E3", padding: 12 },
  infoTitle: { color: "#78817C", fontSize: 11, fontWeight: "700" },
  infoValue: { marginTop: 4, color: "#17211B", fontSize: 13, lineHeight: 18, fontWeight: "900" },
  sectionTitle: { marginTop: 24, color: "#17211B", fontSize: 21, fontWeight: "900" },
  sectionSubtitle: { marginTop: 4, marginBottom: 10, color: "#68736D", fontSize: 13 },
  busCard: { backgroundColor: "#FFFFFF", borderRadius: 15, borderWidth: 1, borderColor: "#E1E8E3", padding: 15, marginBottom: 11 },
  busHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  busNumber: { color: "#17211B", fontSize: 17, fontWeight: "900" },
  fare: { color: "#168A54", fontSize: 16, fontWeight: "900" },
  route: { marginTop: 12, color: "#17211B", fontSize: 15, fontWeight: "800" },
  timeRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  stopTitle: { marginTop: 13, color: "#68736D", fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  stops: { marginTop: 5, color: "#17211B", fontSize: 13, lineHeight: 21 },
  primaryButton: { marginTop: 18, paddingVertical: 15, borderRadius: 13, backgroundColor: "#168A54", alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  notFoundTitle: { color: "#17211B", fontSize: 24, fontWeight: "900" },
  muted: { marginTop: 8, color: "#68736D", textAlign: "center" },
});