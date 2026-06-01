import { router } from 'expo-router';
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
import { useForgotPasswordMutation } from '@/hooks/useAuthMutations';

interface ForgotPasswordFormValues {
  email: string;
}

const forgotPasswordSchema: yup.ObjectSchema<ForgotPasswordFormValues> = yup.object({
  email: yup.string().trim().email('Enter a valid email.').required('Email is required.'),
});

export default function ForgotPasswordScreen() {
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  const forgotPasswordMutation = useForgotPasswordMutation();
  const error = forgotPasswordMutation.error ? getApiErrorMessage(forgotPasswordMutation.error) : null;

  return (
    <Screen style={styles.screen}>
      <Logo />
      <View style={styles.copy}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.body}>Enter your account email and we will generate a reset code.</Text>
      </View>
      <View style={styles.form}>
        <FormTextField control={control} name="email" label="Email" placeholder="tejas@example.com" keyboardType="email-address" autoCapitalize="none" />
        {forgotPasswordMutation.data?.message ? <Text style={styles.success}>{forgotPasswordMutation.data.message}</Text> : null}
        {forgotPasswordMutation.data?.resetOtp ? (
          <View style={styles.devCode}>
            <Text style={styles.devCodeLabel}>Development reset code</Text>
            <Text style={styles.devCodeValue}>{forgotPasswordMutation.data.resetOtp}</Text>
          </View>
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Send reset code"
          loading={forgotPasswordMutation.isPending}
          onPress={handleSubmit((values) =>
            forgotPasswordMutation.mutate(values, {
              onSuccess: (response) => {
                if (!response.resetOtp) {
                  router.push({ pathname: '/verify-reset-otp', params: { email: values.email.trim() } });
                }
              },
            }),
          )}
        />
        {forgotPasswordMutation.data?.resetOtp ? (
          <Button
            title="Continue to verification"
            variant="secondary"
            disabled={forgotPasswordMutation.isPending}
            onPress={handleSubmit((values) =>
              router.push({
                pathname: '/verify-reset-otp',
                params: { email: values.email.trim(), resetOtp: forgotPasswordMutation.data?.resetOtp },
              }),
            )}
          />
        ) : null}
        <Button title="Back to login" variant="ghost" disabled={forgotPasswordMutation.isPending} onPress={() => router.back()} />
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
  devCode: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 14, borderWidth: 1, padding: 14 },
  devCodeLabel: { color: colors.muted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  devCodeValue: { color: colors.primary, fontSize: 26, fontWeight: '900', letterSpacing: 0, marginTop: 6 },
});
