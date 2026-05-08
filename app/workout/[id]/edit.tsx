import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ExerciseRow } from '@/components/ExerciseRow';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';
import { workouts } from '@/data/mockData';

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = workouts.find((item) => item.id === id) ?? workouts[0];

  return (
    <Screen>
      <Text style={styles.title}>Edit workout</Text>
      <Text style={styles.subtitle}>Prefilled dummy form for the workout update flow.</Text>
      <View style={styles.form}>
        <TextField label="Date" defaultValue={workout.date} />
        {workout.exercises.map((exercise) => <ExerciseRow key={exercise.name} exercise={exercise} />)}
        <TextField label="Add exercise" placeholder="Cable Row" />
        <View style={styles.row}>
          <TextField label="Sets" placeholder="3" keyboardType="numeric" style={styles.input} />
          <TextField label="Reps" placeholder="12" keyboardType="numeric" style={styles.input} />
        </View>
        <Button title="Save changes" />
        <Button title="Cancel" variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 20, marginTop: 6 },
  form: { gap: 14 },
  row: { flexDirection: 'row', gap: 10 },
  input: { flex: 1 },
});
