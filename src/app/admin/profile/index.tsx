import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAdminContext } from '../../../store/admin-store';

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

export default function AdminProfileScreen() {
  const { profile } = useAdminContext();

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.replace('/admin/login') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton} accessibilityLabel="Go back button" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Administrator Profile</Text>
        <TouchableOpacity onPress={() => router.push('/admin/profile/edit')} style={styles.headerButton} accessibilityLabel="Edit profile button" accessibilityRole="button">
          <Ionicons name="create-outline" size={23} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHero}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Text></View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileRole}>Administrator</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        <Text style={styles.sectionTitle}>Profile information</Text>
        <View style={styles.card}>
          <InfoRow icon="person-outline" label="Full Name" value={profile.name} />
          <InfoRow icon="mail-outline" label="Email" value={profile.email} />
          <InfoRow icon="call-outline" label="Phone" value={profile.phone} />
          <InfoRow icon="shield-checkmark-outline" label="Role" value="Administrator" />
          <InfoRow icon="checkmark-circle-outline" label="Account Status" value={profile.status} valueColor={COLORS.success} last />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <ActionRow icon="create-outline" title="Edit Profile" subtitle="Update your contact information" onPress={() => router.push('/admin/profile/edit')} />
          <ActionRow icon="lock-closed-outline" title="Change Password" subtitle="Update your local demo password" onPress={() => router.push('/admin/profile/edit')} last />
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <ActionRow icon="settings-outline" title="App Settings" subtitle="Notifications, sound and support" onPress={() => router.push('/admin/settings')} last />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout} accessibilityLabel="Logout button" accessibilityRole="button">
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, valueColor, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; valueColor?: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last ? null : styles.divider]}>
      <Ionicons name={icon} size={19} color={COLORS.secondary} />
      <View style={styles.infoCopy}><Text style={styles.infoLabel}>{label}</Text><Text style={[styles.infoValue, valueColor ? { color: valueColor } : null]}>{value}</Text></View>
    </View>
  );
}

function ActionRow({ icon, title, subtitle, onPress, last = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.actionRow, last ? null : styles.divider]} onPress={onPress} accessibilityRole="button" accessibilityLabel={`${title} button`}>
      <View style={styles.actionIcon}><Ionicons name={icon} size={20} color={COLORS.secondary} /></View>
      <View style={styles.actionCopy}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionSubtitle}>{subtitle}</Text></View>
      <Ionicons name="chevron-forward" size={19} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerButton: { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 20, paddingBottom: 40 },
  profileHero: { alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 16, padding: 24, marginBottom: 24 },
  avatar: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#DCEBFA', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 25, fontWeight: '800', color: COLORS.primary },
  profileName: { color: COLORS.card, fontSize: 22, fontWeight: '800' },
  profileRole: { color: '#BFD1E5', fontSize: 13, marginTop: 4, textAlign: 'center' },
  profileEmail: { color: '#DCE8F3', fontSize: 12, marginTop: 10, textAlign: 'center' },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 10, textTransform: 'capitalize' },
  card: { backgroundColor: COLORS.card, borderRadius: 14, paddingHorizontal: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  divider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoCopy: { flex: 1, marginLeft: 12 },
  infoLabel: { color: COLORS.textSecondary, fontSize: 11 },
  infoValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', marginTop: 3 },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  actionIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8F0FA', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  actionCopy: { flex: 1 },
  actionTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  actionSubtitle: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 50, borderRadius: 12, borderWidth: 1, borderColor: '#F1B8B8', backgroundColor: '#FFF7F7', marginTop: 4 },
  logoutText: { color: COLORS.error, fontSize: 14, fontWeight: '700', marginLeft: 8 },
});
