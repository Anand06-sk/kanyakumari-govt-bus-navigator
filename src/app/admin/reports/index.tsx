// src/app/admin/reports/index.tsx

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBusContext, getSchemeEligibility } from '../../../store/bus-store';
import { useRouteContext } from '../../../store/route-store';
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
  warning: '#B45309',
  border: '#D9DEE7',
};

function safePercent(part: number, total: number): `${number}%` {
  if (total === 0) return '0%';
  return `${((part / total) * 100).toFixed(1)}%` as `${number}%`;
}

export default function ReportsScreen() {
  const { buses } = useBusContext();
  const { routes } = useRouteContext();
  const { stops } = useStopContext();

  const busStats = useMemo(() => {
    const total = buses.length;
    const active = buses.filter((b) => b.status === 'Active').length;
    const inactive = total - active;

    const typeCounts: Record<string, number> = {};
    buses.forEach((b) => {
      typeCounts[b.busType] = (typeCounts[b.busType] || 0) + 1;
    });

    const eligible = buses.filter((bus) => getSchemeEligibility(bus) === 'eligible').length;
    const notEligible = buses.filter((bus) => getSchemeEligibility(bus) === 'not_eligible').length;
    const pendingVerification = buses.filter(
      (bus) => getSchemeEligibility(bus) === 'pending_verification'
    ).length;

    return { total, active, inactive, typeCounts, eligible, notEligible, pendingVerification };
  }, [buses]);

  const routeStats = useMemo(() => {
    const total = routes.length;
    const active = routes.filter((r) => r.status === 'Active').length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [routes]);

  const stopStats = useMemo(() => {
    const total = stops.length;
    const active = stops.filter((s) => s.status === 'Active').length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [stops]);

  const mostUsedStops = useMemo(() => {
    return [...stops]
      .sort((a, b) => b.routes.length - a.routes.length)
      .slice(0, 8)
      .filter((s) => s.routes.length > 0);
  }, [stops]);

  const networkInsights = useMemo(() => {
    const routesWithBuses = routes.filter((route) => route.buses > 0).length;
    const uncoveredStops = stops.filter((stop) => stop.routes.length === 0).length;
    const busiestRoute = [...routes].sort((a, b) => b.buses - a.buses)[0];
    const highestCoverageStop = [...stops].sort((a, b) => b.routes.length - a.routes.length)[0];

    return {
      readiness: safePercent(busStats.active, busStats.total),
      routeCoverage: safePercent(routesWithBuses, routeStats.total),
      stopCoverage: safePercent(stopStats.total - uncoveredStops, stopStats.total),
      uncoveredStops,
      busiestRoute,
      highestCoverageStop,
    };
  }, [busStats, routeStats, stopStats, routes, stops]);

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
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.insightHero} accessibilityLabel="Network health summary">
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroEyebrow}>NETWORK PULSE</Text>
              <Text style={styles.heroTitle}>Service readiness</Text>
            </View>
            <View style={styles.heroScore}>
              <Text style={styles.heroScoreValue}>{networkInsights.readiness}</Text>
              <Text style={styles.heroScoreLabel}>fleet live</Text>
            </View>
          </View>
          <View style={styles.heroBarTrack}>
            <View style={[styles.heroBarFill, { width: networkInsights.readiness }]} />
          </View>
          <Text style={styles.heroText}>
            {busStats.active} of {busStats.total} buses are active across {routeStats.active} active routes.
          </Text>
        </View>

        <View style={styles.sectionHeadingRow}>
          <View>
            <Text style={styles.sectionLabel}>Operations snapshot</Text>
            <Text style={styles.sectionHint}>A quick read on network health</Text>
          </View>
          <Ionicons name="pulse" size={22} color={COLORS.secondary} />
        </View>
        <View style={styles.statsGrid} accessibilityLabel="Overall statistics summary">
          <View style={styles.statCard}>
            <Ionicons name="bus" size={18} color={COLORS.primary} />
            <Text style={styles.statValue}>{busStats.total}</Text>
            <Text style={styles.statLabel}>Total Buses</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="git-network" size={18} color={COLORS.primary} />
            <Text style={styles.statValue}>{routeStats.total}</Text>
            <Text style={styles.statLabel}>Total Routes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="location" size={18} color={COLORS.primary} />
            <Text style={styles.statValue}>{stopStats.total}</Text>
            <Text style={styles.statLabel}>Total Bus Stops</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={styles.statValue}>{busStats.active}</Text>
            <Text style={styles.statLabel}>Active Buses</Text>
          </View>
        </View>

        <View style={styles.insightGrid} accessibilityLabel="Network insight cards">
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}><Ionicons name="git-network" size={17} color={COLORS.secondary} /></View>
            <Text style={styles.insightValue}>{networkInsights.routeCoverage}</Text>
            <Text style={styles.insightLabel}>Routes with service</Text>
          </View>
          <View style={styles.insightCard}>
            <View style={[styles.insightIcon, styles.insightIconGreen]}><Ionicons name="location" size={17} color={COLORS.success} /></View>
            <Text style={styles.insightValue}>{networkInsights.stopCoverage}</Text>
            <Text style={styles.insightLabel}>Stops covered</Text>
          </View>
        </View>

        <View style={styles.attentionCard} accessibilityLabel="Items needing attention">
          <View style={styles.cardTitleRow}>
            <Ionicons name="alert-circle" size={19} color={COLORS.warning} />
            <Text style={styles.cardTitle}>  Needs attention</Text>
          </View>
          <TouchableOpacity style={styles.attentionRow} onPress={() => router.push('/admin/buses')} accessibilityRole="button">
            <View style={styles.attentionDot}><Ionicons name="bus-outline" size={15} color={COLORS.error} /></View>
            <View style={styles.attentionCopy}><Text style={styles.attentionTitle}>{busStats.inactive} inactive buses</Text><Text style={styles.attentionText}>Review fleet availability</Text></View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attentionRow} onPress={() => router.push('/admin/stops')} accessibilityRole="button">
            <View style={[styles.attentionDot, styles.attentionDotAmber]}><Ionicons name="location-outline" size={15} color={COLORS.warning} /></View>
            <View style={styles.attentionCopy}><Text style={styles.attentionTitle}>{networkInsights.uncoveredStops} unlinked stops</Text><Text style={styles.attentionText}>Connect stops to a route</Text></View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.card} accessibilityLabel="Network highlights section">
          <View style={styles.cardTitleRow}><Ionicons name="sparkles-outline" size={18} color={COLORS.secondary} /><Text style={styles.cardTitle}>  Network highlights</Text></View>
          {networkInsights.busiestRoute ? <View style={styles.highlightRow}><Ionicons name="trending-up" size={18} color={COLORS.success} /><Text style={styles.highlightText}><Text style={styles.highlightStrong}>{networkInsights.busiestRoute.routeNumber}</Text> carries the most buses ({networkInsights.busiestRoute.buses}).</Text></View> : null}
          {networkInsights.highestCoverageStop ? <View style={styles.highlightRow}><Ionicons name="navigate" size={18} color={COLORS.secondary} /><Text style={styles.highlightText}><Text style={styles.highlightStrong}>{networkInsights.highestCoverageStop.name}</Text> connects {networkInsights.highestCoverageStop.routes.length} routes.</Text></View> : null}
        </View>

        {/* ---------- BUS SUMMARY ---------- */}
        <View style={styles.card} accessibilityLabel="Bus summary section">
          <View style={styles.cardTitleRow}>
            <Ionicons name="bus" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>  Bus Summary</Text>
          </View>

          {busStats.total === 0 ? (
            <Text style={styles.emptyText}>No bus data available</Text>
          ) : (
            <>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Total Buses</Text>
                <Text style={styles.rowValue}>{busStats.total}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Active</Text>
                <Text style={[styles.rowValue, { color: COLORS.success }]}>
                  {busStats.active} ({safePercent(busStats.active, busStats.total)})
                </Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Inactive</Text>
                <Text style={[styles.rowValue, { color: COLORS.textSecondary }]}>
                  {busStats.inactive} ({safePercent(busStats.inactive, busStats.total)})
                </Text>
              </View>

              {/* Bus status bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: safePercent(busStats.active, busStats.total), backgroundColor: COLORS.success },
                  ]}
                />
              </View>

              <Text style={styles.subSectionLabel}>Bus Types</Text>
              {Object.entries(busStats.typeCounts).map(([type, count]) => (
                <View key={type} style={styles.rowBetween}>
                  <Text style={styles.rowLabel}>{type}</Text>
                  <Text style={styles.rowValue}>{count}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* ---------- ROUTE SUMMARY ---------- */}
        <View style={styles.card} accessibilityLabel="Route summary section">
          <View style={styles.cardTitleRow}>
            <Ionicons name="git-network" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>  Route Summary</Text>
          </View>

          {routeStats.total === 0 ? (
            <Text style={styles.emptyText}>No route data available</Text>
          ) : (
            <>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Total Routes</Text>
                <Text style={styles.rowValue}>{routeStats.total}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Active Routes</Text>
                <Text style={[styles.rowValue, { color: COLORS.success }]}>{routeStats.active}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Inactive Routes</Text>
                <Text style={[styles.rowValue, { color: COLORS.textSecondary }]}>{routeStats.inactive}</Text>
              </View>

              <Text style={styles.subSectionLabel}>Buses per Route</Text>
              {routes.map((route) => (
                <View key={route.id} style={styles.routeRow}>
                  <Text style={styles.routeRowNumber}>{route.routeNumber}</Text>
                  <Text style={styles.routeRowName}>
                    {route.startPoint} → {route.destination}
                  </Text>
                  <Text style={styles.routeRowBuses}>Buses: {route.buses}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* ---------- BUS STOP SUMMARY ---------- */}
        <View style={styles.card} accessibilityLabel="Bus stop summary section">
          <View style={styles.cardTitleRow}>
            <Ionicons name="location" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>  Bus Stop Summary</Text>
          </View>

          {stopStats.total === 0 ? (
            <Text style={styles.emptyText}>No bus stop data available</Text>
          ) : (
            <>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Total Stops</Text>
                <Text style={styles.rowValue}>{stopStats.total}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Active</Text>
                <Text style={[styles.rowValue, { color: COLORS.success }]}>{stopStats.active}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.rowLabel}>Inactive</Text>
                <Text style={[styles.rowValue, { color: COLORS.textSecondary }]}>{stopStats.inactive}</Text>
              </View>
            </>
          )}
        </View>

        {/* ---------- MOST USED BUS STOPS ---------- */}
        <View style={styles.card} accessibilityLabel="Most used bus stops section">
          <Text style={styles.cardTitle}>Most Used Bus Stops</Text>
          {mostUsedStops.length === 0 ? (
            <Text style={styles.emptyText}>No bus stop usage data available</Text>
          ) : (
            mostUsedStops.map((stop, index) => (
              <View key={stop.id} style={styles.rowBetween}>
                <View style={styles.stopNameBlock}>
                  <Text style={styles.rowLabel}>{index + 1}. {stop.name}</Text>
                  <Text style={styles.stopArea}>{stop.area}</Text>
                </View>
                <Text style={styles.rowValue}>{stop.routes.length} routes</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card} accessibilityLabel="Vettri Payanam eligibility summary">
          <Text style={styles.cardTitle}>Vettri Payanam Eligibility</Text>
          <Text style={styles.emptyText}>
            Records without a verified eligibility value are counted as pending verification.
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Eligible</Text>
            <Text style={[styles.rowValue, { color: COLORS.success }]}>{busStats.eligible} buses</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Not eligible</Text>
            <Text style={styles.rowValue}>{busStats.notEligible} buses</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Pending verification</Text>
            <Text style={[styles.rowValue, { color: COLORS.warning }]}>
              {busStats.pendingVerification} buses
            </Text>
          </View>
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
  content: { padding: 20, paddingBottom: 36 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  sectionHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionHint: { fontSize: 12, color: COLORS.textSecondary, marginTop: -8 },
  insightHero: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 20, marginBottom: 20 },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroEyebrow: { color: '#9DB9D9', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { color: COLORS.card, fontSize: 22, fontWeight: '800', marginTop: 6 },
  heroScore: { alignItems: 'flex-end' },
  heroScoreValue: { color: '#A7F3D0', fontSize: 25, fontWeight: '800' },
  heroScoreLabel: { color: '#C5D4E5', fontSize: 11, marginTop: 1 },
  heroBarTrack: { height: 8, borderRadius: 4, backgroundColor: '#294665', overflow: 'hidden', marginTop: 22 },
  heroBarFill: { height: '100%', borderRadius: 4, backgroundColor: '#55C98A' },
  heroText: { color: '#D8E4F0', fontSize: 12, marginTop: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginTop: 6 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  insightGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  insightCard: { width: '48%', backgroundColor: COLORS.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  insightIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E8F0FA', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  insightIconGreen: { backgroundColor: '#E7F6ED' },
  insightValue: { fontSize: 21, fontWeight: '800', color: COLORS.textPrimary },
  insightLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  attentionCard: { backgroundColor: '#FFFDF8', borderRadius: 14, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#F1D9A7' },
  attentionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#F1E6CF' },
  attentionDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FDE8E7', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  attentionDotAmber: { backgroundColor: '#FEF3C7' },
  attentionCopy: { flex: 1 },
  attentionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  attentionText: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  highlightRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  highlightText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, marginLeft: 10, lineHeight: 19 },
  highlightStrong: { color: COLORS.textPrimary, fontWeight: '700' },
  card: {
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
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  subSectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginTop: 14, marginBottom: 8 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rowLabel: { fontSize: 13, color: COLORS.textSecondary },
  stopNameBlock: { flex: 1 },
  stopArea: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, marginLeft: 16 },
  rowValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '700' },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic' },
  barTrack: {
    height: 10,
    backgroundColor: COLORS.background,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  barFill: { height: '100%', borderRadius: 5 },
  routeRow: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  routeRowNumber: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  routeRowName: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  routeRowBuses: { fontSize: 12, color: COLORS.textPrimary, marginTop: 2 },
});