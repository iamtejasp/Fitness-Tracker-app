import { View, Text, StyleSheet } from 'react-native';
import { colors, radii } from '@/constants/theme';

interface LogoProps {
  size?: 'sm' | 'lg';
}

export function Logo({ size = 'lg' }: LogoProps) {
  const isLarge = size === 'lg';

  return (
    <View style={styles.row}>
      <View style={[styles.mark, isLarge ? styles.markLarge : styles.markSmall]}>
        <View style={styles.spark} />
        <Text style={[styles.markText, !isLarge && styles.markTextSmall]}>F</Text>
      </View>
      <View>
        <Text style={[styles.name, !isLarge && styles.nameSmall]}>FitCoach</Text>
        {isLarge ? <Text style={styles.tag}>AI training intelligence</Text> : null}
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
    borderRadius: radii.lg,
    justifyContent: 'center',
    position: 'relative',
  },
  markLarge: {
    height: 58,
    width: 58,
  },
  markSmall: {
    borderRadius: radii.md,
    height: 40,
    width: 40,
  },
  spark: {
    backgroundColor: colors.coral,
    borderRadius: 999,
    height: 12,
    position: 'absolute',
    right: -3,
    top: -3,
    width: 12,
  },
  markText: {
    color: colors.background,
    fontSize: 30,
    fontWeight: '900',
  },
  markTextSmall: {
    fontSize: 22,
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
  tag: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
});
