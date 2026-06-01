export const colors = {
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
};

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
