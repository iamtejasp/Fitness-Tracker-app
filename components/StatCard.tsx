import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  accent?: string;
}

export function StatCard({ label, value, icon, accent = colors.primary }: StatCardProps) {
  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.card}>
      <View style={[styles.icon, { backgroundColor: `${accent}22` }]}>
        <Ionicons name={icon} size={20} color={accent} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 132,
    padding: 14,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    marginBottom: 16,
    width: 38,
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
});
