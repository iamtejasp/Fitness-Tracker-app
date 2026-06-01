import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Logo } from './Logo';
import { colors } from '@/constants/theme';

export function RestoringSession() {
  return (
    <View style={styles.screen}>
      <Logo />
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.title}>Restoring your session</Text>
      <Text style={styles.body}>Getting your training dashboard ready.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
});
