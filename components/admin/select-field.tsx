import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  accessibilityLabel?: string;
};

export default function SelectField({
  label,
  value,
  options,
  onSelect,
  accessibilityLabel,
}: SelectFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsWrap} accessibilityLabel={accessibilityLabel}>
        {options.map((option) => {
          const selected = option === value;

          return (
            <TouchableOpacity
              key={option}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onSelect(option)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#172033',
    marginBottom: 8,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#D9DEE7',
  },
  optionSelected: {
    backgroundColor: '#E8F0FA',
    borderColor: '#1565C0',
  },
  optionText: {
    color: '#172033',
    fontSize: 12,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#1565C0',
  },
});
