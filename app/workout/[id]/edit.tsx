import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/Button';
import { ExerciseRow } from '@/components/ExerciseRow';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';
import { useUpdateWorkoutMutation, useWorkoutQuery } from '@/hooks/useWorkouts';
import { Exercise } from '@/types/api';

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutQuery = useWorkoutQuery(id ?? '');
  const updateWorkoutMutation = useUpdateWorkoutMutation(id ?? '');
  const workout = workoutQuery.data;
  const [date, setDate] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState('Cable Row');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('12');
  const error = updateWorkoutMutation.error ? getApiErrorMessage(updateWorkoutMutation.error) : null;

  useEffect(() => {
    if (workout) {
      setDate(workout.date.slice(0, 10));
      setExercises(workout.exercises);
    }
  }, [workout]);

  if (!workout) {
    return (
      <Screen>
        <Text style={styles.title}>{workoutQuery.isLoading ? 'Loading workout...' : 'Workout not found'}</Text>
      </Screen>
    );
  }

  function addExercise() {
    setExercises((current) => [
      ...current,
      { name: name.trim() || 'New exercise', sets: Number(sets) || 1, reps: Number(reps) || 1, weight: 0 },
    ]);
  }

  return (
    <Screen>
      <Text style={styles.title}>Edit workout</Text>
      <Text style={styles.subtitle}>Prefilled dummy form for the workout update flow.</Text>
      <View style={styles.form}>
        <TextField label="Date" value={date} onChangeText={setDate} />
        {exercises.map((exercise, index) => <ExerciseRow key={`${exercise.name}-${index}`} exercise={exercise} />)}
        <TextField label="Add exercise" placeholder="Cable Row" value={name} onChangeText={setName} />
        <View style={styles.row}>
          <TextField label="Sets" placeholder="3" keyboardType="numeric" value={sets} onChangeText={setSets} style={styles.input} />
          <TextField label="Reps" placeholder="12" keyboardType="numeric" value={reps} onChangeText={setReps} style={styles.input} />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Add exercise" variant="secondary" onPress={addExercise} />
        <Button
          title={updateWorkoutMutation.isPending ? 'Saving...' : 'Save changes'}
          onPress={() =>
            updateWorkoutMutation.mutate(
              { date, exercises },
              { onSuccess: () => router.replace(`/workout/${workout.id}`) },
            )
          }
        />
        <Button title="Cancel" variant="secondary" onPress={() => router.back()} />
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
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
});
