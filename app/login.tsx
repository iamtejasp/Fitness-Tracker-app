import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';

export default function LoginScreen() {
  return (
    <Screen style={styles.screen}>
      <Logo />
      <View style={styles.copy}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.body}>Log in to review your training and ask your coach what to do next.</Text>
      </View>
      <View style={styles.form}>
        <TextField label="Email" placeholder="tejas@example.com" keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Password" placeholder="Password" secureTextEntry />
        <Link href="/(tabs)" asChild><Button title="Log in" /></Link>
      </View>
      <Link href="/register" style={styles.link}>Create a new account</Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 28, paddingTop: 42 },
  copy: { gap: 8 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: 0 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  form: { gap: 16 },
  link: { color: colors.primary, fontSize: 15, fontWeight: '800', textAlign: 'center' },
});
