import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type StopsEditorProps = {
  stops: string[];
  onChange: (stops: string[]) => void;
};

export default function StopsEditor({ stops, onChange }: StopsEditorProps) {
  const updateStop = (index: number, value: string) => {
    const next = [...stops];
    next[index] = value;
    onChange(next);
  };

  const addStop = () => {
    onChange([...stops, '']);
  };

  const removeStop = (index: number) => {
    onChange(stops.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Stops</Text>

      {stops.map((stop, index) => (
        <View key={`stop-${index}`} style={styles.stopRow}>
          <TextInput
            style={styles.input}
            value={stop}
            onChangeText={(value) => updateStop(index, value)}
            placeholder={`Stop ${index + 1}`}
            placeholderTextColor="#667085"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {stops.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeStop(index)}
              accessibilityRole="button"
              accessibilityLabel={`Remove stop ${index + 1}`}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addStop} accessibilityRole="button">
        <Text style={styles.addButtonText}>+ Add Stop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#172033',
    marginBottom: 8,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#172033',
    backgroundColor: '#F5F7FA',
  },
  removeButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFF7F7',
  },
  removeButtonText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E8F0FA',
  },
  addButtonText: {
    color: '#1565C0',
    fontSize: 12,
    fontWeight: '700',
  },
});
