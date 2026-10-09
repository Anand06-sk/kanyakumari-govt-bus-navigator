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
import {
  useBusContext,
  BusType,
  FareCategory,
  BusStatus,
  SchemeEligibility,
  getSchemeEligibility,
} from '../../../store/bus-store';
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
  warning: '#B45309',
  border: '#D9DEE7',
};

const BUS_TYPES: BusType[] = ['Ordinary', 'Low-Floor Bus', 'Deluxe'];
const STATUS_OPTIONS: BusStatus[] = ['Active', 'Inactive'];
const ELIGIBILITY_LABELS: Record<SchemeEligibility, string> = {
  eligible: 'Eligible',
  not_eligible: 'Not eligible',
  pending_verification: 'Pending verification',
};
const ELIGIBILITY_OPTIONS = Object.values(ELIGIBILITY_LABELS);

export default function EditBusScreen() {
  const params = useLocalSearchParams();
  const busId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { getBusById, updateBus, deleteBus } = useBusContext();

  const existingBus = getBusById(busId as string);

  const [busNumber, setBusNumber] = useState(existingBus?.busNumber ?? '');
  const [busType, setBusType] = useState<BusType | ''>(existingBus?.busType ?? '');
  const [schemeEligibility, setSchemeEligibility] = useState<SchemeEligibility>(
    existingBus ? getSchemeEligibility(existingBus) : 'pending_verification'
  );
  const [fareCategory, setFareCategory] = useState<FareCategory>(
    existingBus && getSchemeEligibility(existingBus) === 'eligible'
      ? 'women_free'
      : existingBus?.fareCategory ?? 'regular_paid'
  );
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
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/admin/buses');
              }
            }}
            accessibilityLabel="Back button"
            accessibilityRole="button"
          >
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
    if (!fareAmount.trim()) {
      newErrors.fareAmount = 'Please enter the fare amount.';
    } else if (!Number.isFinite(Number(fareAmount))) {
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
      schemeEligibility,
      fareCategory,
      regularFare: Number(fareAmount),
      womenFare: fareCategory === 'women_free' ? 0 : Number(fareAmount),
      startPoint: startPoint.trim(),
      destination: destination.trim(),
      routeNumber: routeNumber.trim(),
      status,
      stops,
    });

    router.replace('/admin/buses');
  };

  const handleDelete = () => {
    const removeBus = () => {
      deleteBus(existingBus.id);
      router.replace('/admin/buses');
    };

    if (Platform.OS === 'web') {
      if (globalThis.confirm(`Delete bus ${existingBus.busNumber}?`)) {
        removeBus();
      }
      return;
    }

    Alert.alert(
      'Delete Bus?',
      'Are you sure you want to delete this bus?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: removeBus,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/admin/buses');
            }
          }}
          accessibilityLabel="Back button"
          accessibilityRole="button"
        >
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
            label="Vettri Payanam Scheme Eligibility"
            value={ELIGIBILITY_LABELS[schemeEligibility]}
            options={ELIGIBILITY_OPTIONS}
            onSelect={(val) => {
              const nextEligibility = (Object.keys(ELIGIBILITY_LABELS) as SchemeEligibility[])
                .find((eligibility) => ELIGIBILITY_LABELS[eligibility] === val);
              if (nextEligibility) {
                setSchemeEligibility(nextEligibility);
                setFareCategory(nextEligibility === 'eligible' ? 'women_free' : 'regular_paid');
              }
            }}
            accessibilityLabel="Vettri Payanam scheme eligibility selector"
          />
          {schemeEligibility === 'pending_verification' ? (
            <View style={styles.eligibilityWarning} accessibilityRole="alert">
              <Ionicons name="alert-circle-outline" size={18} color={COLORS.warning} />
              <Text style={styles.eligibilityWarningText}>
                Eligibility is pending verification. Confirm it against applicable official scheme rules before marking it eligible.
              </Text>
            </View>
          ) : null}

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
              <Text style={styles.fareHint}>
                {fareCategory === 'women_free'
                  ? 'Women’s fare is free. Enter the regular fare.'
                  : 'Fare applies to all passengers.'}
              </Text>
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
  eligibilityWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  eligibilityWarningText: { flex: 1, color: COLORS.warning, fontSize: 12, lineHeight: 18, marginLeft: 8 },
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