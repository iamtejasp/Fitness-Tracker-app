import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { StatCard } from '@/components/StatCard';
import { WorkoutCard } from '@/components/WorkoutCard';
import { colors, radii } from '@/constants/theme';
import { currentUser, imageUrls, stats, workouts } from '@/data/mockData';

export default function HomeScreen() {
  return (
    <Screen>
      <AppHeader showSettings />
      <ImageBackground source={{ uri: imageUrls.dashboard }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay} />
        <Text style={styles.hello}>Hi, {currentUser.name}</Text>
        <Text style={styles.heroTitle}>Push day is trending stronger.</Text>
        <Text style={styles.heroBody}>Bench volume is up 8% compared with last week.</Text>
      </ImageBackground>
      <View style={styles.statGrid}>
        <StatCard label="Total workouts" value={stats.totalWorkouts} icon="flame-outline" />
        <StatCard label="This week" value={stats.workoutsThisWeek} icon="calendar-outline" accent={colors.coral} />
        <StatCard label="Top exercise" value="Bench" icon="trophy-outline" accent={colors.cyan} />
      </View>
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
        {workouts.slice(0, 3).map((workout) => <WorkoutCard key={workout.id} workout={workout} />)}
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
