// src/app/admin/stops/[id].tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useStopContext } from '../../../store/stop-store';

const COLORS = {
  primary: '#0B1F3A',
  secondary: '#1565C0',
  background: '#F5F7FA',
  card: '#FFFFFF',
  textPrimary: '#172033',
  textSecondary: '#667085',
  success: '#2E7D32',
  error: '#D32F2F',
  border: '#D9DEE7',
};

export default function StopDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getStopById, deleteStop } = useStopContext();

  const stop = getStopById(id);

  if (!stop) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bus Stop Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Bus stop not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Bus Stop?',
      'Are you sure you want to delete this bus stop?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteStop(stop.id);
            Alert.alert('Deleted', 'Bus stop deleted successfully.', [
              { text: 'OK', onPress: () => router.replace('../') },
            ]);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    router.push({ pathname: '/admin/stops/edit', params: { id: stop.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bus Stop Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeaderRow}>
            <Ionicons name="location" size={22} color={COLORS.primary} />
            <Text style={styles.stopName}>  {stop.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Area</Text>
            <Text style={styles.infoValue}>{stop.area}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: stop.status === 'Active' ? COLORS.success : COLORS.textSecondary },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: stop.status === 'Active' ? COLORS.success : COLORS.textSecondary },
                ]}
              >
                {stop.status}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Number of Routes</Text>
            <Text style={styles.infoValue}>{stop.routes.length}</Text>
          </View>
        </View>

        <View style={styles.routesCard}>
          <Text style={styles.sectionTitle}>Routes Using This Stop</Text>
          {stop.routes.length === 0 ? (
            <Text style={styles.noRoutesText}>No routes currently use this stop.</Text>
          ) : (
            stop.routes.map((routeNumber) => (
              <View key={routeNumber} style={styles.routeRow}>
                <Ionicons name="git-network-outline" size={16} color={COLORS.secondary} />
                <Text style={styles.routeRowText}>  {routeNumber}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            accessibilityLabel="Edit bus stop button"
            accessibilityRole="button"
          >
            <Text style={styles.editButtonText}>Edit Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            accessibilityLabel="Delete bus stop button"
            accessibilityRole="button"
          >
            <Text style={styles.deleteButtonText}>Delete Stop</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 20 },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  stopName: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  infoLabel: { fontSize: 13, color: COLORS.textSecondary },
  infoValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 13, fontWeight: '700' },
  routesCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  routeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  routeRowText: { fontSize: 14, color: COLORS.textPrimary },
  noRoutesText: { fontSize: 13, color: COLORS.textSecondary },
  actionsRow: { flexDirection: 'row', marginBottom: 20 },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: { color: COLORS.card, fontSize: 14, fontWeight: '700' },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: { color: COLORS.card, fontSize: 14, fontWeight: '700' },
  notFoundContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 14, color: COLORS.textSecondary },
});