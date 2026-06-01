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
import { useRegisterMutation } from '@/hooks/useAuthMutations';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema: yup.ObjectSchema<RegisterFormValues> = yup.object({
  name: yup.string().trim().min(2, 'Name must be at least 2 characters.').max(80, 'Name is too long.').required('Name is required.'),
  email: yup.string().trim().email('Enter a valid email.').max(120, 'Email is too long.').required('Email is required.'),
  password: yup.string().min(8, 'Password must be at least 8 characters.').max(128, 'Password is too long.').required('Password is required.'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match.').required('Confirm your password.'),
});

export default function RegisterScreen() {
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const registerMutation = useRegisterMutation();
  const error = registerMutation.error ? getApiErrorMessage(registerMutation.error) : null;

  return (
    <Screen style={styles.screen}>
      <Logo />
      <View style={styles.copy}>
        <Text style={styles.title}>Create your training profile</Text>
        <Text style={styles.body}>Create an account to sync workouts, progress, and AI coaching advice.</Text>
      </View>
      <View style={styles.form}>
        <FormTextField control={control} name="name" label="Name" placeholder="Tejas" />
        <FormTextField control={control} name="email" label="Email" placeholder="tejas@example.com" keyboardType="email-address" autoCapitalize="none" />
        <FormTextField control={control} name="password" label="Password" placeholder="At least 8 characters" secureTextEntry />
        <FormTextField control={control} name="confirmPassword" label="Confirm password" placeholder="Repeat password" secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Create account"
          loading={registerMutation.isPending}
          onPress={handleSubmit(({ confirmPassword: _confirmPassword, ...values }) => registerMutation.mutate(values))}
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
