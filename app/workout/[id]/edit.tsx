import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/Button';
import { ExerciseRow } from '@/components/ExerciseRow';
import { FormDatePickerField } from '@/components/FormDatePickerField';
import { FormExerciseSelectField } from '@/components/FormExerciseSelectField';
import { FormTextField } from '@/components/FormTextField';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { useUpdateWorkoutMutation, useWorkoutQuery } from '@/hooks/useWorkouts';
import { Exercise } from '@/types/api';

interface EditWorkoutFormValues {
  date: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

const editWorkoutSchema: yup.ObjectSchema<EditWorkoutFormValues> = yup.object({
  date: yup.string().trim().optional().default('').test('valid-date', 'Select a valid workout date.', (value) => !value || isValidWorkoutDate(value)),
  name: yup.string().trim().optional().default(''),
  sets: yup.string().optional().default('').test('sets-range', 'Sets must be 1-100.', (value) => !value || (Number(value) >= 1 && Number(value) <= 100)),
  reps: yup.string().optional().default('').test('reps-range', 'Reps must be 1-1000.', (value) => !value || (Number(value) >= 1 && Number(value) <= 1000)),
  weight: yup.string().optional().default('').test('weight-range', 'Weight must be 0-1000.', (value) => !value || (Number(value) >= 0 && Number(value) <= 1000)),
});

export default function EditWorkoutScreen() {
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutQuery = useWorkoutQuery(id ?? '');
  const updateWorkoutMutation = useUpdateWorkoutMutation(id ?? '');
  const workout = workoutQuery.data;
  const { control, getValues, handleSubmit, reset } = useForm<EditWorkoutFormValues>({
    resolver: yupResolver(editWorkoutSchema),
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
  const error = updateWorkoutMutation.error ? getApiErrorMessage(updateWorkoutMutation.error) : null;

  useEffect(() => {
    if (workout) {
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

  const addExercise = handleSubmit((values) => {
    if (!values.name.trim() || !values.sets || !values.reps || !values.weight) {
      setFormError('Exercise name, sets, reps, and weight are required to add a new row.');
      return;
    }

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

  return (
    <Screen>
      <Text style={styles.title}>Edit workout</Text>
      <Text style={styles.subtitle}>Update the workout date, edit existing exercises, or add new rows.</Text>
      <View style={styles.form}>
        <FormDatePickerField
          control={control}
          name="date"
          label="New date"
          placeholder={workout.date.slice(0, 10)}
        />
        {exercises.map((exercise, index) => (
          <ExerciseRow
            key={`${exercise.name}-${index}`}
            exercise={exercise}
            onEdit={() => {
              setEditingExerciseIndex(index);
              reset({
                ...getValues(),
                name: exercise.name,
                sets: String(exercise.sets),
                reps: String(exercise.reps),
                weight: String(exercise.weight),
              });
            }}
            onRemove={() => {
              if (exercises.length === 1) {
                setFormError('A workout must include at least one exercise.');
                return;
              }

              setExercises((current) => current.filter((_exercise, exerciseIndex) => exerciseIndex !== index));
              if (editingExerciseIndex === index) {
                setEditingExerciseIndex(null);
                reset({ ...getValues(), name: '', sets: '', reps: '', weight: '' });
              }
            }}
          />
        ))}
        <FormExerciseSelectField control={control} name="name" label={editingExerciseIndex === null ? 'Add exercise' : 'Edit exercise'} placeholder="Select exercise" />
        <View style={styles.row}>
          <FormTextField control={control} name="sets" label="Sets" placeholder="3" keyboardType="numeric" containerStyle={styles.input} />
          <FormTextField control={control} name="reps" label="Reps" placeholder="12" keyboardType="numeric" containerStyle={styles.input} />
        </View>
        <FormTextField control={control} name="weight" label="Weight" placeholder="50 kg" keyboardType="numeric" />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title={editingExerciseIndex === null ? 'Add exercise' : 'Update exercise'}
          variant="secondary"
          disabled={updateWorkoutMutation.isPending}
          onPress={addExercise}
        />
        {editingExerciseIndex !== null ? (
          <Button
            title="Cancel exercise edit"
            variant="ghost"
            disabled={updateWorkoutMutation.isPending}
            onPress={() => {
              setEditingExerciseIndex(null);
              reset({ ...getValues(), name: '', sets: '', reps: '', weight: '' });
            }}
          />
        ) : null}
        <Button
          title="Save changes"
          loading={updateWorkoutMutation.isPending}
          onPress={() => {
            const date = getValues('date');
            if (date && !isValidWorkoutDate(date)) {
              setFormError('Select a valid workout date.');
              return;
            }

            if (exercises.length === 0) {
              setFormError('A workout must include at least one exercise.');
              return;
            }

            updateWorkoutMutation.mutate(
              { ...(date ? { date } : {}), exercises },
              {
                onSuccess: () => {
                  showToast({ message: 'Workout updated.', type: 'success' });
                  router.replace(`/workout/${workout.id}`);
                },
              },
            );
          }}
        />
        <Button title="Cancel" variant="secondary" disabled={updateWorkoutMutation.isPending} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 20, marginTop: 6 },
  form: { gap: 14 },
  row: { columnGap: 10, flexDirection: 'row' },
  input: { flex: 1, minWidth: 0 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
});

function isValidWorkoutDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
