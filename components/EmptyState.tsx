import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({
  title,
  message,
  action,
  icon = 'barbell-outline',
}: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action ? <Button title={action} style={styles.button} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 22,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: 'rgba(124, 255, 107, 0.12)',
    borderRadius: 999,
    height: 62,
    justifyContent: 'center',
    marginBottom: 14,
    width: 62,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 18,
    minWidth: 180,
  },
});
