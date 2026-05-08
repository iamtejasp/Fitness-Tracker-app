import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/constants/theme';
import { Exercise } from '@/types/api';

export function ExerciseRow({ exercise }: { exercise: Exercise }) {
  return (
    <View style={styles.row}>
      <View style={styles.nameWrap}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.detail}>{exercise.weight}kg</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.metricValue}>{exercise.sets}</Text>
        <Text style={styles.metricLabel}>sets</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.metricValue}>{exercise.reps}</Text>
        <Text style={styles.metricLabel}>reps</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  nameWrap: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  detail: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  metric: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderRadius: radii.sm,
    minWidth: 54,
    paddingVertical: 8,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
});
