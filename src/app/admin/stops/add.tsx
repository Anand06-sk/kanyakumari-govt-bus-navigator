// src/app/admin/stops/add.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useStopContext, StopStatus } from '../../../store/stop-store';
import { useRouteContext } from '../../../store/route-store';
import SelectField from '../../../../components/admin/select-field';

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

const STATUS_OPTIONS: StopStatus[] = ['Active', 'Inactive'];

export default function AddStopScreen() {
  const { addStop, isDuplicateName } = useStopContext();
  const { routes } = useRouteContext();

  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [status, setStatus] = useState<StopStatus>('Active');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleRoute = (routeNumber: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(routeNumber) ? prev.filter((r) => r !== routeNumber) : [...prev, routeNumber]
    );
    if (errors.routes) setErrors((prev) => ({ ...prev, routes: '' }));
  };

  const handleAddStop = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter the bus stop name.';
    } else if (isDuplicateName(name.trim())) {
      newErrors.name = 'Bus stop already exists.';
    }
    if (!area.trim()) newErrors.area = 'Please enter the area.';
    if (selectedRoutes.length === 0) newErrors.routes = 'Please select at least one route.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    addStop({
      name: name.trim(),
      area: area.trim(),
      routes: selectedRoutes,
      status,
    });

    Alert.alert('Bus Stop Added Successfully', undefined, [
      { text: 'OK', onPress: () => router.replace('./') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Bus Stop</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bus Stop Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter bus stop name (e.g. Nagercoil)"
              placeholderTextColor={COLORS.textSecondary}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              accessibilityLabel="Bus stop name input"
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Area / Location</Text>
            <TextInput
              style={[styles.input, errors.area && styles.inputError]}
              placeholder="Enter area or location (e.g. Nagercoil)"
              placeholderTextColor={COLORS.textSecondary}
              value={area}
              onChangeText={(text) => {
                setArea(text);
                if (errors.area) setErrors((prev) => ({ ...prev, area: '' }));
              }}
              accessibilityLabel="Area or location input"
            />
            {errors.area ? <Text style={styles.errorText}>{errors.area}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Associated Routes</Text>
            <View style={styles.routesBox}>
              {routes.length === 0 ? (
                <Text style={styles.noRoutesText}>
                  No routes available yet. Add a route in Route Management first.
                </Text>
              ) : (
                routes.map((route) => {
                  const isSelected = selectedRoutes.includes(route.routeNumber);
                  return (
                    <TouchableOpacity
                      key={route.id}
                      style={styles.routeCheckRow}
                      onPress={() => toggleRoute(route.routeNumber)}
                      accessibilityLabel={`Select route ${route.routeNumber}`}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                    >
                      <Ionicons
                        name={isSelected ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={isSelected ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text style={styles.routeCheckText}>
                        {'  '}
                        {route.routeNumber} — {route.routeName}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
            {errors.routes ? <Text style={styles.errorText}>{errors.routes}</Text> : null}
          </View>

          <SelectField
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onSelect={(val) => setStatus(val as StopStatus)}
            accessibilityLabel="Status selector"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddStop}
            accessibilityLabel="Add bus stop button"
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Add Bus Stop</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
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
  formContent: { padding: 20 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  routesBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    padding: 12,
  },
  routeCheckRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  routeCheckText: { fontSize: 13, color: COLORS.textPrimary },
  noRoutesText: { fontSize: 13, color: COLORS.textSecondary },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 30,
  },
  submitButtonText: { color: COLORS.card, fontSize: 16, fontWeight: '700' },
});