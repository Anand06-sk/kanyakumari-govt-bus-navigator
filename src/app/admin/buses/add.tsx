// src/app/admin/buses/add.tsx

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
import { useBusContext, BusType, FareCategory, BusStatus } from '../../../store/bus-store';
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

const BUS_TYPES: BusType[] = ['Ordinary', 'Low-Floor Bus', 'Deluxe'];
const FARE_CATEGORIES: FareCategory[] = ['women_free', 'regular_paid'];
const STATUS_OPTIONS: BusStatus[] = ['Active', 'Inactive'];

export default function AddBusScreen() {
  const { addBus } = useBusContext();

  const [busNumber, setBusNumber] = useState('');
  const [busType, setBusType] = useState<BusType | ''>('');
  const [fareCategory, setFareCategory] = useState<FareCategory | ''>('');
  const [fareAmount, setFareAmount] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [stopCount, setStopCount] = useState<number>(0);
  const [stops, setStops] = useState<string[]>([]);
  const [status, setStatus] = useState<BusStatus>('Active');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleStopChange = (index: number, value: string) => {
    setStops((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (errors.stops) {
      setErrors((prev) => ({ ...prev, stops: '' }));
    }
  };

  const handleAddBus = () => {
    const newErrors: { [key: string]: string } = {};

    if (!busNumber.trim()) newErrors.busNumber = 'Please enter the bus number.';
    if (!busType) newErrors.busType = 'Please select the bus type.';
    if (!fareCategory) newErrors.fareCategory = 'Please select the fare category.';
    if (!fareAmount.trim()) {
      newErrors.fareAmount = 'Please enter the fare amount.';
    } else if (Number.isNaN(Number(fareAmount))) {
      newErrors.fareAmount = 'Please enter a valid fare amount.';
    } else if (Number(fareAmount) <= 0) {
      newErrors.fareAmount = 'Fare must be greater than ₹0.';
    }
    if (!startPoint.trim()) newErrors.startPoint = 'Please enter the starting point.';
    if (!destination.trim()) newErrors.destination = 'Please enter the destination.';
    if (!routeNumber.trim()) newErrors.routeNumber = 'Please enter the route number.';

    if (stopCount > 0) {
      const invalidStop = stops.slice(0, stopCount).some((stop) => {
        return !stop.trim();
      });

      if (invalidStop) {
        newErrors.stops = 'Please enter all stop names.';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Alert.alert('Validation Error', 'Please fix all errors above before adding the bus.');
      return;
    }

    addBus({
      busNumber: busNumber.trim().toUpperCase(),
      busType: busType as BusType,
      fareCategory: fareCategory as FareCategory,
      regularFare: Number(fareAmount),
      womenFare: fareCategory === 'women_free' ? 0 : Number(fareAmount),
      startPoint: startPoint.trim(),
      destination: destination.trim(),
      routeNumber: routeNumber.trim().toUpperCase(),
      status,
      stops: stopCount > 0 ? stops.slice(0, stopCount).map((stop) => stop.trim()) : [],
    });

    // Reset form
    setBusNumber('');
    setBusType('');
    setFareCategory('');
    setFareAmount('');
    setStartPoint('');
    setDestination('');
    setRouteNumber('');
    setStopCount(0);
    setStops([]);
    setStatus('Active');
    setErrors({});

    Alert.alert('Bus Added Successfully', 'The bus has been added. Redirecting to buses list...', [
      {
        text: 'OK',
        onPress: () => router.replace('/admin/buses'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Bus</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bus Number</Text>
            <TextInput
              style={[styles.input, errors.busNumber && styles.inputError]}
              placeholder="Enter bus number (e.g. TN-74-1234)"
              placeholderTextColor={COLORS.textSecondary}
              value={busNumber}
              autoCapitalize="characters"
              autoCorrect={false}
              onChangeText={(text) => {
                const formatted = text.toUpperCase();
                setBusNumber(formatted);
                if (errors.busNumber) setErrors((prev) => ({ ...prev, busNumber: '' }));
              }}
              accessibilityLabel="Bus number input"
            />
            {errors.busNumber ? <Text style={styles.errorText}>{errors.busNumber}</Text> : null}
          </View>

          <SelectField
            label="Bus Type"
            value={busType}
            options={BUS_TYPES}
            onSelect={(val) => {
              setBusType(val as BusType);
              if (errors.busType) setErrors((prev) => ({ ...prev, busType: '' }));
            }}
            accessibilityLabel="Bus type selector"
          />
          {errors.busType ? <Text style={styles.errorText}>{errors.busType}</Text> : null}

          <SelectField
            label="Fare Category"
            value={fareCategory === 'women_free' ? 'Women Free' : fareCategory === 'regular_paid' ? 'Regular Paid Service' : ''}
            options={FARE_CATEGORIES.map((category) => category === 'women_free' ? 'Women Free' : 'Regular Paid Service')}
            onSelect={(val) => {
              const nextCategory = val === 'Women Free' ? 'women_free' : 'regular_paid';
              setFareCategory(nextCategory);
              if (errors.fareCategory) setErrors((prev) => ({ ...prev, fareCategory: '' }));
            }}
            accessibilityLabel="Fare category selector"
          />
          {errors.fareCategory ? <Text style={styles.errorText}>{errors.fareCategory}</Text> : null}

          {fareCategory && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{fareCategory === 'women_free' ? 'Regular Fare (₹)' : 'Fare for Everyone (₹)'}</Text>
              <TextInput
                style={[styles.input, errors.fareAmount && styles.inputError]}
                placeholder="Enter fare amount"
                placeholderTextColor={COLORS.textSecondary}
                value={fareAmount}
                onChangeText={(text) => {
                  setFareAmount(text.replace(/[^0-9.]/g, ''));
                  if (errors.fareAmount) setErrors((prev) => ({ ...prev, fareAmount: '' }));
                }}
                keyboardType="decimal-pad"
                accessibilityLabel="Fare amount input"
              />
              <Text style={styles.fareHint}>{fareCategory === 'women_free' ? 'Women Fare: Free' : 'Same fare applies to all passengers.'}</Text>
              {errors.fareAmount ? <Text style={styles.errorText}>{errors.fareAmount}</Text> : null}
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Starting Point</Text>
            <TextInput
              style={[styles.input, errors.startPoint && styles.inputError]}
              placeholder="Enter starting point (e.g. Nagercoil)"
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
              placeholder="Enter destination (e.g. Kanyakumari)"
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
            <Text style={styles.label}>Route Number</Text>
            <TextInput
              style={[styles.input, errors.routeNumber && styles.inputError]}
              placeholder="Enter route number (e.g. KK-01)"
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
            <Text style={styles.label}>Stops</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of stops"
              placeholderTextColor={COLORS.textSecondary}
              value={stopCount === 0 ? '' : String(stopCount)}
              onChangeText={(text) => {
                const numericValue = text.replace(/\D/g, '');
                const nextValue = numericValue === '' ? 0 : Number(numericValue);
                setStopCount(nextValue);
                setStops((prev) =>
                  Array.from({ length: nextValue }, (_, index) => prev[index] ?? '')
                );
                if (errors.stops) setErrors((prev) => ({ ...prev, stops: '' }));
              }}
              keyboardType="number-pad"
              accessibilityLabel="Number of stops input"
            />

            {stopCount > 0 && (
              <View style={styles.stopFields}>
                {Array.from({ length: stopCount }, (_, index) => (
                  <View key={`stop-${index}`} style={styles.stopInputRow}>
                    <Text style={styles.stopLabel}>Stop {index + 1}</Text>
                    <TextInput
                      style={[styles.input, styles.stopInput]}
                      placeholder={`Enter stop ${index + 1}`}
                      placeholderTextColor={COLORS.textSecondary}
                      value={stops[index] ?? ''}
                      onChangeText={(value) => handleStopChange(index, value)}
                      accessibilityLabel={`Stop ${index + 1} input`}
                    />
                  </View>
                ))}
              </View>
            )}

            {errors.stops ? <Text style={styles.errorText}>{errors.stops}</Text> : null}
          </View>

          <SelectField
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onSelect={(val) => setStatus(val as BusStatus)}
            accessibilityLabel="Status selector"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddBus}
            accessibilityLabel="Add bus button"
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Add Bus</Text>
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
  fareHint: { color: COLORS.textSecondary, fontSize: 12, marginTop: 6 },
  stopFields: { marginTop: 12 },
  stopInputRow: { marginBottom: 10 },
  stopLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  stopInput: { marginTop: 0 },
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