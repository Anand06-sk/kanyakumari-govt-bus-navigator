// src/app/admin/stops/edit.tsx

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
import { router, useLocalSearchParams } from 'expo-router';
import { useStopContext, StopStatus } from '../../../store/stop-store';
import { useRouteContext } from '../../../store/route-store';
import SelectField from '../../../components/admin/select-field';

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

export default function EditStopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getStopById, updateStop, deleteStop, isDuplicateName } = useStopContext();
  const { routes } = useRouteContext();

  const existingStop = getStopById(id);

  const [name, setName] = useState(existingStop?.name ?? '');
  const [area, setArea] = useState(existingStop?.area ?? '');
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(existingStop?.routes ?? []);
  const [status, setStatus] = useState<StopStatus>(existingStop?.status ?? 'Active');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!existingStop) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Bus Stop</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Bus stop not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const toggleRoute = (routeNumber: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(routeNumber) ? prev.filter((r) => r !== routeNumber) : [...prev, routeNumber]
    );
    if (errors.routes) setErrors((prev) => ({ ...prev, routes: '' }));
  };

  const handleSaveChanges = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter the bus stop name.';
    } else if (isDuplicateName(name.trim(), existingStop.id)) {
      newErrors.name = 'Bus stop already exists.';
    }
    if (!area.trim()) newErrors.area = 'Please enter the area.';
    if (selectedRoutes.length === 0) newErrors.routes = 'Please select at least one route.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    updateStop(existingStop.id, {
      name: name.trim(),
      area: area.trim(),
      routes: selectedRoutes,
      status,
    });

    Alert.alert('Bus Stop Updated Successfully', undefined, [
      { text: 'OK', onPress: () => router.replace('./') },
    ]);
  };

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
            deleteStop(existingStop.id);
            Alert.alert('Deleted', 'Bus stop deleted successfully.', [
              { text: 'OK', onPress: () => router.replace('./') },
            ]);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Bus Stop</Text>
        <TouchableOpacity onPress={handleDelete} accessibilityLabel="Delete bus stop button" accessibilityRole="button">
          <Ionicons name="trash-outline" size={22} color={COLORS.error} />
        </TouchableOpacity>
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
              placeholder="Enter bus stop name"
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
              placeholder="Enter area or location"
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
            <View style={styles.routesHeader}>
              <Text style={styles.label}>Associated Routes</Text>
              <TouchableOpacity
                style={styles.addRouteButton}
                onPress={() =>
                  router.push({ pathname: '/admin/stops/add-route', params: { stopId: existingStop.id } })
                }
                accessibilityLabel="Add new associated route button"
                accessibilityRole="button"
              >
                <Ionicons name="add" size={16} color={COLORS.card} />
                <Text style={styles.addRouteButtonText}>Add New Route</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.routesBox}>
              {routes.length === 0 ? (
                <Text style={styles.noRoutesText}>No routes available.</Text>
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
            onPress={handleSaveChanges}
            accessibilityLabel="Save changes button"
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Save Changes</Text>
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
  routesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  addRouteButtonText: { color: COLORS.card, fontSize: 12, fontWeight: '700' },
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
  notFoundContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 14, color: COLORS.textSecondary },
});