import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, themeOptions, typography, ThemeId } from '@/constants/theme';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useToast } from '@/context/ToastContext';

export default function SettingsScreen() {
  const { showToast } = useToast();
  const settings = useAppSettings();

  return (
    <Screen>
      <Pressable
        accessibilityLabel="Go back to profile"
        accessibilityRole="button"
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
            return;
          }

          router.replace('/(tabs)/profile');
        }}
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
        <Ionicons name="arrow-back" size={18} color={colors.primary} />
        <Text style={styles.backText}>Back to profile</Text>
      </Pressable>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage display preferences for your training dashboard.</Text>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.icon}><Ionicons name="color-palette-outline" size={20} color={colors.primary} /></View>
          <View style={styles.rowText}>
            <Text style={styles.label}>Theme</Text>
            <Text style={styles.value}>{themeOptions.find((theme) => theme.value === settings.theme)?.label ?? 'Default'}</Text>
          </View>
        </View>
        <ThemeOptionList
          value={settings.theme}
          onChange={(theme) => {
            settings.setTheme(theme);
            const selectedTheme = themeOptions.find((option) => option.value === theme);
            showToast({ message: `${selectedTheme?.label ?? 'Theme'} selected.`, type: 'success' });
          }}
        />
      </View>

    </Screen>
  );
}

interface ThemeOptionListProps {
  value: ThemeId;
  onChange: (value: ThemeId) => void;
}

function ThemeOptionList({ value, onChange }: ThemeOptionListProps) {
  return (
    <View style={styles.themeList}>
      {themeOptions.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            accessibilityLabel={`Use ${option.label} theme`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.themeOption,
              isSelected && styles.themeOptionActive,
              pressed && styles.themeOptionPressed,
            ]}>
            <View style={[styles.themeDot, { backgroundColor: option.accent }]} />
            <View style={styles.themeTextWrap}>
              <Text style={styles.themeName}>{option.label}</Text>
              <Text style={styles.themeMode}>{option.mode === 'light' ? 'Light' : 'Dark'}</Text>
            </View>
            {isSelected ? <Ionicons name="checkmark" size={18} color={colors.text} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 8, marginBottom: 18, minHeight: 44 },
  backButtonPressed: { opacity: 0.78 },
  backText: { color: colors.primary, fontSize: 14, fontWeight: '900' },
  title: { color: colors.text, ...typography.screenTitle },
  subtitle: { color: colors.muted, ...typography.body, marginBottom: 18, marginTop: 6 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginBottom: 16, padding: 8 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', gap: 12, padding: 12 },
  icon: { alignItems: 'center', backgroundColor: 'rgba(124, 255, 107, 0.12)', borderRadius: 12, height: 40, justifyContent: 'center', width: 40 },
  rowText: { flex: 1 },
  label: { color: colors.text, fontSize: 15, fontWeight: '800' },
  value: { color: colors.muted, fontSize: 12, marginTop: 3 },
  themeList: { gap: 4, marginHorizontal: 12 },
  themeOption: { alignItems: 'center', borderRadius: radii.sm, flexDirection: 'row', gap: 10, minHeight: 44, paddingHorizontal: 10, paddingVertical: 8 },
  themeOptionActive: { backgroundColor: colors.cardElevated },
  themeOptionPressed: { opacity: 0.78 },
  themeDot: { borderRadius: 999, height: 9, width: 9 },
  themeTextWrap: { flex: 1 },
  themeName: { color: colors.text, fontSize: 14, fontWeight: '800' },
  themeMode: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 2 },
});
