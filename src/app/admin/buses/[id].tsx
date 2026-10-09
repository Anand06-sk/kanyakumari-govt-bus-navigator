import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useBusContext, getSchemeEligibility } from '../../../store/bus-store';

const COLORS = {
  primary: '#0B1F3A',
  secondary: '#1565C0',
  background: '#F5F7FA',
  card: '#FFFFFF',
  textPrimary: '#172033',
  textSecondary: '#667085',
  success: '#2E7D32',
  warning: '#B45309',
  border: '#D9DEE7',
};

export default function BusDetailsScreen() {
  const params = useLocalSearchParams();
  const busId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getBusById } = useBusContext();
  const bus = getBusById(busId);
  const schemeEligibility = bus ? getSchemeEligibility(bus) : 'pending_verification';

  if (!bus) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bus Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Bus not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bus Details</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/admin/buses/edit', params: { id: bus.id } })}
          accessibilityLabel="Edit bus button"
          accessibilityRole="button"
        >
          <Ionicons name="create-outline" size={23} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Ionicons name="bus" size={24} color={COLORS.primary} />
            <Text style={styles.busNumber}>{bus.busNumber}</Text>
          </View>
          <Text style={styles.busType}>{bus.busType}</Text>
          <Text style={styles.route}>{bus.startPoint} → {bus.destination}</Text>
          <Text style={styles.secondaryText}>Route: {bus.routeNumber}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{bus.status}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>FARE INFORMATION</Text>
          <Text style={styles.label}>Vettri Payanam Eligibility</Text>
          <Text style={styles.value}>
            {schemeEligibility === 'eligible'
              ? 'Eligible'
              : schemeEligibility === 'not_eligible'
                ? 'Not eligible'
                : 'Pending verification'}
          </Text>
          {schemeEligibility === 'pending_verification' ? (
            <Text style={styles.eligibilityWarning}>
              Verify this bus against applicable official scheme rules before marking it eligible.
            </Text>
          ) : null}
          <Text style={styles.label}>Fare Category</Text>
          <Text style={styles.value}>
            {bus.fareCategory === 'women_free' ? 'Women Free' : 'Regular Paid'}
          </Text>
          {bus.fareCategory === 'women_free' ? (
            <>
              <Text style={styles.label}>Women Fare</Text>
              <Text style={styles.freeValue}>FREE</Text>
              <Text style={styles.label}>Regular Fare</Text>
              <Text style={styles.value}>₹{bus.regularFare}</Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>Fare for Everyone</Text>
              <Text style={styles.value}>₹{bus.regularFare} for everyone</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  headerSpacer: { width: 23 },
  content: { padding: 20 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, padding: 18, marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  busNumber: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginLeft: 8 },
  busType: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  route: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginTop: 14 },
  secondaryText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6, backgroundColor: COLORS.success },
  statusText: { color: COLORS.success, fontSize: 13, fontWeight: '700' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, letterSpacing: 0.5, marginBottom: 16 },
  label: { fontSize: 12, color: COLORS.textSecondary, marginTop: 12 },
  value: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '600', marginTop: 4 },
  freeValue: { fontSize: 16, color: COLORS.success, fontWeight: '700', marginTop: 4 },
  eligibilityWarning: { color: COLORS.warning, fontSize: 12, lineHeight: 18, marginTop: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: COLORS.textSecondary, fontSize: 15 },
});
