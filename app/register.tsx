import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';

export default function RegisterScreen() {
  return (
    <Screen style={styles.screen}>
      <Logo />
      <View style={styles.copy}>
        <Text style={styles.title}>Create your training profile</Text>
        <Text style={styles.body}>Use dummy credentials for now. API auth will plug in later.</Text>
      </View>
      <View style={styles.form}>
        <TextField label="Name" placeholder="Tejas" />
        <TextField label="Email" placeholder="tejas@example.com" keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Password" placeholder="At least 8 characters" secureTextEntry />
        <TextField label="Confirm password" placeholder="Repeat password" secureTextEntry />
        <Link href="/(tabs)" asChild><Button title="Create account" /></Link>
      </View>
      <Link href="/login" style={styles.link}>Already have an account?</Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 24, paddingTop: 34 },
  copy: { gap: 8 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0, lineHeight: 38 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  form: { gap: 14 },
  link: { color: colors.primary, fontSize: 15, fontWeight: '800', textAlign: 'center' },
});
