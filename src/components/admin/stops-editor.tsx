import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface StopsEditorProps {
  stops: string[];
  onChange: (stops: string[]) => void;
}

export default function StopsEditor({ stops, onChange }: StopsEditorProps) {
  const updateStop = (index: number, value: string) => {
    const nextStops = [...stops];
    nextStops[index] = value;
    onChange(nextStops);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Route Stops</Text>
      {stops.map((stop, index) => (
        <View key={`stop-${index}`} style={styles.row}>
          <TextInput
            style={styles.input}
            value={stop}
            onChangeText={(value) => updateStop(index, value)}
            placeholder={`Stop ${index + 1}`}
            placeholderTextColor="#667085"
            accessibilityLabel={`Route stop ${index + 1}`}
          />
          <TouchableOpacity
            onPress={() => onChange(stops.filter((_, itemIndex) => itemIndex !== index))}
            accessibilityLabel={`Remove stop ${index + 1}`}
            accessibilityRole="button"
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onChange([...stops, ''])}
        accessibilityLabel="Add route stop"
        accessibilityRole="button"
      >
        <Text style={styles.addText}>+ Add Stop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#172033', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#D9DEE7', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#172033', backgroundColor: '#F5F7FA' },
  removeText: { color: '#D32F2F', fontSize: 12, fontWeight: '600' },
  addButton: { alignSelf: 'flex-start', paddingVertical: 8 },
  addText: { color: '#1565C0', fontSize: 14, fontWeight: '600' },
});
