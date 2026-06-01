import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii } from '@/constants/theme';

interface SkeletonProps {
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = radii.sm,
  style,
}: SkeletonProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.base, { width, height, borderRadius: radius }, style]}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={38} height={38} radius={12} />
      <Skeleton width="62%" height={24} style={styles.gapLg} />
      <Skeleton width="78%" height={12} />
    </View>
  );
}

export function WorkoutCardSkeleton() {
  return (
    <View style={styles.workoutCard}>
      <Skeleton width="42%" height={18} />
      <Skeleton width="74%" height={13} style={styles.gapSm} />
      <View style={styles.row}>
        <Skeleton width={92} height={26} radius={999} />
        <Skeleton width={116} height={26} radius={999} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.cardElevated,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 132,
    padding: 14,
  },
  workoutCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  gapSm: {
    marginTop: 8,
  },
  gapLg: {
    marginBottom: 8,
    marginTop: 16,
  },
});
