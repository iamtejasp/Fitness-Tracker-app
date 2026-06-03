import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii } from '@/constants/theme';

interface LogoProps {
  size?: 'sm' | 'lg';
  tone?: 'default' | 'onImage';
}

export function Logo({ size = 'lg', tone = 'default' }: LogoProps) {
  const isLarge = size === 'lg';
  const isOnImage = tone === 'onImage';

  return (
    <View style={styles.row}>
      <View style={[styles.mark, isLarge ? styles.markLarge : styles.markSmall]}>
        <View style={[styles.innerRing, isLarge ? styles.innerRingLarge : styles.innerRingSmall]} />
        <Ionicons
          name="barbell"
          size={isLarge ? 30 : 22}
          color={colors.background}
        />
        <View style={[styles.spark, isLarge ? styles.sparkLarge : styles.sparkSmall]}>
          <Ionicons
            name="sparkles"
            size={isLarge ? 13 : 10}
            color={colors.white}
          />
        </View>
      </View>
      <View>
        <Text style={[styles.name, isOnImage && styles.nameOnImage, !isLarge && styles.nameSmall]}>FitCoach</Text>
        {isLarge ? <Text style={[styles.tag, isOnImage && styles.tagOnImage]}>AI training intelligence</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.border,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
    justifyContent: 'center',
    position: 'relative',
  },
  markLarge: {
    borderRadius: 21,
    height: 58,
    width: 58,
  },
  markSmall: {
    borderRadius: radii.lg,
    height: 40,
    width: 40,
  },
  innerRing: {
    borderColor: 'rgba(255, 255, 255, 0.34)',
    borderWidth: 1,
    position: 'absolute',
  },
  innerRingLarge: {
    borderRadius: 16,
    height: 44,
    width: 44,
  },
  innerRingSmall: {
    borderRadius: 12,
    height: 30,
    width: 30,
  },
  spark: {
    alignItems: 'center',
    backgroundColor: colors.coral,
    borderRadius: 999,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    top: -4,
  },
  sparkLarge: {
    height: 22,
    width: 22,
  },
  sparkSmall: {
    height: 16,
    width: 16,
  },
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  nameSmall: {
    fontSize: 20,
  },
  nameOnImage: {
    color: '#FFFFFF',
  },
  tag: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  tagOnImage: {
    color: '#DDE6F2',
  },
});
