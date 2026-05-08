import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ExerciseRow } from '@/components/ExerciseRow';
import { getWorkoutVolume } from '@/components/WorkoutCard';
import { Screen } from '@/components/Screen';
import { StatCard } from '@/components/StatCard';
import { colors } from '@/constants/theme';
import { workouts } from '@/data/mockData';

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = workouts.find((item) => item.id === id) ?? workouts[0];

  return (
    <Screen>
      <Link href="/(tabs)/workouts" style={styles.back}>
        <Ionicons name="arrow-back" size={18} color={colors.primary} /> Back to workouts
      </Link>
      <Text style={styles.title}>
        {new Date(workout.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
      </Text>
      <View style={styles.stats}>
        <StatCard label="Exercises" value={workout.exercises.length} icon="list-outline" />
        <StatCard label="Volume" value={`${Math.round(getWorkoutVolume(workout))}kg`} icon="trending-up" accent={colors.coral} />
      </View>
      <Text style={styles.sectionTitle}>Exercise breakdown</Text>
      <View style={styles.list}>
        {workout.exercises.map((exercise) => <ExerciseRow key={exercise.name} exercise={exercise} />)}
      </View>
      <View style={styles.actions}>
        <Link href={`/workout/${workout.id}/edit`} asChild><Button title="Edit workout" /></Link>
        <Button title="Delete workout" variant="danger" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.primary, fontSize: 14, fontWeight: '800', marginBottom: 18 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0, lineHeight: 38, marginBottom: 18 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 12 },
  list: { gap: 12, marginBottom: 20 },
  actions: { gap: 12 },
});
