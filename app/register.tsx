import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';
import { useRegisterMutation } from '@/hooks/useAuthMutations';

export default function RegisterScreen() {
  const [name, setName] = useState('Tejas');
  const [email, setEmail] = useState(`tejas+${Date.now()}@example.com`);
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const registerMutation = useRegisterMutation();
  const passwordsMatch = password === confirmPassword;
  const error = registerMutation.error ? getApiErrorMessage(registerMutation.error) : null;

  return (
    <Screen style={styles.screen}>
      <Logo />
      <View style={styles.copy}>
        <Text style={styles.title}>Create your training profile</Text>
        <Text style={styles.body}>Use dummy credentials for now. API auth will plug in later.</Text>
      </View>
      <View style={styles.form}>
        <TextField label="Name" placeholder="Tejas" value={name} onChangeText={setName} />
        <TextField label="Email" placeholder="tejas@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextField label="Password" placeholder="At least 8 characters" secureTextEntry value={password} onChangeText={setPassword} />
        <TextField label="Confirm password" placeholder="Repeat password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        {!passwordsMatch ? <Text style={styles.error}>Passwords do not match.</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title={registerMutation.isPending ? 'Creating account...' : 'Create account'}
          onPress={() => {
            if (passwordsMatch) {
              registerMutation.mutate({ name, email, password });
            }
          }}
        />
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
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
  link: { color: colors.primary, fontSize: 15, fontWeight: '800', textAlign: 'center' },
});
