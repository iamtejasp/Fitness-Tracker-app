import { TextInput, TextInputProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii } from '@/constants/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function TextField({ label, style, error, containerStyle, ...props }: TextFieldProps) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={props.accessibilityLabel ?? label}
        accessibilityHint={props.accessibilityHint ?? (error ? `Error: ${error}` : undefined)}
        accessibilityState={{ disabled: props.editable === false }}
        placeholderTextColor={colors.subtle}
        style={[styles.input, error && styles.inputError, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
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
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 17,
  },
});
