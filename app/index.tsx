import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { colors } from '@/constants/theme';
import { imageUrls } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const { token, isBootstrapping } = useAuth();

  useEffect(() => {
    if (!isBootstrapping && token) {
      router.replace('/(tabs)');
    }
  }, [isBootstrapping, token]);

  return (
    <ImageBackground source={{ uri: imageUrls.dashboard }} style={styles.bg} imageStyle={styles.image}>
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Logo />
        <View style={styles.copy}>
          <Text style={styles.kicker}>Train smarter every week</Text>
          <Text style={styles.title}>Track workouts. Find plateaus. Coach your next set.</Text>
          <Text style={styles.body}>
            {isBootstrapping
              ? 'Restoring your session...'
              : 'A premium mobile fitness dashboard designed around workout history and AI guidance.'}
          </Text>
        </View>
        <View style={styles.actions}>
          <Link href="/onboarding" asChild><Button title="Get started" /></Link>
          <Link href="/login" asChild><Button title="I already have an account" variant="secondary" /></Link>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  image: { opacity: 0.64 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 11, 16, 0.64)' },
  content: { flex: 1, justifyContent: 'space-between', padding: 24, paddingBottom: 42, paddingTop: 72 },
  copy: { gap: 14 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 40, fontWeight: '900', letterSpacing: 0, lineHeight: 46 },
  body: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  actions: { gap: 12 },
});
