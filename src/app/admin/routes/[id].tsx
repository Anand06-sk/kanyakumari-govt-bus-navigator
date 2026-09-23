// src/app/admin/routes/edit.tsx

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
import { useRouteContext, RouteStatus } from '../../../store/route-store';
import SelectField from '../../../components/admin/select-field';
import StopsEditor from '../../../components/admin/stops-editor';

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

const STATUS_OPTIONS: RouteStatus[] = ['Active', 'Inactive'];

export default function EditRouteScreen() {
  const params = useLocalSearchParams();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { getRouteById, updateRoute, deleteRoute } = useRouteContext();

  const existingRoute = getRouteById(routeId as string);

  const [routeNumber, setRouteNumber] = useState(existingRoute?.routeNumber ?? '');
  const [routeName, setRouteName] = useState(existingRoute?.routeName ?? '');
  const [startPoint, setStartPoint] = useState(existingRoute?.startPoint ?? '');
  const [destination, setDestination] = useState(existingRoute?.destination ?? '');
  const [busesText, setBusesText] = useState(existingRoute ? String(existingRoute.buses) : '');
  const [status, setStatus] = useState<RouteStatus>(existingRoute?.status ?? 'Active');
  const [stops, setStops] = useState<string[]>(existingRoute?.stops ?? []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!existingRoute) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Route</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Route not found.</Text>
          <Text style={[styles.notFoundText, { fontSize: 12, marginTop: 8 }]}>(ID: {routeId || 'unknown'})</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSaveChanges = () => {
    const newErrors: { [key: string]: string } = {};

    if (!routeNumber.trim()) newErrors.routeNumber = 'Please enter the route number.';
    if (!routeName.trim()) newErrors.routeName = 'Please enter the route name.';
    if (!startPoint.trim()) newErrors.startPoint = 'Please enter the starting point.';
    if (!destination.trim()) newErrors.destination = 'Please enter the destination.';
    if (!busesText.trim() || isNaN(Number(busesText))) {
      newErrors.buses = 'Please enter the number of buses.';
    }
    if (stops.length === 0) newErrors.stops = 'Please add at least one route stop.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Alert.alert('Validation Error', 'Please fix all errors above before saving.');
      return;
    }

    updateRoute(existingRoute.id, {
      routeNumber: routeNumber.trim().toUpperCase(),
      routeName: routeName.trim(),
      startPoint: startPoint.trim(),
      destination: destination.trim(),
      buses: Number(busesText),
      stops,
      status,
    });

    Alert.alert('Route Updated Successfully', 'Changes saved. Redirecting to routes list...', [
      { text: 'OK', onPress: () => router.replace('/admin/dashboard') },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Route?',
      'Are you sure you want to delete this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteRoute(existingRoute.id);
            Alert.alert('Deleted', 'Route deleted successfully.', [
              { text: 'OK', onPress: () => router.replace('/admin/dashboard') },
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
        <Text style={styles.headerTitle}>Edit Route</Text>
        <TouchableOpacity onPress={handleDelete} accessibilityLabel="Delete route button" accessibilityRole="button">
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
            <Text style={styles.label}>Route Number</Text>
            <TextInput
              style={[styles.input, errors.routeNumber && styles.inputError]}
              placeholder="Enter route number"
              placeholderTextColor={COLORS.textSecondary}
              value={routeNumber}
              onChangeText={(text) => {
                setRouteNumber(text);
                if (errors.routeNumber) setErrors((prev) => ({ ...prev, routeNumber: '' }));
              }}
              accessibilityLabel="Route number input"
            />
            {errors.routeNumber ? <Text style={styles.errorText}>{errors.routeNumber}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Route Name</Text>
            <TextInput
              style={[styles.input, errors.routeName && styles.inputError]}
              placeholder="Enter route name"
              placeholderTextColor={COLORS.textSecondary}
              value={routeName}
              onChangeText={(text) => {
                setRouteName(text);
                if (errors.routeName) setErrors((prev) => ({ ...prev, routeName: '' }));
              }}
              accessibilityLabel="Route name input"
            />
            {errors.routeName ? <Text style={styles.errorText}>{errors.routeName}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Starting Point</Text>
            <TextInput
              style={[styles.input, errors.startPoint && styles.inputError]}
              placeholder="Enter starting point"
              placeholderTextColor={COLORS.textSecondary}
              value={startPoint}
              onChangeText={(text) => {
                setStartPoint(text);
                if (errors.startPoint) setErrors((prev) => ({ ...prev, startPoint: '' }));
              }}
              accessibilityLabel="Starting point input"
            />
            {errors.startPoint ? <Text style={styles.errorText}>{errors.startPoint}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Destination</Text>
            <TextInput
              style={[styles.input, errors.destination && styles.inputError]}
              placeholder="Enter destination"
              placeholderTextColor={COLORS.textSecondary}
              value={destination}
              onChangeText={(text) => {
                setDestination(text);
                if (errors.destination) setErrors((prev) => ({ ...prev, destination: '' }));
              }}
              accessibilityLabel="Destination input"
            />
            {errors.destination ? <Text style={styles.errorText}>{errors.destination}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Number of Buses</Text>
            <TextInput
              style={[styles.input, errors.buses && styles.inputError]}
              placeholder="Enter number of buses"
              placeholderTextColor={COLORS.textSecondary}
              value={busesText}
              onChangeText={(text) => {
                setBusesText(text);
                if (errors.buses) setErrors((prev) => ({ ...prev, buses: '' }));
              }}
              keyboardType="numeric"
              accessibilityLabel="Number of buses input"
            />
            {errors.buses ? <Text style={styles.errorText}>{errors.buses}</Text> : null}
          </View>

          <SelectField
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onSelect={(val) => setStatus(val as RouteStatus)}
            accessibilityLabel="Status selector"
          />

          <StopsEditor stops={stops} onChange={setStops} />
          {errors.stops ? <Text style={styles.errorText}>{errors.stops}</Text> : null}

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