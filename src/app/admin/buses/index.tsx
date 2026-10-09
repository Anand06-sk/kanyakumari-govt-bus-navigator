// src/app/admin/buses/index.tsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBusContext, Bus, getSchemeEligibility } from '../../../store/bus-store';

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
  eligibilityBackground: '#FCE7F3',
  eligibilityBorder: '#F9A8D4',
  eligibilityText: '#BE185D',
  pendingBackground: '#FFFBEB',
  pendingBorder: '#FCD34D',
  pendingText: '#B45309',
};

type StatusFilter = 'All' | 'Active' | 'Inactive';
type TypeFilter = 'All' | 'Ordinary' | 'Low-Floor Bus' | 'Deluxe';

export default function ManageBusesScreen() {
  const { buses, deleteBus } = useBusContext();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');

  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      const query = searchText.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        bus.busNumber.toLowerCase().includes(query) ||
        bus.routeNumber.toLowerCase().includes(query) ||
        bus.startPoint.toLowerCase().includes(query) ||
        bus.destination.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || bus.status === statusFilter;
      const matchesType = typeFilter === 'All' || bus.busType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [buses, searchText, statusFilter, typeFilter]);

  const handleDelete = (bus: Bus) => {
    Alert.alert(
      'Delete Bus?',
      'Are you sure you want to delete this bus?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBus(bus.id);
            Alert.alert('Deleted', 'Bus deleted successfully.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = (bus: Bus) => {
    router.push({ pathname: '/admin/buses/edit', params: { id: bus.id } });
  };

  const renderBusCard = ({ item }: { item: Bus }) => (
    <TouchableOpacity
      style={styles.busCard}
      activeOpacity={0.85}
      onPress={() => router.push(`/admin/buses/${item.id}` as any)}
      accessibilityLabel={`Bus ${item.busNumber} card`}
    >
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="bus" size={20} color={COLORS.primary} />
          <Text style={styles.busNumber}>  {item.busNumber}</Text>
        </View>
      </View>

      <Text style={styles.busType}>{item.busType}</Text>
      <Text style={styles.serviceType}>
        Service: {item.serviceType ?? 'Not recorded'}
      </Text>

      <View style={styles.routeRow}>
        <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.routeText}>
          {' '}
          {item.startPoint} → {item.destination}
        </Text>
      </View>
      <Text style={styles.routeNumberText}>Route: {item.routeNumber}</Text>

      {getSchemeEligibility(item) === 'eligible' ? (
        <View style={styles.eligibilityBadge} accessibilityLabel="Eligible for Vettri Payanam free travel">
          <Text style={styles.eligibilityBadgeText}>FREE TRAVEL — VETTRI PAYANAM</Text>
        </View>
      ) : getSchemeEligibility(item) === 'pending_verification' ? (
        <View style={styles.pendingBadge} accessibilityLabel="Scheme eligibility pending verification">
          <Text style={styles.pendingBadgeText}>Eligibility Pending</Text>
        </View>
      ) : null}

      {item.fareCategory === 'women_free' ? (
        <Text style={styles.regularFareText}>
          Legacy fare: women ₹{item.womenFare}; others ₹{item.regularFare}
        </Text>
      ) : (
        <Text style={styles.regularFareText}>Fare: ₹{item.regularFare} for everyone</Text>
      )}

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.status === 'Active' ? COLORS.success : COLORS.textSecondary },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: item.status === 'Active' ? COLORS.success : COLORS.textSecondary },
          ]}
        >
          {item.status}
        </Text>
      </View>

      <View style={styles.cardActionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
          accessibilityLabel={`Edit ${item.busNumber}`}
          accessibilityRole="button"
        >
          <Ionicons name="create-outline" size={16} color={COLORS.secondary} />
          <Text style={styles.actionButtonTextEdit}>  Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
          accessibilityLabel={`Delete ${item.busNumber}`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
          <Text style={styles.actionButtonTextDelete}>  Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back button"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Buses</Text>
        <TouchableOpacity
          onPress={() => router.push('/admin/buses/add')}
          accessibilityLabel="Add bus button"
          accessibilityRole="button"
        >
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search bus number, route, or place..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          accessibilityLabel="Search bus input"
        />
      </View>

      <View style={styles.filterRow}>
        {(['All', 'Active', 'Inactive'] as StatusFilter[]).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
            onPress={() => setStatusFilter(status)}
            accessibilityLabel={`Filter by ${status}`}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === status && styles.filterChipTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filterRow}>
        {(
          ['All', 'Ordinary', 'Low-Floor Bus', 'Deluxe'] as TypeFilter[]
        ).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterChip, typeFilter === type && styles.filterChipActive]}
            onPress={() => setTypeFilter(type)}
            accessibilityLabel={`Filter by ${type}`}
            accessibilityRole="button"
          >
            <Text
              style={[styles.filterChipText, typeFilter === type && styles.filterChipTextActive]}
            >
              {type === 'All' ? 'All Types' : type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredBuses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bus-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateTitle}>
            {buses.length === 0 ? 'No buses available' : 'No buses found'}
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            {buses.length === 0
              ? 'Add a new bus to start managing transportation data.'
              : 'Try a different search or filter.'}
          </Text>
          {buses.length === 0 && (
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => router.push('/admin/buses/add')}
              accessibilityLabel="Add bus button"
              accessibilityRole="button"
            >
              <Text style={styles.emptyStateButtonText}>+ Add Bus</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredBuses}
          keyExtractor={(item) => item.id}
          renderItem={renderBusCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 14, color: COLORS.textPrimary },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, marginTop: 10 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: COLORS.card },
  listContent: { padding: 20, paddingTop: 10 },
  busCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  busNumber: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  busType: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  routeText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },
  routeNumberText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, marginLeft: 18 },
  serviceType: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  eligibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.eligibilityBorder,
    backgroundColor: COLORS.eligibilityBackground,
    marginTop: 10,
  },
  eligibilityBadgeText: { color: COLORS.eligibilityText, fontSize: 12, fontWeight: '700' },
  pendingBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.pendingBorder,
    backgroundColor: COLORS.pendingBackground,
    marginTop: 10,
  },
  pendingBadgeText: { color: COLORS.pendingText, fontSize: 12, fontWeight: '700' },
  regularFareText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '600', marginTop: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 20 },
  actionButtonTextEdit: { color: COLORS.secondary, fontSize: 13, fontWeight: '600' },
  actionButtonTextDelete: { color: COLORS.error, fontSize: 13, fontWeight: '600' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyStateTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12 },
  emptyStateSubtitle: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6 },
  emptyStateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 18,
  },
  emptyStateButtonText: { color: COLORS.card, fontSize: 14, fontWeight: '700' },
});