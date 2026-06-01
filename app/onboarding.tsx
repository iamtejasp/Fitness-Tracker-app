import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Button } from '@/components/Button';
import { RemoteImageBackground } from '@/components/RemoteImageBackground';
import { Screen } from '@/components/Screen';
import { colors, radii, typography } from '@/constants/theme';
import { imageUrls } from '@/data/uiContent';

const slides = [
  { title: 'Track every lift', body: 'Log exercises, sets, reps, and weight in a flow built for the gym floor.', image: imageUrls.onboardingTrack },
  { title: 'See progress clearly', body: 'Review weekly frequency, exercise distribution, and recent trends from your real workout history.', image: imageUrls.onboardingProgress },
  { title: 'Ask your AI coach', body: 'Get concise guidance based on the last 30 days of training, including plateaus and overload ideas.', image: imageUrls.onboardingCoach },
];

export default function OnboardingScreen() {
  const listRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideWidth = Math.max(width - 40, 280);
  const isLastSlide = activeIndex === slides.length - 1;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setActiveIndex(Math.min(Math.max(nextIndex, 0), slides.length - 1));
  }

  function goNext() {
    const nextIndex = Math.min(activeIndex + 1, slides.length - 1);

    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setActiveIndex(nextIndex);
  }

  return (
    <Screen>
      <View style={styles.top}>
        <Text style={styles.eyebrow}>FitCoach setup</Text>
        <Text style={styles.title}>A sharper way to plan your training.</Text>
      </View>

      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        data={slides}
        keyExtractor={(slide) => slide.title}
        renderItem={({ item, index }) => (
          <View style={[styles.slide, { width: slideWidth }]}>
            <RemoteImageBackground source={{ uri: item.image }} style={styles.card} imageStyle={styles.cardImage}>
              <View style={styles.cardOverlay} />
              <View style={styles.badge}><Text style={styles.badgeText}>0{index + 1}</Text></View>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.body}</Text>
              </View>
            </RemoteImageBackground>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      />

      <View accessibilityLabel={`Onboarding step ${activeIndex + 1} of ${slides.length}`} style={styles.dots}>
        {slides.map((slide, index) => (
          <View key={slide.title} style={[styles.dot, index === activeIndex && styles.dotActive]} />
        ))}
      </View>

      {isLastSlide ? (
        <Link href="/register" asChild><Button title="Create account" /></Link>
      ) : (
        <Button title="Next" onPress={goNext} />
      )}
      <Link href="/login" asChild><Button title="Log in instead" variant="ghost" /></Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { marginBottom: 20 },
  eyebrow: { color: colors.primary, ...typography.caption, marginBottom: 8, textTransform: 'uppercase' },
  title: { color: colors.text, ...typography.screenTitle, lineHeight: 38 },
  slide: { paddingRight: 0 },
  card: { borderRadius: radii.lg, height: 440, justifyContent: 'space-between', marginBottom: 18, overflow: 'hidden', padding: 18 },
  cardImage: { borderRadius: radii.lg },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 11, 16, 0.55)' },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: colors.background, fontSize: 12, fontWeight: '900' },
  cardTitle: { color: colors.text, fontSize: 28, fontWeight: '900' },
  cardBody: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  dots: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 20 },
  dot: { backgroundColor: colors.border, borderRadius: 999, height: 8, width: 8 },
  dotActive: { backgroundColor: colors.primary, width: 28 },
});
