import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radii } from '@/constants/theme';
import { exerciseCatalog } from '@/data/exerciseCatalog';

interface FormExerciseSelectFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

interface ExerciseOption {
  category: string;
  name: string;
}

const exerciseOptions: ExerciseOption[] = exerciseCatalog.flatMap((group) =>
  group.exercises.map((name) => ({
    category: group.category,
    name,
  })),
);

export function FormExerciseSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select exercise',
  containerStyle,
}: FormExerciseSelectFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <ExerciseSelectField
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

interface ExerciseSelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  containerStyle?: ViewStyle;
  onChange: (value: string) => void;
}

function ExerciseSelectField({
  label,
  value,
  placeholder,
  error,
  containerStyle,
  onChange,
}: ExerciseSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return exerciseOptions;
    }

    return exerciseOptions.filter(
      (option) =>
        option.name.toLowerCase().includes(normalizedSearch) ||
        option.category.toLowerCase().includes(normalizedSearch),
    );
  }, [search]);

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityHint="Opens a searchable exercise selector"
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          error && styles.triggerError,
          pressed && styles.triggerPressed,
        ]}>
        <Text numberOfLines={1} style={[styles.triggerText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.primary} />
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
                <Text style={styles.sheetEyebrow}>Exercise library</Text>
                <Text style={styles.sheetTitle}>Select exercise</Text>
              </View>
              <Pressable
                accessibilityLabel="Close exercise selector"
                accessibilityRole="button"
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}>
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.searchWrap}>
              <Ionicons name="search" size={18} color={colors.subtle} />
              <TextInput
                accessibilityLabel="Search exercises"
                autoCapitalize="none"
                placeholder="Search exercise or category"
                placeholderTextColor={colors.subtle}
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => `${item.category}-${item.name}`}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No exercise found</Text>
                  <Text style={styles.emptyText}>Try another name or category.</Text>
                </View>
              }
              renderItem={({ item, index }) => {
                const isSelected = item.name === value;
                const showCategory =
                  index === 0 || filteredOptions[index - 1]?.category !== item.category;

                return (
                  <View>
                    {showCategory ? (
                      <Text style={styles.category}>{item.category}</Text>
                    ) : null}
                    <Pressable
                      accessibilityLabel={`Select ${item.name}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => {
                        onChange(item.name);
                        setSearch('');
                        setIsOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.option,
                        isSelected && styles.optionSelected,
                        pressed && styles.optionPressed,
                      ]}>
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {item.name}
                      </Text>
                      {isSelected ? (
                        <Ionicons name="checkmark" size={18} color={colors.background} />
                      ) : null}
                    </Pressable>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              style={styles.optionList}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
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
  triggerError: { borderColor: colors.danger },
  triggerPressed: { opacity: 0.86 },
  triggerText: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    paddingRight: 10,
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
    maxHeight: '82%',
    padding: 16,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetEyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  searchWrap: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    minHeight: 46,
  },
  optionList: {
    maxHeight: 470,
  },
  category: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 8,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSoft,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionPressed: { opacity: 0.82 },
  optionText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  optionTextSelected: {
    color: colors.background,
    fontWeight: '900',
  },
  emptyState: {
    alignItems: 'center',
    padding: 28,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
});
