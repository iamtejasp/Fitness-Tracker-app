import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ExerciseRow } from '@/components/ExerciseRow';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';
import { suggestedExercises } from '@/data/mockData';

export default function AddWorkoutScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Add workout</Text>
      <Text style={styles.subtitle}>Mock form layout for Figma and future API integration.</Text>
      <View style={styles.form}>
        <TextField label="Date" placeholder="May 8, 2026" />
        <Text style={styles.sectionTitle}>Exercises</Text>
        {suggestedExercises.map((exercise) => <ExerciseRow key={exercise.name} exercise={exercise} />)}
        <View style={styles.inlineForm}>
          <TextField label="Exercise" placeholder="Shoulder Press" style={styles.inlineInput} />
          <TextField label="Sets" placeholder="4" keyboardType="numeric" style={styles.smallInput} />
        </View>
        <View style={styles.inlineForm}>
          <TextField label="Reps" placeholder="8" keyboardType="numeric" style={styles.smallInput} />
          <TextField label="Weight" placeholder="50 kg" keyboardType="numeric" style={styles.smallInput} />
        </View>
        <Button title="Add exercise" variant="secondary" icon={<Ionicons name="add" size={18} color={colors.text} />} />
        <Button title="Save workout" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 20, marginTop: 6 },
  form: { gap: 14 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 8 },
  inlineForm: { flexDirection: 'row', gap: 10 },
  inlineInput: { flex: 1 },
  smallInput: { flex: 1 },
});
