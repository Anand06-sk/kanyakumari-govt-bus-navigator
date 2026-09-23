import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#0B1F3A',
  secondary: '#1565C0',
  textPrimary: '#172033',
  textSecondary: '#667085',
  border: '#D9DEE7',
  background: '#F5F7FA',
  card: '#FFFFFF',
};

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  accessibilityLabel?: string;
};

export default function SelectField({ label, value, options, onSelect, accessibilityLabel }: SelectFieldProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selector}
        activeOpacity={0.8}
        onPress={() => setOpen((current) => !current)}
        accessibilityLabel={accessibilityLabel ?? `${label} selector`}
        accessibilityRole="button"
      >
        <Text style={[styles.selectorText, !value && styles.placeholderText]}>{value || 'Select an option'}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {open && (
        <View style={styles.optionsBox}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  selector: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: { fontSize: 14, color: COLORS.textPrimary, flex: 1 },
  placeholderText: { color: COLORS.textSecondary },
  optionsBox: {
    marginTop: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  optionText: { fontSize: 14, color: COLORS.textPrimary },
});
