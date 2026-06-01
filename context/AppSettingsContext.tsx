import * as SecureStore from 'expo-secure-store';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

type Units = 'kg' | 'lb';
type ThemePreference = 'dark' | 'system';

interface AppSettings {
  units: Units;
  theme: ThemePreference;
  remindersEnabled: boolean;
}

interface AppSettingsContextValue extends AppSettings {
  isLoading: boolean;
  setUnits: (units: Units) => Promise<void>;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setRemindersEnabled: (enabled: boolean) => Promise<void>;
}

const SETTINGS_KEY = 'fitcoach_app_settings';
const defaultSettings: AppSettings = {
  units: 'kg',
  theme: 'dark',
  remindersEnabled: true,
};

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export function AppSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const storedSettings = await readSettings();

        if (storedSettings && isMounted) {
          setSettings({ ...defaultSettings, ...storedSettings });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  async function updateSettings(nextSettings: AppSettings) {
    setSettings(nextSettings);
    await writeSettings(nextSettings);
  }

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      ...settings,
      isLoading,
      setUnits: (units) => updateSettings({ ...settings, units }),
      setTheme: (theme) => updateSettings({ ...settings, theme }),
      setRemindersEnabled: (remindersEnabled) => updateSettings({ ...settings, remindersEnabled }),
    }),
    [isLoading, settings],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }

  return context;
}

async function readSettings(): Promise<Partial<AppSettings> | null> {
  const rawSettings =
    Platform.OS === 'web'
      ? globalThis.localStorage?.getItem(SETTINGS_KEY)
      : await SecureStore.getItemAsync(SETTINGS_KEY);

  if (!rawSettings) {
    return null;
  }

  return JSON.parse(rawSettings) as Partial<AppSettings>;
}

async function writeSettings(settings: AppSettings) {
  const rawSettings = JSON.stringify(settings);

  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(SETTINGS_KEY, rawSettings);
    return;
  }

  await SecureStore.setItemAsync(SETTINGS_KEY, rawSettings);
}
