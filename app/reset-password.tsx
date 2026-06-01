import { router, useLocalSearchParams } from 'expo-router';
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
import { useResetPasswordMutation } from '@/hooks/useAuthMutations';

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const resetPasswordSchema: yup.ObjectSchema<ResetPasswordFormValues> = yup.object({
  password: yup.string().min(8, 'Password must be at least 8 characters.').max(128, 'Password is too long.').required('Password is required.'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match.').required('Confirm your password.'),
});

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string; resetToken?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';
  const resetToken = typeof params.resetToken === 'string' ? params.resetToken : '';
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const resetPasswordMutation = useResetPasswordMutation();
  const error = resetPasswordMutation.error ? getApiErrorMessage(resetPasswordMutation.error) : null;

  return (
    <Screen style={styles.screen}>
      <Logo />
      <View style={styles.copy}>
        <Text style={styles.title}>Create a new password</Text>
        <Text style={styles.body}>Choose a strong password for {email || 'your account'}.</Text>
      </View>
      <View style={styles.form}>
        <FormTextField control={control} name="password" label="New password" placeholder="At least 8 characters" secureTextEntry />
        <FormTextField control={control} name="confirmPassword" label="Confirm password" placeholder="Repeat password" secureTextEntry />
        {resetPasswordMutation.data?.message ? <Text style={styles.success}>{resetPasswordMutation.data.message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Reset password"
          loading={resetPasswordMutation.isPending}
          onPress={handleSubmit(({ confirmPassword: _confirmPassword, ...values }) =>
            resetPasswordMutation.mutate(
              { email, resetToken, password: values.password },
              {
                onSuccess: () => router.replace('/login'),
              },
            ),
          )}
        />
        <Button title="Back to login" variant="ghost" disabled={resetPasswordMutation.isPending} onPress={() => router.replace('/login')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 28, paddingTop: 42 },
  copy: { gap: 8 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: 0 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  form: { gap: 16 },
  success: { color: colors.primary, fontSize: 13, lineHeight: 18 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
});
