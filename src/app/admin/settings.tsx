import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const COLORS = { primary: '#0B1F3A', secondary: '#1565C0', background: '#F5F7FA', card: '#FFFFFF', textPrimary: '#172033', textSecondary: '#667085', success: '#2E7D32', border: '#D9DEE7' };

export default function AdminSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()} style={styles.headerButton} accessibilityLabel="Go back button" accessibilityRole="button"><Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} /></TouchableOpacity><Text style={styles.headerTitle}>Settings</Text><View style={styles.headerButton} /></View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.card}>
          <SettingRow icon="notifications-outline" title="Notifications" subtitle="Receive operational updates" value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          <SettingRow icon="volume-high-outline" title="Sound" subtitle="Play sounds for important actions" value={soundEnabled} onValueChange={setSoundEnabled} last />
        </View>

        <Text style={styles.sectionTitle}>Application Information</Text>
        <View style={styles.card}>
          <InfoRow label="App Name" value="BusTracker" />
          <InfoRow label="Purpose" value="Kanniyakumari Government Bus Navigation" />
          <InfoRow label="Version" value="1.0.0" />
          <InfoRow label="Platform" value="Mobile Application" last />
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <ActionRow icon="help-circle-outline" title="Help & Support" onPress={() => router.push('/help')} />
          <ActionRow icon="information-circle-outline" title="About BusTracker" onPress={() => Alert.alert('BusTracker', 'Kanniyakumari Government Bus Navigation Application\n\nThis application helps users find government buses, routes and bus stops across Kanniyakumari district.\n\nAdmin Panel: Used to manage buses, routes, bus stops and view reports.')} last />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ icon, title, subtitle, value, onValueChange, last = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; value: boolean; onValueChange: (value: boolean) => void; last?: boolean }) {
  return <View style={[styles.settingRow, last ? null : styles.divider]}><View style={styles.settingIcon}><Ionicons name={icon} size={20} color={COLORS.secondary} /></View><View style={styles.settingCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowSubtitle}>{subtitle}</Text></View><Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#D9DEE7', true: '#9DB9D9' }} thumbColor={value ? COLORS.secondary : '#F5F7FA'} accessibilityLabel={`${title} toggle`} /></View>;
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.infoRow, last ? null : styles.divider]}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

function ActionRow({ icon, title, onPress, last = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; onPress: () => void; last?: boolean }) {
  return <TouchableOpacity style={[styles.actionRow, last ? null : styles.divider]} onPress={onPress} accessibilityRole="button" accessibilityLabel={`${title} button`}><Ionicons name={icon} size={21} color={COLORS.secondary} /><Text style={styles.actionTitle}>{title}</Text><Ionicons name="chevron-forward" size={19} color={COLORS.textSecondary} /></TouchableOpacity>;
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: COLORS.background }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border }, headerButton: { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }, headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary }, content: { padding: 20, paddingBottom: 40 }, sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10, textTransform: 'capitalize' }, card: { backgroundColor: COLORS.card, borderRadius: 14, paddingHorizontal: 16, marginBottom: 22, borderWidth: 1, borderColor: COLORS.border }, divider: { borderBottomWidth: 1, borderBottomColor: COLORS.border }, settingRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center' }, settingIcon: { width: 35, height: 35, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F0FA', marginRight: 11 }, settingCopy: { flex: 1 }, rowTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' }, rowSubtitle: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3 }, infoRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, infoLabel: { color: COLORS.textSecondary, fontSize: 12, flex: 0.8 }, infoValue: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600', textAlign: 'right', flex: 1.2 }, actionRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center' }, actionTitle: { flex: 1, color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', marginLeft: 12 } });
