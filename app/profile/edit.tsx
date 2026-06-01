import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/Button';
import { FormTextField } from '@/components/FormTextField';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useProfileQuery, useUpdateProfileMutation } from '@/hooks/useProfile';

interface EditProfileFormValues {
  name: string;
  email: string;
}

const editProfileSchema: yup.ObjectSchema<EditProfileFormValues> = yup
  .object({
    name: yup.string().trim().optional().default('').test('name-length', 'Name must be at least 2 characters.', (value) => !value || value.length >= 2),
    email: yup.string().trim().optional().default('').test('valid-email', 'Enter a valid email.', (value) => !value || yup.string().email().isValidSync(value)),
  })
  .test('at-least-one', 'Enter a name or email to update.', (value) => Boolean(value?.name || value?.email));

export default function EditProfileScreen() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data ?? user;
  const { control, handleSubmit, reset } = useForm<EditProfileFormValues>({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });
  const [formError, setFormError] = useState<string | null>(null);
  const updateProfileMutation = useUpdateProfileMutation();
  const error = updateProfileMutation.error ? getApiErrorMessage(updateProfileMutation.error) : null;

  useEffect(() => {
    reset({ name: '', email: '' });
  }, [profile]);

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>Edit profile</Text>
      <Text style={styles.subtitle}>These values mirror the backend profile update contract.</Text>
      <View style={styles.form}>
        <Text style={styles.current}>Current: {profile?.name ?? 'Athlete'} • {profile?.email ?? 'No email loaded'}</Text>
        <FormTextField control={control} name="name" label="New name" placeholder={profile?.name ?? 'Tejas'} />
        <FormTextField control={control} name="email" label="New email" placeholder={profile?.email ?? 'tejas@example.com'} keyboardType="email-address" autoCapitalize="none" />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Save profile"
          loading={updateProfileMutation.isPending}
          onPress={handleSubmit(
            (values) => {
              setFormError(null);
              updateProfileMutation.mutate(
                {
                  ...(values.name ? { name: values.name } : {}),
                  ...(values.email ? { email: values.email } : {}),
                },
                {
                  onSuccess: () => {
                    showToast({ message: 'Profile updated.', type: 'success' });
                    router.replace('/(tabs)/profile');
                  },
                },
              );
            },
            (errors) => setFormError(errors.root?.message ?? 'Check the form fields and try again.'),
          )}
        />
        <Button title="Cancel" variant="secondary" disabled={updateProfileMutation.isPending} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 18 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  form: { gap: 14 },
  current: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
});
