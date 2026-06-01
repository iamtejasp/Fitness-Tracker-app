import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { ErrorState } from '@/components/ErrorState';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { colors, radii } from '@/constants/theme';
import { useLast30DaysWorkoutsQuery } from '@/hooks/useWorkouts';
import { Workout } from '@/types/api';

function buildProgressBars(workouts: Workout[]) {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = labels.map((_, day) => workouts.filter((workout) => new Date(workout.date).getDay() === day).length);
  const max = Math.max(...counts, 1);

  return labels.map((label, index) => ({
    label,
    count: counts[index],
    value: counts[index] / max,
  }));
}

function buildExerciseDistribution(workouts: Workout[]) {
  const totals = new Map<string, number>();

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      totals.set(exercise.name, (totals.get(exercise.name) ?? 0) + 1);
    });
  });

  const total = Array.from(totals.values()).reduce((sum, value) => sum + value, 0) || 1;
  const palette = [colors.primary, colors.coral, colors.cyan];

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count], index) => ({
      label,
      count,
      value: Math.round((count / total) * 100),
      color: palette[index],
    }));
}

export default function ProgressScreen() {
  const last30DaysQuery = useLast30DaysWorkoutsQuery();
  const workouts = last30DaysQuery.data ?? [];
  const progressBars = buildProgressBars(workouts);
  const exerciseDistribution = buildExerciseDistribution(workouts);

  if (last30DaysQuery.isError) {
    return (
      <Screen>
        <AppHeader title="Progress" subtitle="Last 30 days" />
        <ErrorState onRetry={() => last30DaysQuery.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader title="Progress" subtitle="Last 30 days" />
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Weekly training rhythm</Text>
        {last30DaysQuery.isLoading ? (
          <Skeleton height={150} radius={14} />
        ) : <View style={styles.bars}>
          {progressBars.map((bar) => (
            <View key={bar.label} style={styles.barWrap}>
              <Text style={styles.barCount}>{bar.count}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${bar.value * 100}%` }]} />
              </View>
              <Text style={styles.barLabel}>{bar.label}</Text>
            </View>
          ))}
        </View>}
      </View>
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Exercise split</Text>
        {last30DaysQuery.isLoading ? (
          <>
            <Skeleton height={20} style={styles.skeletonRow} />
            <Skeleton height={20} style={styles.skeletonRow} />
            <Skeleton height={20} style={styles.skeletonRow} />
          </>
        ) : exerciseDistribution.length ? exerciseDistribution.map((item) => (
          <View key={item.label} style={styles.splitRow}>
            <Text style={styles.splitLabel} numberOfLines={1}>{item.label}</Text>
            <View style={styles.splitTrack}>
              <View style={[styles.splitFill, { width: `${item.value}%`, backgroundColor: item.color }]} />
            </View>
            <Text style={styles.splitValue}>{item.value}%</Text>
          </View>
        )) : <Text style={styles.emptyText}>Log workouts to build your exercise split.</Text>}
      </View>
      <View style={styles.insight}>
        <Text style={styles.insightTitle}>Trend insight</Text>
        <Text style={styles.insightText}>
          {workouts.length
            ? `${workouts.length} workouts found in the last 30 days. Top exercise appears ${exerciseDistribution[0]?.count ?? 0} times.`
            : 'No workouts yet. Log a session to unlock trend insights.'}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chartCard: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginBottom: 16, padding: 16 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 16 },
  bars: { alignItems: 'flex-end', flexDirection: 'row', gap: 10, height: 150 },
  barWrap: { alignItems: 'center', flex: 1, gap: 8 },
  barTrack: { backgroundColor: colors.cardElevated, borderRadius: 999, height: 104, justifyContent: 'flex-end', overflow: 'hidden', width: '100%' },
  barFill: { backgroundColor: colors.primary, borderRadius: 999, width: '100%' },
  barCount: { color: colors.text, fontSize: 11, fontWeight: '900' },
  barLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  splitRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginBottom: 14 },
  splitLabel: { color: colors.text, fontSize: 13, fontWeight: '800', width: 92 },
  splitTrack: { backgroundColor: colors.cardElevated, borderRadius: 999, flex: 1, height: 10, overflow: 'hidden' },
  splitFill: { borderRadius: 999, height: '100%' },
  splitValue: { color: colors.muted, fontSize: 12, fontWeight: '800', width: 34 },
  emptyText: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  insight: { backgroundColor: 'rgba(255, 119, 92, 0.12)', borderColor: colors.coral, borderRadius: radii.lg, borderWidth: 1, padding: 16 },
  insightTitle: { color: colors.coral, fontSize: 15, fontWeight: '900' },
  insightText: { color: colors.text, fontSize: 14, lineHeight: 21, marginTop: 8 },
  skeletonRow: { marginBottom: 14 },
});
