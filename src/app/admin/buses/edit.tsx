// src/app/admin/buses/edit.tsx

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
import { useBusContext, BusType, FareCategory, BusStatus } from '../../../store/bus-store';
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

const BUS_TYPES: BusType[] = ['Ordinary', 'Low-Floor Bus', 'Deluxe'];
const FARE_CATEGORIES: FareCategory[] = ['women_free', 'regular_paid'];
const STATUS_OPTIONS: BusStatus[] = ['Active', 'Inactive'];

export default function EditBusScreen() {
  const params = useLocalSearchParams();
  const busId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { getBusById, updateBus, deleteBus } = useBusContext();

  const existingBus = getBusById(busId as string);

  const [busNumber, setBusNumber] = useState(existingBus?.busNumber ?? '');
  const [busType, setBusType] = useState<BusType | ''>(existingBus?.busType ?? '');
  const [fareCategory, setFareCategory] = useState<FareCategory | ''>(existingBus?.fareCategory ?? '');
  const [fareAmount, setFareAmount] = useState(existingBus ? String(existingBus.regularFare) : '');
  const [startPoint, setStartPoint] = useState(existingBus?.startPoint ?? '');
  const [destination, setDestination] = useState(existingBus?.destination ?? '');
  const [routeNumber, setRouteNumber] = useState(existingBus?.routeNumber ?? '');
  const [status, setStatus] = useState<BusStatus>(existingBus?.status ?? 'Active');
  const [stops, setStops] = useState<string[]>(existingBus?.stops ?? []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!existingBus) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back button" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Bus</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Bus not found.</Text>
          <Text style={[styles.notFoundText, { fontSize: 12, marginTop: 8 }]}>(ID: {busId || 'unknown'})</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSaveChanges = () => {
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

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    updateBus(existingBus.id, {
      busNumber: busNumber.trim(),
      busType: busType as BusType,
      fareCategory: fareCategory as FareCategory,
      regularFare: Number(fareAmount),
      womenFare: fareCategory === 'women_free' ? 0 : Number(fareAmount),
      startPoint: startPoint.trim(),
      destination: destination.trim(),
      routeNumber: routeNumber.trim(),
      status,
      stops,
    });

    Alert.alert('Bus Updated Successfully', undefined, [
      {
        text: 'OK',
        onPress: () => router.replace('/admin/buses'),
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Bus?',
      'Are you sure you want to delete this bus?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBus(existingBus.id);
            Alert.alert('Deleted', 'Bus deleted successfully.', [
              {
                text: 'OK',
                onPress: () => router.replace('/admin/buses'),
              },
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
        <Text style={styles.headerTitle}>Edit Bus</Text>
        <TouchableOpacity onPress={handleDelete} accessibilityLabel="Delete bus button" accessibilityRole="button">
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
            <Text style={styles.label}>Bus Number</Text>
            <TextInput
              style={[styles.input, errors.busNumber && styles.inputError]}
              placeholder="Enter bus number"
              placeholderTextColor={COLORS.textSecondary}
              value={busNumber}
              onChangeText={(text) => {
                setBusNumber(text);
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
              setFareCategory(val === 'Women Free' ? 'women_free' : 'regular_paid');
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

          <SelectField
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onSelect={(val) => setStatus(val as BusStatus)}
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
  fareHint: { color: COLORS.textSecondary, fontSize: 12, marginTop: 6 },
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