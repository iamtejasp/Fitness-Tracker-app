import { Platform } from 'react-native';

export const themePalettes = {
  default: {
    label: 'Default',
    mode: 'dark',
    background: '#080B10',
    backgroundSoft: '#10151D',
    card: '#151B24',
    cardElevated: '#1B2430',
    border: '#2A3340',
    text: '#F7FAFC',
    muted: '#9BA7B6',
    subtle: '#657386',
    primary: '#7CFF6B',
    primaryDark: '#43C95D',
    coral: '#FF775C',
    amber: '#FFB84D',
    cyan: '#5AD7FF',
    danger: '#FF5C7A',
    white: '#FFFFFF',
  },
  underground: {
    label: 'Underground',
    mode: 'dark',
    background: '#0D1110',
    backgroundSoft: '#151C18',
    card: '#19231D',
    cardElevated: '#213027',
    border: '#304238',
    text: '#F3FFF7',
    muted: '#A5B8AD',
    subtle: '#708175',
    primary: '#4F8063',
    primaryDark: '#396248',
    coral: '#D88A5D',
    amber: '#D8B15D',
    cyan: '#65B8A6',
    danger: '#F05D75',
    white: '#FFFFFF',
  },
  roseGarden: {
    label: 'Rose Garden',
    mode: 'light',
    background: '#FFF7FA',
    backgroundSoft: '#FCEAF1',
    card: '#FFFFFF',
    cardElevated: '#FBE3EC',
    border: '#EAC5D3',
    text: '#2B1520',
    muted: '#765162',
    subtle: '#9A7082',
    primary: '#E6004F',
    primaryDark: '#B80040',
    coral: '#F06978',
    amber: '#C98B22',
    cyan: '#009AAE',
    danger: '#D91948',
    white: '#FFFFFF',
  },
  lakeView: {
    label: 'Lake View',
    mode: 'light',
    background: '#F4FFFB',
    backgroundSoft: '#E3F8F0',
    card: '#FFFFFF',
    cardElevated: '#DDF3EC',
    border: '#B8DED3',
    text: '#102B25',
    muted: '#4C6F66',
    subtle: '#6F9189',
    primary: '#10B981',
    primaryDark: '#058C61',
    coral: '#F9735B',
    amber: '#C98B18',
    cyan: '#0EA5C8',
    danger: '#DC3156',
    white: '#FFFFFF',
  },
  sunsetGlow: {
    label: 'Sunset Glow',
    mode: 'light',
    background: '#FFF8F2',
    backgroundSoft: '#FFEADC',
    card: '#FFFFFF',
    cardElevated: '#FFE2D0',
    border: '#EDC4AE',
    text: '#331B12',
    muted: '#7B584A',
    subtle: '#A17968',
    primary: '#E23B12',
    primaryDark: '#B52A0B',
    coral: '#FF775C',
    amber: '#D88B18',
    cyan: '#0D8AA6',
    danger: '#D72E50',
    white: '#FFFFFF',
  },
  forestWhisper: {
    label: 'Forest Whisper',
    mode: 'dark',
    background: '#061412',
    backgroundSoft: '#0B211E',
    card: '#102A25',
    cardElevated: '#173830',
    border: '#26564B',
    text: '#F1FFF8',
    muted: '#9CBDAF',
    subtle: '#6E9585',
    primary: '#00796B',
    primaryDark: '#005A4F',
    coral: '#EE8159',
    amber: '#D6AA45',
    cyan: '#35D0B5',
    danger: '#FF5C7A',
    white: '#FFFFFF',
  },
  oceanBreeze: {
    label: 'Ocean Breeze',
    mode: 'light',
    background: '#F6F8FF',
    backgroundSoft: '#E8EDFF',
    card: '#FFFFFF',
    cardElevated: '#E0E7FF',
    border: '#C7D2FE',
    text: '#16203A',
    muted: '#56617D',
    subtle: '#7782A0',
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    coral: '#F36C64',
    amber: '#C78B1E',
    cyan: '#0891B2',
    danger: '#D93659',
    white: '#FFFFFF',
  },
  lavenderDream: {
    label: 'Lavender Dream',
    mode: 'light',
    background: '#FBF8FF',
    backgroundSoft: '#EFE7FF',
    card: '#FFFFFF',
    cardElevated: '#E9DDFF',
    border: '#D3C2F5',
    text: '#261A3C',
    muted: '#67547F',
    subtle: '#8D78A8',
    primary: '#9B7BFF',
    primaryDark: '#7556D9',
    coral: '#F06C89',
    amber: '#B88918',
    cyan: '#168EA3',
    danger: '#D93568',
    white: '#FFFFFF',
  },
  light: {
    label: 'Light Mode',
    mode: 'light',
    background: '#F7F9FC',
    backgroundSoft: '#EEF2F7',
    card: '#FFFFFF',
    cardElevated: '#E8EDF4',
    border: '#D3DAE5',
    text: '#101827',
    muted: '#526071',
    subtle: '#7B8796',
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    coral: '#EA5B45',
    amber: '#B7791F',
    cyan: '#0891B2',
    danger: '#DC3156',
    white: '#FFFFFF',
  },
} as const;

export type ThemeId = keyof typeof themePalettes;
export type ThemePalette = (typeof themePalettes)[ThemeId];

export const themeOptions = Object.entries(themePalettes).map(([value, palette]) => ({
  value: value as ThemeId,
  label: palette.label,
  accent: palette.primary,
  mode: palette.mode,
}));

const defaultPalette = themePalettes.default;

function webColorVariable(name: keyof ThemePalette, fallback: string) {
  return Platform.OS === 'web' ? `var(--fit-${name}, ${fallback})` : fallback;
}

export const colors = {
  background: webColorVariable('background', defaultPalette.background),
  backgroundSoft: webColorVariable('backgroundSoft', defaultPalette.backgroundSoft),
  card: webColorVariable('card', defaultPalette.card),
  cardElevated: webColorVariable('cardElevated', defaultPalette.cardElevated),
  border: webColorVariable('border', defaultPalette.border),
  text: webColorVariable('text', defaultPalette.text),
  muted: webColorVariable('muted', defaultPalette.muted),
  subtle: webColorVariable('subtle', defaultPalette.subtle),
  primary: webColorVariable('primary', defaultPalette.primary),
  primaryDark: webColorVariable('primaryDark', defaultPalette.primaryDark),
  coral: webColorVariable('coral', defaultPalette.coral),
  amber: webColorVariable('amber', defaultPalette.amber),
  cyan: webColorVariable('cyan', defaultPalette.cyan),
  danger: webColorVariable('danger', defaultPalette.danger),
  white: webColorVariable('white', defaultPalette.white),
};

export function getThemePalette(theme: ThemeId) {
  return themePalettes[theme] ?? themePalettes.default;
}

export function normalizeThemeId(value: unknown): ThemeId {
  if (typeof value === 'string' && value in themePalettes) {
    return value as ThemeId;
  }

  if (value === 'dark' || value === 'system') {
    return 'default';
  }

  return 'default';
}

export function applyThemeToDocument(theme: ThemeId) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  const palette = getThemePalette(theme);
  const root = document.documentElement;

  Object.entries(palette).forEach(([key, value]) => {
    if (key !== 'label' && key !== 'mode') {
      root.style.setProperty(`--fit-${key}`, value);
    }
  });

  root.style.setProperty('color-scheme', palette.mode);
  document.body.style.backgroundColor = palette.background;
}

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  screenTitle: {
    fontSize: 32,
    fontWeight: '900' as const,
    letterSpacing: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900' as const,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: '800' as const,
  },
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
};
