import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/Button';
import { FormTextField } from '@/components/FormTextField';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useLoginMutation } from '@/hooks/useAuthMutations';

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
  email: yup.string().trim().email('Enter a valid email.').required('Email is required.'),
  password: yup.string().min(8, 'Password must be at least 8 characters.').required('Password is required.'),
});

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const loginMutation = useLoginMutation();
  const error = loginMutation.error ? getApiErrorMessage(loginMutation.error) : null;

  return (
    <Screen style={styles.screen}>
      <Logo />
      <View style={styles.copy}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.body}>Log in to review your training and ask your coach what to do next.</Text>
      </View>
      <View style={styles.form}>
        <FormTextField control={control} name="email" label="Email" placeholder="tejas@example.com" keyboardType="email-address" autoCapitalize="none" />
        <FormTextField control={control} name="password" label="Password" placeholder="Password" secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Log in"
          loading={loginMutation.isPending}
          onPress={handleSubmit((values) => loginMutation.mutate(values))}
        />
      </View>
      <Link href="/forgot-password" style={styles.secondaryLink}>Forgot password?</Link>
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
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
  secondaryLink: { color: colors.muted, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  link: { color: colors.primary, fontSize: 15, fontWeight: '800', textAlign: 'center' },
});
