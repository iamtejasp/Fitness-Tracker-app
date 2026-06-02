import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/Button';
import { ExerciseRow } from '@/components/ExerciseRow';
import { FormDatePickerField } from '@/components/FormDatePickerField';
import { FormTextField } from '@/components/FormTextField';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { useCreateWorkoutMutation } from '@/hooks/useWorkouts';
import { Exercise } from '@/types/api';

interface AddWorkoutFormValues {
  date: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

const addWorkoutSchema: yup.ObjectSchema<AddWorkoutFormValues> = yup.object({
  date: yup.string().trim().required('Workout date is required.').test('valid-date', 'Select a valid workout date.', isValidWorkoutDate),
  name: yup.string().trim().min(1, 'Exercise name is required.').max(120, 'Exercise name is too long.').required('Exercise name is required.'),
  sets: yup.string().required('Sets are required.').test('sets-range', 'Sets must be 1-100.', (value) => Number(value) >= 1 && Number(value) <= 100),
  reps: yup.string().required('Reps are required.').test('reps-range', 'Reps must be 1-1000.', (value) => Number(value) >= 1 && Number(value) <= 1000),
  weight: yup.string().required('Weight is required.').test('weight-range', 'Weight must be 0-1000.', (value) => Number(value) >= 0 && Number(value) <= 1000),
});

export default function AddWorkoutScreen() {
  const { showToast } = useToast();
  const { control, getValues, handleSubmit, reset, setError, setValue } = useForm<AddWorkoutFormValues>({
    resolver: yupResolver(addWorkoutSchema),
    defaultValues: {
      date: '',
      name: '',
      sets: '',
      reps: '',
      weight: '',
    },
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const createWorkoutMutation = useCreateWorkoutMutation();
  const error = createWorkoutMutation.error ? getApiErrorMessage(createWorkoutMutation.error) : null;

  const addExercise = handleSubmit((values) => {
    setFormError(null);
    const nextExercise = {
      name: values.name.trim(),
      sets: Number(values.sets),
      reps: Number(values.reps),
      weight: Number(values.weight),
    };

    setExercises((current) => {
      if (editingExerciseIndex === null) {
        return [...current, nextExercise];
      }

      return current.map((exercise, index) =>
        index === editingExerciseIndex ? nextExercise : exercise,
      );
    });
    setEditingExerciseIndex(null);
    reset({ ...getValues(), name: '', sets: '', reps: '', weight: '' });
  });

  function saveWorkout() {
    const date = getValues('date');

    if (!isValidWorkoutDate(date)) {
      setError('date', { message: 'Select a valid workout date.' });
      return;
    }

    if (exercises.length === 0) {
      setFormError('Add at least one exercise before saving.');
      return;
    }

    createWorkoutMutation.mutate(
      { date, exercises },
      {
        onSuccess: (workout) => {
          showToast({ message: 'Workout saved.', type: 'success' });
          router.replace(`/workout/${workout.id}`);
        },
      },
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Add workout</Text>
      <Text style={styles.subtitle}>Log the date and exercises from your training session.</Text>
      <View style={styles.form}>
        <FormDatePickerField control={control} name="date" label="Date" />
        <Text style={styles.sectionTitle}>Exercises</Text>
        {exercises.map((exercise, index) => (
          <ExerciseRow
            key={`${exercise.name}-${index}`}
            exercise={exercise}
            onEdit={() => {
              setEditingExerciseIndex(index);
              setValue('name', exercise.name);
              setValue('sets', String(exercise.sets));
              setValue('reps', String(exercise.reps));
              setValue('weight', String(exercise.weight));
            }}
            onRemove={() => {
              setExercises((current) => current.filter((_exercise, exerciseIndex) => exerciseIndex !== index));
              if (editingExerciseIndex === index) {
                setEditingExerciseIndex(null);
                reset({ ...getValues(), name: '', sets: '', reps: '', weight: '' });
              }
            }}
          />
        ))}
        <View style={styles.inlineForm}>
          <FormTextField control={control} name="name" label="Exercise" placeholder="Shoulder Press" containerStyle={styles.wideInput} />
          <FormTextField control={control} name="sets" label="Sets" placeholder="4" keyboardType="numeric" containerStyle={styles.compactInput} />
        </View>
        <View style={styles.inlineForm}>
          <FormTextField control={control} name="reps" label="Reps" placeholder="8" keyboardType="numeric" containerStyle={styles.halfInput} />
          <FormTextField control={control} name="weight" label="Weight" placeholder="50 kg" keyboardType="numeric" containerStyle={styles.halfInput} />
        </View>
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title={editingExerciseIndex === null ? 'Add exercise' : 'Update exercise'}
          variant="secondary"
          icon={<Ionicons name={editingExerciseIndex === null ? 'add' : 'checkmark'} size={18} color={colors.text} />}
          disabled={createWorkoutMutation.isPending}
          onPress={addExercise}
        />
        {editingExerciseIndex !== null ? (
          <Button
            title="Cancel exercise edit"
            variant="ghost"
            disabled={createWorkoutMutation.isPending}
            onPress={() => {
              setEditingExerciseIndex(null);
              reset({ ...getValues(), name: '', sets: '', reps: '', weight: '' });
            }}
          />
        ) : null}
        <Button title="Save workout" loading={createWorkoutMutation.isPending} onPress={saveWorkout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 20, marginTop: 6 },
  form: { gap: 14 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 8 },
  inlineForm: { columnGap: 10, flexDirection: 'row', rowGap: 14 },
  wideInput: { flex: 1, minWidth: 0 },
  compactInput: { flexBasis: 104, flexShrink: 0 },
  halfInput: { flex: 1, minWidth: 0 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
});

function isValidWorkoutDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
