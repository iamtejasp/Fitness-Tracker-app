import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors, radii } from '@/constants/theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this data. Check your connection and try again.',
  actionLabel = 'Try again',
  onRetry,
}: ErrorStateProps) {
  return (
    <View accessibilityRole="alert" style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name="warning-outline" size={28} color={colors.danger} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button
          accessibilityHint="Retries the failed request"
          title={actionLabel}
          variant="secondary"
          onPress={onRetry}
          style={styles.button}
        />
      ) : null}
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
    backgroundColor: 'rgba(255, 92, 122, 0.12)',
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
    minWidth: 160,
  },
});
