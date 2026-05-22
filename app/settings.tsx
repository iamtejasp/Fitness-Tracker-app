import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { colors, radii } from '@/constants/theme';
import { API_BASE_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';

const rows = [
  { icon: 'scale-outline' as const, label: 'Units', value: 'Kilograms' },
  { icon: 'moon-outline' as const, label: 'Theme', value: 'Dark premium' },
  { icon: 'notifications-outline' as const, label: 'Reminders', value: 'Workout nudges on' },
  { icon: 'server-outline' as const, label: 'API base', value: API_BASE_URL },
];

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Mock preferences ready for real app state later.</Text>
      <View style={styles.card}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <View style={styles.icon}><Ionicons name={row.icon} size={20} color={colors.primary} /></View>
            <View style={styles.rowText}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value} numberOfLines={1}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <EmptyState title="Session expired state" message="Reusable auth error state for when a token expires after API integration." icon="lock-closed-outline" />
      <View style={styles.actions}>
        <Button title="Log out" variant="danger" onPress={logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 18, marginTop: 6 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginBottom: 16, padding: 8 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12, padding: 12 },
  icon: { alignItems: 'center', backgroundColor: 'rgba(124, 255, 107, 0.12)', borderRadius: 12, height: 40, justifyContent: 'center', width: 40 },
  rowText: { flex: 1 },
  label: { color: colors.text, fontSize: 15, fontWeight: '800' },
  value: { color: colors.muted, fontSize: 12, marginTop: 3 },
  actions: { marginTop: 16 },
});
