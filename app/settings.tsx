import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { API_BASE_URL } from '@/constants/config';
import { colors, radii, typography } from '@/constants/theme';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const unitOptions = [
  { label: 'kg', value: 'kg' as const },
  { label: 'lb', value: 'lb' as const },
];

const themeOptions = [
  { label: 'Dark', value: 'dark' as const },
  { label: 'System', value: 'system' as const },
];

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const settings = useAppSettings();

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage display preferences for your training dashboard.</Text>

      <View style={styles.card}>
        <Link href="/(tabs)/profile" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Open profile" style={styles.row}>
            <View style={styles.icon}><Ionicons name="person-outline" size={20} color={colors.primary} /></View>
            <View style={styles.rowText}>
              <Text style={styles.label}>Profile</Text>
              <Text style={styles.value}>View stats and edit account details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtle} />
          </Pressable>
        </Link>

        <SettingSection icon="scale-outline" title="Units" value={settings.units === 'kg' ? 'Kilograms' : 'Pounds'}>
          <SegmentedControl
            value={settings.units}
            options={unitOptions}
            onChange={(units) => {
              settings.setUnits(units);
              showToast({ message: `Units set to ${units}.`, type: 'success' });
            }}
          />
        </SettingSection>

        <SettingSection icon="moon-outline" title="Theme" value={settings.theme === 'dark' ? 'Dark premium' : 'Use system setting'}>
          <SegmentedControl
            value={settings.theme}
            options={themeOptions}
            onChange={(theme) => {
              settings.setTheme(theme);
              showToast({ message: theme === 'dark' ? 'Dark theme selected.' : 'System theme selected.', type: 'success' });
            }}
          />
        </SettingSection>

        <View style={styles.row}>
          <View style={styles.icon}><Ionicons name="notifications-outline" size={20} color={colors.primary} /></View>
          <View style={styles.rowText}>
            <Text style={styles.label}>Reminders</Text>
            <Text style={styles.value}>{settings.remindersEnabled ? 'Workout nudges on' : 'Workout nudges off'}</Text>
          </View>
          <Switch
            accessibilityLabel="Toggle workout reminders"
            thumbColor={colors.text}
            trackColor={{ false: colors.border, true: colors.primaryDark }}
            value={settings.remindersEnabled}
            onValueChange={(enabled) => {
              settings.setRemindersEnabled(enabled);
              showToast({ message: enabled ? 'Reminders enabled.' : 'Reminders disabled.', type: 'success' });
            }}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.icon}><Ionicons name="server-outline" size={20} color={colors.primary} /></View>
          <View style={styles.rowText}>
            <Text style={styles.label}>API base</Text>
            <Text style={styles.value} numberOfLines={1}>{API_BASE_URL}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Log out" variant="danger" onPress={logout} />
      </View>
    </Screen>
  );
}

interface SettingSectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  children: ReactNode;
}

function SettingSection({ icon, title, value, children }: SettingSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <View style={styles.icon}><Ionicons name={icon} size={20} color={colors.primary} /></View>
        <View style={styles.rowText}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}

function SegmentedControl<T extends string>({ value, options, onChange }: SegmentedControlProps<T>) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Set ${option.label}`}
            accessibilityState={{ selected: isSelected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, isSelected && styles.segmentActive]}>
            <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, ...typography.screenTitle },
  subtitle: { color: colors.muted, ...typography.body, marginBottom: 18, marginTop: 6 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginBottom: 16, padding: 8 },
  section: { borderBottomColor: colors.border, borderBottomWidth: 1, paddingBottom: 12 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12, padding: 12 },
  icon: { alignItems: 'center', backgroundColor: 'rgba(124, 255, 107, 0.12)', borderRadius: 12, height: 40, justifyContent: 'center', width: 40 },
  rowText: { flex: 1 },
  label: { color: colors.text, fontSize: 15, fontWeight: '800' },
  value: { color: colors.muted, fontSize: 12, marginTop: 3 },
  segmented: { backgroundColor: colors.backgroundSoft, borderRadius: radii.md, flexDirection: 'row', gap: 6, marginHorizontal: 12, padding: 4 },
  segment: { alignItems: 'center', borderRadius: radii.sm, flex: 1, paddingVertical: 10 },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.muted, fontSize: 13, fontWeight: '900' },
  segmentTextActive: { color: colors.background },
  actions: { marginTop: 16 },
});
