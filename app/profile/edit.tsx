import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';
import { currentUser } from '@/data/mockData';

export default function EditProfileScreen() {
  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>Edit profile</Text>
      <Text style={styles.subtitle}>These values mirror the backend profile update contract.</Text>
      <View style={styles.form}>
        <TextField label="Name" defaultValue={currentUser.name} />
        <TextField label="Email" defaultValue={currentUser.email} keyboardType="email-address" autoCapitalize="none" />
        <Button title="Save profile" />
        <Link href="/(tabs)/profile" asChild><Button title="Cancel" variant="secondary" /></Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 18 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  form: { gap: 14 },
});
