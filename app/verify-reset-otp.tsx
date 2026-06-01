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
import { useVerifyResetOtpMutation } from '@/hooks/useAuthMutations';

interface VerifyResetOtpFormValues {
  otp: string;
}

const verifyResetOtpSchema: yup.ObjectSchema<VerifyResetOtpFormValues> = yup.object({
  otp: yup.string().trim().matches(/^\d{6}$/, 'Enter the 6-digit reset code.').required('Reset code is required.'),
});

export default function VerifyResetOtpScreen() {
  const params = useLocalSearchParams<{ email?: string; resetOtp?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';
  const resetOtp = typeof params.resetOtp === 'string' ? params.resetOtp : '';
  const { control, handleSubmit } = useForm<VerifyResetOtpFormValues>({
    resolver: yupResolver(verifyResetOtpSchema),
    defaultValues: {
      otp: '',
    },
  });
  const verifyResetOtpMutation = useVerifyResetOtpMutation();
  const error = verifyResetOtpMutation.error ? getApiErrorMessage(verifyResetOtpMutation.error) : null;

  return (
    <Screen style={styles.screen}>
      <Logo />
      <View style={styles.copy}>
        <Text style={styles.title}>Verify reset code</Text>
        <Text style={styles.body}>Enter the 6-digit code generated for {email || 'your email'}.</Text>
      </View>
      {resetOtp ? (
        <View style={styles.devCode}>
          <Text style={styles.devCodeLabel}>Development reset code</Text>
          <Text style={styles.devCodeValue}>{resetOtp}</Text>
        </View>
      ) : null}
      <View style={styles.form}>
        <FormTextField control={control} name="otp" label="Reset code" placeholder="123456" keyboardType="number-pad" maxLength={6} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Verify code"
          loading={verifyResetOtpMutation.isPending}
          onPress={handleSubmit((values) =>
            verifyResetOtpMutation.mutate(
              { email, otp: values.otp },
              {
                onSuccess: (response) =>
                  router.push({
                    pathname: '/reset-password',
                    params: { email, resetToken: response.resetToken },
                  }),
              },
            ),
          )}
        />
        <Button title="Back" variant="ghost" disabled={verifyResetOtpMutation.isPending} onPress={() => router.back()} />
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
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
  devCode: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 14, borderWidth: 1, padding: 14 },
  devCodeLabel: { color: colors.muted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  devCodeValue: { color: colors.primary, fontSize: 26, fontWeight: '900', letterSpacing: 0, marginTop: 6 },
});
