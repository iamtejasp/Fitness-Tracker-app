import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { Logo } from './Logo';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showProfile?: boolean;
}

export function AppHeader({ title, subtitle, showProfile = false }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {title ? (
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : (
        <Logo size="sm" />
      )}
      {showProfile ? (
        <Link
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          href="/(tabs)/profile"
          style={styles.profile}>
          <Ionicons name="person-outline" size={22} color={colors.text} />
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
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  profile: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 44,
    minWidth: 44,
    padding: 11,
  },
});
