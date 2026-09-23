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
import { useStopContext } from '../../../store/stop-store';
import SelectField from '../../../components/admin/select-field';
import StopsEditor from '../../../components/admin/stops-editor';

const COLORS = {
  primary: '#0B1F3A',
  secondary: '#1565C0',
  background: '#F5F7FA',
  card: '#FFFFFF',
  textPrimary: '#172033',
  textSecondary: '#667085',
  error: '#D32F2F',
  border: '#D9DEE7',
};

const STATUS_OPTIONS: RouteStatus[] = ['Active', 'Inactive'];

export default function AddRouteScreen() {
  const { stopId } = useLocalSearchParams<{ stopId?: string }>();
  const { routes, addRoute } = useRouteContext();
  const { getStopById, updateStop } = useStopContext();
  const [routeNumber, setRouteNumber] = useState('');
  const [routeName, setRouteName] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [busesText, setBusesText] = useState('');
  const [status, setStatus] = useState<RouteStatus>('Active');
  const [stops, setStops] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const normalizedRouteNumber = routeNumber.trim().toUpperCase();
    const newErrors: Record<string, string> = {};

    if (!normalizedRouteNumber) newErrors.routeNumber = 'Please enter the route number.';
    if (routes.some((route) => route.routeNumber === normalizedRouteNumber)) {
      newErrors.routeNumber = 'Route number already exists.';
    }
    if (!routeName.trim()) newErrors.routeName = 'Please enter the route name.';
    if (!startPoint.trim()) newErrors.startPoint = 'Please enter the starting point.';
    if (!destination.trim()) newErrors.destination = 'Please enter the destination.';
    if (!busesText.trim() || !Number.isInteger(Number(busesText)) || Number(busesText) < 0) {
      newErrors.buses = 'Please enter a valid number of buses.';
    }
    if (stops.length === 0) newErrors.stops = 'Please add at least one route stop.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    addRoute({
      routeNumber: normalizedRouteNumber,
      routeName: routeName.trim(),
      startPoint: startPoint.trim(),
      destination: destination.trim(),
      buses: Number(busesText),
      stops,
      status,
    });

    const associatedStop = getStopById(stopId);
    if (associatedStop && !associatedStop.routes.includes(normalizedRouteNumber)) {
      updateStop(associatedStop.id, {
        ...associatedStop,
        routes: [...associatedStop.routes, normalizedRouteNumber],
      });
    }

    Alert.alert('Route Added Successfully', undefined, [
      {
        text: 'OK',
        onPress: () =>
          stopId
            ? router.replace({ pathname: '/admin/stops/edit', params: { id: stopId } })
            : router.replace('./'),
      },
    ]);
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    errorKey: string,
    placeholder: string,
    keyboardType?: 'default' | 'numeric'
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[errorKey] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          if (errors[errorKey]) setErrors((previous) => ({ ...previous, [errorKey]: '' }));
        }}
        keyboardType={keyboardType}
        accessibilityLabel={`${label} input`}
      />
      {errors[errorKey] ? <Text style={styles.errorText}>{errors[errorKey]}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Route</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
          {renderInput('Route Number', routeNumber, setRouteNumber, 'routeNumber', 'Enter route number')}
          {renderInput('Route Name', routeName, setRouteName, 'routeName', 'Enter route name')}
          {renderInput('Starting Point', startPoint, setStartPoint, 'startPoint', 'Enter starting point')}
          {renderInput('Destination', destination, setDestination, 'destination', 'Enter destination')}
          {renderInput('Number of Buses', busesText, setBusesText, 'buses', 'Enter number of buses', 'numeric')}

          <SelectField
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onSelect={(value) => setStatus(value as RouteStatus)}
            accessibilityLabel="Route status selector"
          />

          <StopsEditor stops={stops} onChange={setStops} />
          {errors.stops ? <Text style={styles.errorText}>{errors.stops}</Text> : null}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            accessibilityLabel="Save new route button"
            accessibilityRole="button"
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.card} />
            <Text style={styles.saveButtonText}>Save Route</Text>
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
  headerSpacer: { width: 24 },
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
    backgroundColor: COLORS.card,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 5 },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
  },
  saveButtonText: { color: COLORS.card, fontSize: 14, fontWeight: '700' },
});
