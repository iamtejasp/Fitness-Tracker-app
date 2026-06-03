import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/ErrorState';
import { Screen } from '@/components/Screen';
import { StatCardSkeleton } from '@/components/Skeleton';
import { StatCard } from '@/components/StatCard';
import { colors, radii } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useProfileQuery } from '@/hooks/useProfile';
import { useWorkoutStatsQuery } from '@/hooks/useWorkouts';

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const profileQuery = useProfileQuery();
  const statsQuery = useWorkoutStatsQuery();
  const profile = profileQuery.data ?? user;
  const stats = statsQuery.data;

  if (profileQuery.isError || statsQuery.isError) {
    return (
      <Screen>
        <ErrorState onRetry={() => {
          profileQuery.refetch();
          statsQuery.refetch();
        }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.name}>{profileQuery.isLoading ? 'Loading...' : profile?.name ?? 'Athlete'}</Text>
        <Text style={styles.email}>{profileQuery.isLoading ? 'Fetching profile' : profile?.email ?? 'No email loaded'}</Text>
      </View>
      {statsQuery.isLoading ? (
        <View style={styles.stats}>
          <StatCardSkeleton />
          <StatCardSkeleton />
        </View>
      ) : (
        <View style={styles.stats}>
          <StatCard label="Workouts" value={stats?.totalWorkouts ?? 0} icon="barbell-outline" />
          <StatCard label="This week" value={stats?.workoutsThisWeek ?? 0} icon="calendar-outline" accent={colors.coral} />
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Favorite movement</Text>
        <Text style={styles.favorite}>{stats?.mostFrequentExercise ?? 'None yet'}</Text>
        <Text style={styles.cardBody}>You train this movement more than any other exercise in the current cycle.</Text>
      </View>
      <View style={styles.actions}>
        <Link href="/profile/edit" asChild><Button title="Edit profile" /></Link>
        <Link href="/settings" asChild><Button title="Settings" variant="secondary" /></Link>
        <Button title="Log out" variant="danger" onPress={logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: 22, paddingTop: 12 },
  name: { color: colors.text, fontSize: 30, fontWeight: '900' },
  email: { color: colors.muted, fontSize: 14, marginTop: 4 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginBottom: 18, padding: 18 },
  cardTitle: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  favorite: { color: colors.primary, fontSize: 28, fontWeight: '900', marginTop: 8 },
  cardBody: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 8 },
  actions: { gap: 12 },
});
