import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { colors, radii, typography } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <Logo />
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>Screen not found</Text>
          <Text style={styles.body}>This route is not available in FitCoach. Return to the app and keep your training flow moving.</Text>
          <Link href="/" asChild>
            <Button title="Go to FitCoach" accessibilityHint="Returns to the app start screen" />
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 14,
    marginTop: 28,
    padding: 20,
    width: '100%',
  },
  title: {
    color: colors.text,
    ...typography.screenTitle,
  },
  body: {
    color: colors.muted,
    ...typography.body,
  },
});
