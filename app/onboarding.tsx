import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii } from '@/constants/theme';
import { imageUrls } from '@/data/mockData';

const slides = [
  { title: 'Track every lift', body: 'Log exercises, sets, reps, and weight in a flow built for the gym floor.', image: imageUrls.onboardingTrack },
  { title: 'See progress clearly', body: 'Review weekly volume, workout frequency, and your most consistent movements.', image: imageUrls.onboardingProgress },
  { title: 'Ask your AI coach', body: 'Get concise advice based on your last 30 days of training history.', image: imageUrls.onboardingCoach },
];

export default function OnboardingScreen() {
  return (
    <Screen>
      <View style={styles.top}>
        <Text style={styles.eyebrow}>FitCoach setup</Text>
        <Text style={styles.title}>A sharper way to plan your training.</Text>
      </View>
      <View style={styles.cards}>
        {slides.map((slide, index) => (
          <ImageBackground key={slide.title} source={{ uri: slide.image }} style={styles.card} imageStyle={styles.cardImage}>
            <View style={styles.cardOverlay} />
            <View style={styles.badge}><Text style={styles.badgeText}>0{index + 1}</Text></View>
            <View>
              <Text style={styles.cardTitle}>{slide.title}</Text>
              <Text style={styles.cardBody}>{slide.body}</Text>
            </View>
          </ImageBackground>
        ))}
      </View>
      <Link href="/register" asChild><Button title="Create account" /></Link>
      <Link href="/login" asChild><Button title="Log in instead" variant="ghost" /></Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { marginBottom: 20 },
  eyebrow: { color: colors.primary, fontSize: 13, fontWeight: '900', marginBottom: 8, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0, lineHeight: 38 },
  cards: { gap: 14, marginBottom: 22 },
  card: { borderRadius: radii.lg, height: 178, justifyContent: 'space-between', overflow: 'hidden', padding: 16 },
  cardImage: { borderRadius: radii.lg },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 11, 16, 0.55)' },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: colors.background, fontSize: 12, fontWeight: '900' },
  cardTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  cardBody: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6 },
});
