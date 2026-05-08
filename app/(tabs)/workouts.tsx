import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { WorkoutCard } from '@/components/WorkoutCard';
import { colors } from '@/constants/theme';
import { workouts } from '@/data/mockData';

export default function WorkoutsScreen() {
  return (
    <Screen>
      <AppHeader title="Workouts" subtitle="All logged sessions" />
      <TextField label="Search" placeholder="Search exercise or workout date" />
      <View style={styles.filters}>
        <Text style={styles.filterActive}>All</Text>
        <Text style={styles.filter}>Push</Text>
        <Text style={styles.filter}>Pull</Text>
        <Text style={styles.filter}>Legs</Text>
      </View>
      <View style={styles.summary}>
        <Ionicons name="trending-up" size={20} color={colors.primary} />
        <Text style={styles.summaryText}>4 workouts this week • 18 total exercises</Text>
      </View>
      <View style={styles.list}>
        {workouts.length ? workouts.map((workout) => <WorkoutCard key={workout.id} workout={workout} />) : (
          <EmptyState title="No workouts yet" message="Start by logging your first workout." action="Add your first workout" />
        )}
      </View>
      <Link href="/(tabs)/add" style={styles.fab}>
        <Ionicons name="add" size={28} color={colors.background} />
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: 10, marginVertical: 16 },
  filter: { backgroundColor: colors.card, borderRadius: 999, color: colors.muted, fontSize: 13, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 14, paddingVertical: 8 },
  filterActive: { backgroundColor: colors.primary, borderRadius: 999, color: colors.background, fontSize: 13, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 14, paddingVertical: 8 },
  summary: { alignItems: 'center', backgroundColor: colors.card, borderColor: colors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 10, marginBottom: 14, padding: 14 },
  summaryText: { color: colors.text, flex: 1, fontSize: 14, fontWeight: '700' },
  list: { gap: 12 },
  fab: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 999, bottom: 100, height: 58, justifyContent: 'center', overflow: 'hidden', padding: 15, position: 'absolute', right: 24, width: 58 },
});
