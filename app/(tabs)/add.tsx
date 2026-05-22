import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/Button';
import { ExerciseRow } from '@/components/ExerciseRow';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';
import { suggestedExercises } from '@/data/mockData';
import { useCreateWorkoutMutation } from '@/hooks/useWorkouts';
import { Exercise } from '@/types/api';

export default function AddWorkoutScreen() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [exercises, setExercises] = useState<Exercise[]>(suggestedExercises.slice(0, 1));
  const [name, setName] = useState('Shoulder Press');
  const [sets, setSets] = useState('4');
  const [reps, setReps] = useState('8');
  const [weight, setWeight] = useState('50');
  const createWorkoutMutation = useCreateWorkoutMutation();
  const error = createWorkoutMutation.error ? getApiErrorMessage(createWorkoutMutation.error) : null;

  function addExercise() {
    if (!name.trim()) {
      return;
    }

    setExercises((current) => [
      ...current,
      {
        name: name.trim(),
        sets: Number(sets) || 1,
        reps: Number(reps) || 1,
        weight: Number(weight) || 0,
      },
    ]);
    setName('');
    setSets('3');
    setReps('10');
    setWeight('0');
  }

  function saveWorkout() {
    createWorkoutMutation.mutate(
      { date, exercises },
      {
        onSuccess: (workout) => router.replace(`/workout/${workout.id}`),
      },
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Add workout</Text>
      <Text style={styles.subtitle}>Mock form layout for Figma and future API integration.</Text>
      <View style={styles.form}>
        <TextField label="Date" placeholder="2026-05-08" value={date} onChangeText={setDate} />
        <Text style={styles.sectionTitle}>Exercises</Text>
        {exercises.map((exercise, index) => <ExerciseRow key={`${exercise.name}-${index}`} exercise={exercise} />)}
        <View style={styles.inlineForm}>
          <TextField label="Exercise" placeholder="Shoulder Press" value={name} onChangeText={setName} style={styles.inlineInput} />
          <TextField label="Sets" placeholder="4" keyboardType="numeric" value={sets} onChangeText={setSets} style={styles.smallInput} />
        </View>
        <View style={styles.inlineForm}>
          <TextField label="Reps" placeholder="8" keyboardType="numeric" value={reps} onChangeText={setReps} style={styles.smallInput} />
          <TextField label="Weight" placeholder="50 kg" keyboardType="numeric" value={weight} onChangeText={setWeight} style={styles.smallInput} />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Add exercise" variant="secondary" icon={<Ionicons name="add" size={18} color={colors.text} />} onPress={addExercise} />
        <Button title={createWorkoutMutation.isPending ? 'Saving...' : 'Save workout'} onPress={saveWorkout} />
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
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
});
