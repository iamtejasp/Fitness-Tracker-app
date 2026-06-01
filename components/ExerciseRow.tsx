import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/constants/theme';
import { Exercise } from '@/types/api';

interface ExerciseRowProps {
  exercise: Exercise;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function ExerciseRow({ exercise, onEdit, onRemove }: ExerciseRowProps) {
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
      {onEdit || onRemove ? (
        <View style={styles.actions}>
          {onEdit ? (
            <Pressable
              accessibilityLabel={`Edit ${exercise.name}`}
              accessibilityRole="button"
              hitSlop={8}
              onPress={onEdit}
              style={styles.action}>
              <Ionicons name="pencil-outline" size={18} color={colors.text} />
            </Pressable>
          ) : null}
          {onRemove ? (
            <Pressable
              accessibilityLabel={`Remove ${exercise.name}`}
              accessibilityRole="button"
              hitSlop={8}
              onPress={onRemove}
              style={styles.action}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
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
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  action: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderRadius: radii.sm,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
});
