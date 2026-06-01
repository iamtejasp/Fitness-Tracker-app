import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/constants/theme';
import { Workout } from '@/types/api';

interface WorkoutCardProps {
  workout: Workout;
}

export function getWorkoutVolume(workout: Workout) {
  return workout.exercises.reduce(
    (total, exercise) => total + exercise.sets * exercise.reps * exercise.weight,
    0,
  );
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const topExercises = workout.exercises.map((exercise) => exercise.name).join(' • ');
  const volume = Math.round(getWorkoutVolume(workout));
  const dateLabel = new Date(workout.date).toLocaleDateString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/workout/${workout.id}`} asChild>
      <Pressable
        accessibilityHint="Opens workout details"
        accessibilityLabel={`${dateLabel}, ${workout.exercises.length} exercises, ${volume} kilograms volume. ${topExercises}`}
        accessibilityRole="button"
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.row}>
          <View>
            <Text style={styles.date}>
              {dateLabel}
            </Text>
            <Text style={styles.exercises} numberOfLines={1}>
              {topExercises}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.subtle} />
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{workout.exercises.length} exercises</Text>
          <Text style={styles.meta}>{volume} kg volume</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  exercises: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
    maxWidth: 270,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  meta: {
    backgroundColor: colors.cardElevated,
    borderRadius: 999,
    color: colors.muted,
    fontSize: 12,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
