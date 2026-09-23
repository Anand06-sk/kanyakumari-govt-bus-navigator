import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAdminContext } from '../../../store/admin-store';

const COLORS = { primary: '#0B1F3A', secondary: '#1565C0', background: '#F5F7FA', card: '#FFFFFF', textPrimary: '#172033', textSecondary: '#667085', success: '#2E7D32', error: '#D32F2F', border: '#D9DEE7' };

function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidPhone(phone: string) { return /^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(phone.replace(/[()]/g, '').trim().replace(/\s+/g, ' ')); }

type Errors = { name?: string; email?: string; phone?: string; currentPassword?: string; newPassword?: string; confirmPassword?: string };

export default function EditAdminProfileScreen() {
  const { profile, updateProfile } = useAdminContext();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const saveProfile = () => {
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = 'Please enter your name.';
    if (!email.trim()) nextErrors.email = 'Please enter your email.';
    else if (!isValidEmail(email.trim())) nextErrors.email = 'Please enter a valid email address.';
    if (!phone.trim()) nextErrors.phone = 'Please enter your phone number.';
    else if (!isValidPhone(phone)) nextErrors.phone = 'Please enter a valid Indian phone number.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    updateProfile({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() });
    Alert.alert('Profile Updated', 'Your profile information was updated locally.', [{ text: 'OK', onPress: () => router.replace('/admin/profile' as any) }]);
  };

  const changePassword = () => {
    const nextErrors: Errors = {};
    if (!currentPassword) nextErrors.currentPassword = 'Please enter your current password.';
    if (!newPassword) nextErrors.newPassword = 'Please enter a new password.';
    else if (newPassword.length < 6) nextErrors.newPassword = 'Password must be at least 6 characters.';
    if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your new password.';
    else if (newPassword !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    setErrors((current) => ({ ...current, ...nextErrors, ...(Object.keys(nextErrors).length === 0 ? { currentPassword: undefined, newPassword: undefined, confirmPassword: undefined } : {}) }));
    if (Object.keys(nextErrors).length > 0) return;
    Alert.alert('Password Updated', 'Password updated successfully. This frontend demo does not save passwords to a server.', [{ text: 'OK', onPress: () => router.replace('/admin/profile' as any) }]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}><TouchableOpacity onPress={() => router.back()} style={styles.headerButton} accessibilityLabel="Go back button" accessibilityRole="button"><Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} /></TouchableOpacity><Text style={styles.headerTitle}>Edit Profile</Text><View style={styles.headerButton} /></View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>Keep your admin contact information up to date.</Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Profile details</Text>
            <Field label="Full Name" icon="person-outline" value={name} onChangeText={(value) => { setName(value); setErrors((current) => ({ ...current, name: undefined })); }} error={errors.name} placeholder="Enter your full name" />
            <Field label="Email" icon="mail-outline" value={email} onChangeText={(value) => { setEmail(value); setErrors((current) => ({ ...current, email: undefined })); }} error={errors.email} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" />
            <Field label="Phone Number" icon="call-outline" value={phone} onChangeText={(value) => { setPhone(value); setErrors((current) => ({ ...current, phone: undefined })); }} error={errors.phone} placeholder="+91 98765 43210" keyboardType="phone-pad" last />
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={saveProfile} accessibilityRole="button" accessibilityLabel="Save changes button"><Ionicons name="checkmark-circle-outline" size={20} color={COLORS.card} /><Text style={styles.primaryButtonText}>Save Changes</Text></TouchableOpacity>

          <Text style={styles.sectionTitle}>Change password</Text>
          <View style={styles.card}>
            <Text style={styles.helper}>Frontend demo only. No password is sent to a server.</Text>
            <PasswordField label="Current Password" value={currentPassword} onChangeText={setCurrentPassword} visible={showCurrent} onToggle={() => setShowCurrent((value) => !value)} error={errors.currentPassword} />
            <PasswordField label="New Password" value={newPassword} onChangeText={setNewPassword} visible={showNew} onToggle={() => setShowNew((value) => !value)} error={errors.newPassword} />
            <PasswordField label="Confirm New Password" value={confirmPassword} onChangeText={setConfirmPassword} visible={showConfirm} onToggle={() => setShowConfirm((value) => !value)} error={errors.confirmPassword} last />
          </View>
          <TouchableOpacity style={styles.secondaryButton} onPress={changePassword} accessibilityRole="button" accessibilityLabel="Update password button"><Ionicons name="lock-closed-outline" size={19} color={COLORS.secondary} /><Text style={styles.secondaryButtonText}>Update Password</Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, icon, value, onChangeText, error, placeholder, keyboardType, autoCapitalize = 'words', last = false }: { label: string; icon: keyof typeof Ionicons.glyphMap; value: string; onChangeText: (value: string) => void; error?: string; placeholder: string; keyboardType?: 'default' | 'email-address' | 'phone-pad'; autoCapitalize?: 'none' | 'words'; last?: boolean }) {
  return <View style={[styles.field, last ? null : styles.fieldSpacing]}><Text style={styles.label}>{label}</Text><View style={[styles.inputWrap, error ? styles.inputError : null]}><Ionicons name={icon} size={19} color={COLORS.textSecondary} /><TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={COLORS.textSecondary} keyboardType={keyboardType} autoCapitalize={autoCapitalize} autoCorrect={false} /></View>{error ? <Text style={styles.errorText}>{error}</Text> : null}</View>;
}

function PasswordField({ label, value, onChangeText, visible, onToggle, error, last = false }: { label: string; value: string; onChangeText: (value: string) => void; visible: boolean; onToggle: () => void; error?: string; last?: boolean }) {
  return <View style={[styles.field, last ? null : styles.fieldSpacing]}><Text style={styles.label}>{label}</Text><View style={[styles.inputWrap, error ? styles.inputError : null]}><Ionicons name="lock-closed-outline" size={19} color={COLORS.textSecondary} /><TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder="Enter password" placeholderTextColor={COLORS.textSecondary} secureTextEntry={!visible} autoCapitalize="none" /><TouchableOpacity onPress={onToggle} accessibilityRole="button" accessibilityLabel={visible ? `Hide ${label}` : `Show ${label}`}><Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} /></TouchableOpacity></View>{error ? <Text style={styles.errorText}>{error}</Text> : null}</View>;
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: COLORS.background }, flex: { flex: 1 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border }, headerButton: { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }, headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary }, content: { padding: 20, paddingBottom: 44 }, intro: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }, card: { backgroundColor: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border }, sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 }, helper: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 14, lineHeight: 18 }, field: {}, fieldSpacing: { marginBottom: 14 }, label: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 7 }, inputWrap: { minHeight: 48, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 13, backgroundColor: '#FBFCFE' }, inputError: { borderColor: COLORS.error }, input: { flex: 1, color: COLORS.textPrimary, fontSize: 14, marginLeft: 10, paddingVertical: 10 }, errorText: { color: COLORS.error, fontSize: 11, marginTop: 5 }, primaryButton: { minHeight: 50, borderRadius: 11, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }, primaryButtonText: { color: COLORS.card, fontWeight: '700', fontSize: 14, marginLeft: 8 }, secondaryButton: { minHeight: 50, borderRadius: 11, borderWidth: 1, borderColor: COLORS.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, secondaryButtonText: { color: COLORS.secondary, fontWeight: '700', fontSize: 14, marginLeft: 8 } });
