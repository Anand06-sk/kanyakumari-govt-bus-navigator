// src/app/admin/dashboard.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAdminContext } from '../../store/admin-store';

// ---- Colors (same visual language as Admin Login) ----
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

// =====================================================
// DEMO DATA (replace with API/database data later)
// =====================================================

type StatItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

const stats: StatItem[] = [
  { id: 'buses', icon: 'bus', label: 'Total Buses', value: '' },
  { id: 'routes', icon: 'map', label: 'Total Routes', value: '' },
  { id: 'stops', icon: 'location', label: 'Bus Stops', value: '' },
  { id: 'users', icon: 'people', label: 'Active Users', value: '' },
];

type QuickActionItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  futureRoute: string; // for future router.push() wiring
};

const quickActions: QuickActionItem[] = [
  { id: 'add-bus', icon: 'add-circle', label: 'Add Bus', futureRoute: '/admin/buses/add' },
  { id: 'manage-buses', icon: 'bus', label: 'Manage Buses', futureRoute: '/admin/buses' },
  { id: 'reports', icon: 'bar-chart', label: 'Reports & Analytics', futureRoute: '/admin/reports' },
];

type ActivityItemData = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

const recentActivities: ActivityItemData[] = [
  { id: '1', title: 'New Bus Added', detail: 'TN-74-1234', time: '10 minutes ago' },
  { id: '2', title: 'Route Updated', detail: 'Nagercoil → Kanyakumari', time: '30 minutes ago' },
  { id: '3', title: 'New Bus Stop Added', detail: 'Suchindram Bus Stop', time: '1 hour ago' },
  { id: '4', title: 'Bus Information Updated', detail: 'TN-74-5678', time: '2 hours ago' },
];

// =====================================================
// REUSABLE SUB-COMPONENTS
// =====================================================

function StatCard({ item }: { item: StatItem }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconCircle}>
        <Ionicons name={item.icon} size={22} color={COLORS.card} />
      </View>
      <Text style={styles.statLabel}>{item.label}</Text>
      <Text style={styles.statValue}>{item.value}</Text>
    </View>
  );
}

function QuickActionButton({
  item,
  onPress,
}: {
  item: QuickActionItem;
  onPress: (item: QuickActionItem) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.quickActionButton}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
      accessibilityLabel={`${item.label} button`}
      accessibilityRole="button"
    >
      <Ionicons name={item.icon} size={20} color={COLORS.primary} style={styles.quickActionIcon} />
      <Text style={styles.quickActionText}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}

function ActivityItem({ item }: { item: ActivityItemData }) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIconCircle}>
        <Ionicons name="checkmark" size={16} color={COLORS.card} />
      </View>
      <View style={styles.activityTextContainer}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDetail}>{item.detail}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );
}

// =====================================================
// MAIN SCREEN
// =====================================================

export default function AdminDashboardScreen() {
  const { profile } = useAdminContext();

  const handleQuickAction = (item: QuickActionItem) => {
    const availableRoutes = [
      '/admin/buses/add',
      '/admin/buses',
      '/admin/buses/index',
      '/admin/stops',
      '/admin/reports',
    ];

    if (availableRoutes.includes(item.futureRoute)) {
      router.push(item.futureRoute as any);
      return;
    }

    Alert.alert('Coming Soon', 'This management module will be available in the next update.');
  };

  const handleProfilePress = () => {
    router.push('/admin/profile' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <Text style={styles.appName}>Kanniyakumari Govt Bus Navigator</Text>

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcomeText}>Welcome back, {profile.name}</Text>
              <Text style={styles.headerTitle}>Admin Dashboard</Text>
            </View>

            <TouchableOpacity
              style={styles.profileIconButton}
              onPress={handleProfilePress}
              accessibilityLabel="Profile button"
              accessibilityRole="button"
            >
              <Ionicons name="person-circle" size={36} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------- OVERVIEW / STATS ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* ---------- QUICK ACTIONS ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsList}>
            {quickActions.map((item) => (
              <QuickActionButton key={item.id} item={item} onPress={handleQuickAction} />
            ))}
          </View>
        </View>

        {/* ---------- RECENT ACTIVITY ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* ---------- ADMIN PROFILE ---------- */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <Ionicons name="person-circle-outline" size={40} color={COLORS.primary} />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileRole}>{profile.role}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
            </View>
          </View>
        </View>

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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Header
  header: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileIconButton: {
    padding: 2,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  // Quick actions
  quickActionsList: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  quickActionIcon: {
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  // Activity
  activityList: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  activityDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Profile
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  profileTextContainer: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});