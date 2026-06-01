import { StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { RemoteImageBackground } from '@/components/RemoteImageBackground';
import { Screen } from '@/components/Screen';
import { StatCardSkeleton, WorkoutCardSkeleton } from '@/components/Skeleton';
import { StatCard } from '@/components/StatCard';
import { WorkoutCard } from '@/components/WorkoutCard';
import { colors, radii } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { imageUrls } from '@/data/uiContent';
import { useWorkoutStatsQuery, useWorkoutsQuery } from '@/hooks/useWorkouts';

export default function HomeScreen() {
  const { user } = useAuth();
  const statsQuery = useWorkoutStatsQuery();
  const workoutsQuery = useWorkoutsQuery(1, 5);
  const stats = statsQuery.data;
  const workouts = workoutsQuery.data?.data ?? [];
  const hasError = statsQuery.isError || workoutsQuery.isError;

  return (
    <Screen>
      <AppHeader showSettings />
      <RemoteImageBackground source={{ uri: imageUrls.dashboard }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay} />
        <Text style={styles.hello}>Hi, {user?.name ?? 'Athlete'}</Text>
        <Text style={styles.heroTitle}>Your training dashboard is live.</Text>
        <Text style={styles.heroBody}>Log a workout and your stats will refresh automatically.</Text>
      </RemoteImageBackground>
      {statsQuery.isLoading ? (
        <View style={styles.statGrid}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </View>
      ) : (
        <View style={styles.statGrid}>
          <StatCard label="Total workouts" value={stats?.totalWorkouts ?? 0} icon="flame-outline" />
          <StatCard label="This week" value={stats?.workoutsThisWeek ?? 0} icon="calendar-outline" accent={colors.coral} />
          <StatCard label="Top exercise" value={stats?.mostFrequentExercise ?? 'None'} icon="trophy-outline" accent={colors.cyan} />
        </View>
      )}
      <View style={styles.quickRow}>
        <Link href="/(tabs)/add" asChild>
          <Button title="Add workout" icon={<Ionicons name="add" size={18} color={colors.background} />} style={styles.quickButton} />
        </Link>
        <Link href="/(tabs)/ai" asChild>
          <Button title="Ask coach" variant="secondary" icon={<Ionicons name="sparkles-outline" size={18} color={colors.text} />} style={styles.quickButton} />
        </Link>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent workouts</Text>
        <Link href="/(tabs)/workouts" style={styles.viewAll}>View all</Link>
      </View>
      <View style={styles.list}>
        {hasError ? (
          <ErrorState onRetry={() => {
            statsQuery.refetch();
            workoutsQuery.refetch();
          }} />
        ) : workoutsQuery.isLoading ? (
          <>
            <WorkoutCardSkeleton />
            <WorkoutCardSkeleton />
            <WorkoutCardSkeleton />
          </>
        ) : workouts.length ? workouts.slice(0, 3).map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        )) : (
          <EmptyState
            title="No workouts yet"
            message="Create your first workout to unlock stats and AI coaching."
            action="Add workout"
            onAction={() => router.push('/(tabs)/add')}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radii.xl, height: 238, justifyContent: 'flex-end', marginBottom: 18, overflow: 'hidden', padding: 18 },
  heroImage: { borderRadius: radii.xl },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 11, 16, 0.54)' },
  hello: { color: colors.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  heroTitle: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: 0, lineHeight: 36, marginTop: 8 },
  heroBody: { color: colors.muted, fontSize: 14, marginTop: 8 },
  statGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  quickButton: { flex: 1 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  viewAll: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  list: { gap: 12 },
});
