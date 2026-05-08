import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radii } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        style,
      ]}>
      {icon}
      <Text style={[styles.text, variant !== 'primary' && styles.textLight]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.cardElevated,
    borderColor: colors.border,
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: 'rgba(255, 92, 122, 0.14)',
    borderColor: colors.danger,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.82,
  },
  text: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '800',
  },
  textLight: {
    color: colors.text,
  },
});
