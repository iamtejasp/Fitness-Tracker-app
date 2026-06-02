import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radii } from '@/constants/theme';

interface FormDatePickerFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function FormDatePickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select date',
  containerStyle,
}: FormDatePickerFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <DatePickerField
          label={label}
          placeholder={placeholder}
          value={typeof value === 'string' ? value : ''}
          error={fieldState.error?.message}
          containerStyle={containerStyle}
          onChange={onChange}
        />
      )}
    />
  );
}

interface DatePickerFieldProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  containerStyle?: ViewStyle;
  onChange: (value: string) => void;
}

function DatePickerField({
  label,
  value,
  placeholder,
  error,
  containerStyle,
  onChange,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getMonthAnchor(value || placeholder),
  );
  const selectedDate = parseIsoDate(value);
  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth],
  );

  useEffect(() => {
    if (value) {
      setVisibleMonth(getMonthAnchor(value));
    }
  }, [value]);

  function moveMonth(direction: -1 | 1) {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + direction, 1),
    );
  }

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityHint="Opens a calendar date picker"
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          error && styles.triggerError,
          pressed && styles.triggerPressed,
        ]}>
        <Text style={[styles.triggerText, !value && styles.placeholderText]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}>
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Pressable accessibilityRole="none" style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetEyebrow}>Workout date</Text>
                <Text style={styles.monthTitle}>
                  {visibleMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.monthControls}>
                <Pressable
                  accessibilityLabel="Previous month"
                  accessibilityRole="button"
                  onPress={() => moveMonth(-1)}
                  style={styles.monthButton}>
                  <Ionicons name="chevron-back" size={20} color={colors.text} />
                </Pressable>
                <Pressable
                  accessibilityLabel="Next month"
                  accessibilityRole="button"
                  onPress={() => moveMonth(1)}
                  style={styles.monthButton}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.text}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.weekRow}>
              {weekDays.map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {calendarDays.map((day) => {
                const isoDate = toIsoDate(day.date);
                const isSelected = value === isoDate;
                const isOutsideMonth =
                  day.date.getMonth() !== visibleMonth.getMonth();
                const isToday = isSameDate(day.date, new Date());

                return (
                  <Pressable
                    accessibilityLabel={`Select ${formatDisplayDate(isoDate)}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={isoDate}
                    onPress={() => {
                      onChange(isoDate);
                      setIsOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.dayCell,
                      isSelected && styles.daySelected,
                      pressed && styles.dayPressed,
                    ]}>
                    <Text
                      style={[
                        styles.dayText,
                        isOutsideMonth && styles.outsideMonthText,
                        isToday && styles.todayText,
                        isSelected && styles.daySelectedText,
                      ]}>
                      {day.date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.footer}>
              {selectedDate ? (
                <Text style={styles.selectedText}>
                  Selected: {formatDisplayDate(toIsoDate(selectedDate))}
                </Text>
              ) : (
                <Text style={styles.selectedText}>Select a workout date</Text>
              )}
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsOpen(false)}
                style={styles.doneButton}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function buildCalendarDays(monthAnchor: Date) {
  const firstOfMonth = new Date(
    monthAnchor.getFullYear(),
    monthAnchor.getMonth(),
    1,
  );
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return { date };
  });
}

function getMonthAnchor(value: string) {
  const date = parseIsoDate(value) ?? new Date();

  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  const date = parseIsoDate(value);

  if (!date) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  triggerError: {
    borderColor: colors.danger,
  },
  triggerPressed: {
    opacity: 0.86,
  },
  triggerText: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  placeholderText: {
    color: colors.subtle,
    fontWeight: '500',
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 17,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  sheet: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: 16,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetEyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  monthTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  monthControls: {
    flexDirection: 'row',
    gap: 8,
  },
  monthButton: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    color: colors.muted,
    flex: 1,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },
  dayCell: {
    alignItems: 'center',
    aspectRatio: 1,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  dayPressed: {
    opacity: 0.8,
  },
  daySelected: {
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  dayText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  outsideMonthText: {
    color: colors.subtle,
    opacity: 0.55,
  },
  todayText: {
    color: colors.primary,
  },
  daySelectedText: {
    color: colors.background,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
  },
  selectedText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  doneText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
  },
});
