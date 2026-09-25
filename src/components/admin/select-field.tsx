import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  accessibilityLabel?: string;
}

export default function SelectField({ label, value, options, onSelect, accessibilityLabel }: SelectFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.field} onPress={() => setVisible(true)} accessibilityLabel={accessibilityLabel ?? label} accessibilityRole="button">
        <Text style={value ? styles.value : styles.placeholder}>{value || `Select ${label.toLowerCase()}`}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            {options.map((option) => (
              <TouchableOpacity key={option} style={styles.option} onPress={() => { onSelect(option); setVisible(false); }}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#172033', marginBottom: 6 },
  field: { minHeight: 48, borderWidth: 1, borderColor: '#D9DEE7', borderRadius: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F7FA' },
  value: { color: '#172033', fontSize: 15 },
  placeholder: { color: '#667085', fontSize: 15 },
  chevron: { color: '#667085', fontSize: 12 },
  overlay: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
  menu: { borderRadius: 10, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  option: { paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#D9DEE7' },
  optionText: { color: '#172033', fontSize: 15 },
});