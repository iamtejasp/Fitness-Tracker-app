import { Image, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { StatCard } from '@/components/StatCard';
import { colors, radii } from '@/constants/theme';
import { currentUser, imageUrls, stats } from '@/data/mockData';

export default function ProfileScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <Image source={{ uri: imageUrls.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
      </View>
      <View style={styles.stats}>
        <StatCard label="Workouts" value={stats.totalWorkouts} icon="barbell-outline" />
        <StatCard label="This week" value={stats.workoutsThisWeek} icon="calendar-outline" accent={colors.coral} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Favorite movement</Text>
        <Text style={styles.favorite}>{stats.mostFrequentExercise}</Text>
        <Text style={styles.cardBody}>You train this movement more than any other exercise in the current cycle.</Text>
      </View>
      <View style={styles.actions}>
        <Link href="/profile/edit" asChild><Button title="Edit profile" /></Link>
        <Link href="/settings" asChild><Button title="Settings" variant="secondary" /></Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: 22 },
  avatar: { borderColor: colors.primary, borderRadius: 999, borderWidth: 3, height: 104, width: 104 },
  name: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 14 },
  email: { color: colors.muted, fontSize: 14, marginTop: 4 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginBottom: 18, padding: 18 },
  cardTitle: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  favorite: { color: colors.primary, fontSize: 28, fontWeight: '900', marginTop: 8 },
  cardBody: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 8 },
  actions: { gap: 12 },
});
