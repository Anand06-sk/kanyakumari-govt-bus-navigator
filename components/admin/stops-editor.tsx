import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#0B1F3A',
  secondary: '#1565C0',
  textPrimary: '#172033',
  textSecondary: '#667085',
  border: '#D9DEE7',
  background: '#F5F7FA',
  card: '#FFFFFF',
  error: '#D32F2F',
};

type StopsEditorProps = {
  stops: string[];
  onChange: (nextStops: string[]) => void;
};

export default function StopsEditor({ stops, onChange }: StopsEditorProps) {
  const addStop = () => onChange([...stops, '']);

  const updateStop = (index: number, value: string) => {
    const next = [...stops];
    next[index] = value;
    onChange(next);
  };

  const removeStop = (index: number) => {
    const next = stops.filter((_, itemIndex) => itemIndex !== index);
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Stops</Text>
      {stops.length === 0 ? (
        <Text style={styles.emptyText}>No stops added yet</Text>
      ) : (
        stops.map((stop, index) => (
          <View key={`${index}-${stop}`} style={styles.row}>
            <TextInput
              style={styles.input}
              value={stop}
              onChangeText={(value) => updateStop(index, value)}
              placeholder={`Stop ${index + 1}`}
              placeholderTextColor={COLORS.textSecondary}
              accessibilityLabel={`Stop ${index + 1} input`}
            />
            <TouchableOpacity onPress={() => removeStop(index)} accessibilityLabel={`Remove stop ${index + 1}`}>
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.addButton} onPress={addStop} accessibilityRole="button">
        <Ionicons name="add-circle-outline" size={18} color={COLORS.secondary} />
        <Text style={styles.addButtonText}>Add stop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  emptyText: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    marginTop: 6,
  },
  addButtonText: { color: COLORS.secondary, fontWeight: '600', marginLeft: 6 },
});
