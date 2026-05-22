import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useProfileQuery, useUpdateProfileMutation } from '@/hooks/useProfile';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data ?? user;
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const updateProfileMutation = useUpdateProfileMutation();
  const error = updateProfileMutation.error ? getApiErrorMessage(updateProfileMutation.error) : null;

  useEffect(() => {
    setName(profile?.name ?? '');
    setEmail(profile?.email ?? '');
  }, [profile]);

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>Edit profile</Text>
      <Text style={styles.subtitle}>These values mirror the backend profile update contract.</Text>
      <View style={styles.form}>
        <TextField label="Name" value={name} onChangeText={setName} />
        <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title={updateProfileMutation.isPending ? 'Saving...' : 'Save profile'}
          onPress={() => updateProfileMutation.mutate({ name, email }, { onSuccess: () => router.replace('/(tabs)/profile') })}
        />
        <Button title="Cancel" variant="secondary" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 18 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  form: { gap: 14 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
});
