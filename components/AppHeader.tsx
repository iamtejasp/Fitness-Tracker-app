import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { Logo } from './Logo';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showSettings?: boolean;
}

export function AppHeader({ title, subtitle, showSettings = false }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {title ? (
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : (
        <Logo size="sm" />
      )}
      {showSettings ? (
        <Link
          accessibilityLabel="Open settings"
          accessibilityRole="button"
          href="/settings"
          style={styles.settings}>
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  settings: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 44,
    minWidth: 44,
    padding: 11,
  },
});
