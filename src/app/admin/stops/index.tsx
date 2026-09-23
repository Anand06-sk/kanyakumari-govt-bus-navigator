// src/app/admin/stops/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BusStop, useStopContext } from '../../../store/stop-store';

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

type StatusFilter = 'All' | 'Active' | 'Inactive';

export default function ManageStopsScreen() {
  const { stops, deleteStop } = useStopContext();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const filteredStops = useMemo(() => {
    return stops.filter((stop) => {
      const query = searchText.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        stop.name.toLowerCase().includes(query) ||
        stop.area.toLowerCase().includes(query) ||
        stop.routes.some((r) => r.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'All' || stop.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stops, searchText, statusFilter]);

  const handleDelete = (stop: BusStop) => {
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
            Alert.alert('Deleted', 'Bus stop deleted successfully.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = (stop: BusStop) => {
    router.push({ pathname: '/admin/stops/edit', params: { id: stop.id } });
  };

  const handleViewDetails = (stop: BusStop) => {
    router.push({ pathname: '/admin/stops/[id]', params: { id: stop.id } });
  };

  const renderStopCard = ({ item }: { item: BusStop }) => (
    <TouchableOpacity
      style={styles.stopCard}
      activeOpacity={0.85}
      onPress={() => handleViewDetails(item)}
      accessibilityLabel={`Bus stop ${item.name} card`}
    >
      <View style={styles.cardHeaderRow}>
        <Ionicons name="location" size={20} color={COLORS.primary} />
        <Text style={styles.stopName}>  {item.name}</Text>
      </View>

      <Text style={styles.stopArea}>{item.area}</Text>

      <View style={styles.routesRow}>
        <Text style={styles.routesLabel}>
          Routes: {item.routes.length > 0 ? item.routes.join(', ') : 'None'}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="bus-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.metaText}>  {item.routes.length} Route{item.routes.length !== 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.bottomRow}>
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
            accessibilityLabel={`Edit ${item.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={16} color={COLORS.secondary} />
            <Text style={styles.actionButtonTextEdit}>  Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
            accessibilityLabel={`Delete ${item.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
            <Text style={styles.actionButtonTextDelete}>  Delete</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Manage Bus Stops</Text>
        <TouchableOpacity
          onPress={() => router.push('/admin/stops/add')}
          accessibilityLabel="Add bus stop button"
          accessibilityRole="button"
        >
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search bus stops..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          accessibilityLabel="Search bus stop input"
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

      {filteredStops.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateTitle}>
            {stops.length === 0 ? 'No bus stops available' : 'No bus stops found'}
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            {stops.length === 0
              ? 'Add a new bus stop to start managing transportation stops.'
              : 'Try a different search or filter.'}
          </Text>
          {stops.length === 0 && (
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => router.push('/admin/stops/add')}
              accessibilityLabel="Add bus stop button"
              accessibilityRole="button"
            >
              <Text style={styles.emptyStateButtonText}>+ Add Bus Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredStops}
          keyExtractor={(item) => item.id}
          renderItem={renderStopCard}
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
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, marginTop: 10, marginBottom: 4 },
  filterChip: {
    paddingHorizontal: 14,
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
  stopCard: {
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
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  stopName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  stopArea: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, marginLeft: 26 },
  routesRow: { marginTop: 10, marginLeft: 26 },
  routesLabel: { fontSize: 12, color: COLORS.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginLeft: 26 },
  metaText: { fontSize: 12, color: COLORS.textSecondary },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },
  cardActionsRow: { flexDirection: 'row' },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 16 },
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