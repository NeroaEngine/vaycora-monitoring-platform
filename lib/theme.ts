export type ThemeId = 'vaycora-classic' | 'operations-dark' | 'clean-enterprise';
export type PrimaryColorId = 'vaycora-deep-green' | 'midnight-green' | 'charcoal-black' | 'navy-executive';
export type AccentColorId = 'vaycora-orange' | 'burnished-gold' | 'copper' | 'safety-amber';
export type BackgroundStyleId = 'luxury-dark' | 'warm-cream' | 'clean-light' | 'high-contrast-dark';
export type SurfaceStyleId = 'glass-dark' | 'executive-cream' | 'clean-white' | 'high-contrast';
export type TextStyleId = 'luxury-warm' | 'standard-light' | 'enterprise-dark';

export type BrandConfig = {
  themeId: ThemeId;
  primaryColorId: PrimaryColorId;
  accentColorId: AccentColorId;
  backgroundStyleId: BackgroundStyleId;
  surfaceStyleId: SurfaceStyleId;
  textStyleId: TextStyleId;
};

export type ThemePreset = {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    primary: string;
    primaryDeep: string;
    accent: string;
    gold: string;
    background: string;
    surface: string;
    surface2: string;
    text: string;
    muted: string;
    border: string;
    soft: string;
  };
};

export const themePresets: ThemePreset[] = [
  {
    id: 'vaycora-classic',
    name: 'Luxury Command',
    description: 'Default Vaycora luxury command center with deep green, black, gold, and orange.',
    colors: {
      primary: '#123C2B', primaryDeep: '#06130E', accent: '#E96F12', gold: '#C9A45C', background: '#0A120E', surface: '#111C16', surface2: '#17241D', text: '#FFF8EA', muted: '#C6BDA8', border: 'rgba(232, 206, 154, 0.22)', soft: 'rgba(255, 248, 234, 0.07)'
    }
  },
  {
    id: 'operations-dark',
    name: 'Operations Dark',
    description: 'High contrast dark operations mode for monitoring-heavy teams.',
    colors: {
      primary: '#123C2B', primaryDeep: '#030807', accent: '#F97316', gold: '#D6B66E', background: '#050807', surface: '#0D1712', surface2: '#132119', text: '#FFFAF0', muted: '#B8C3B9', border: 'rgba(214, 182, 110, 0.22)', soft: 'rgba(255,255,255,.06)'
    }
  },
  {
    id: 'clean-enterprise',
    name: 'Clean Enterprise',
    description: 'Premium light theme for customer demos, reports, and admin-heavy workflows.',
    colors: {
      primary: '#123C2B', primaryDeep: '#0F2F23', accent: '#E96F12', gold: '#B98D3F', background: '#F7F1E5', surface: '#FFFAF0', surface2: '#F1E8D8', text: '#102A24', muted: '#6C6253', border: 'rgba(64, 50, 30, 0.16)', soft: 'rgba(18,60,43,.07)'
    }
  }
];

export const primaryColorOptions: Record<PrimaryColorId, { name: string; primary: string; primaryDeep: string }> = {
  'vaycora-deep-green': { name: 'Vaycora Deep Green', primary: '#123C2B', primaryDeep: '#06130E' },
  'midnight-green': { name: 'Midnight Green', primary: '#0B2A1F', primaryDeep: '#030807' },
  'charcoal-black': { name: 'Charcoal Black', primary: '#1C1A16', primaryDeep: '#050504' },
  'navy-executive': { name: 'Navy Executive', primary: '#102A3C', primaryDeep: '#06121D' }
};

export const accentColorOptions: Record<AccentColorId, { name: string; accent: string; gold: string }> = {
  'vaycora-orange': { name: 'Vaycora Orange', accent: '#E96F12', gold: '#C9A45C' },
  'burnished-gold': { name: 'Burnished Gold', accent: '#C48A2C', gold: '#D6B66E' },
  copper: { name: 'Copper', accent: '#B86128', gold: '#C99663' },
  'safety-amber': { name: 'Safety Amber', accent: '#F59E0B', gold: '#D6B66E' }
};

export const backgroundStyleOptions: Record<BackgroundStyleId, { name: string; background: string }> = {
  'luxury-dark': { name: 'Luxury Dark', background: '#0A120E' },
  'warm-cream': { name: 'Warm Cream', background: '#F7F1E5' },
  'clean-light': { name: 'Clean Light', background: '#F8FAF9' },
  'high-contrast-dark': { name: 'High Contrast Dark', background: '#030807' }
};

export const surfaceStyleOptions: Record<SurfaceStyleId, { name: string; surface: string; surface2: string; soft: string; border: string }> = {
  'glass-dark': { name: 'Glass Dark', surface: '#111C16', surface2: '#17241D', soft: 'rgba(255, 248, 234, 0.07)', border: 'rgba(232, 206, 154, 0.22)' },
  'executive-cream': { name: 'Executive Cream', surface: '#FFFAF0', surface2: '#F1E8D8', soft: 'rgba(18,60,43,.07)', border: 'rgba(64, 50, 30, 0.16)' },
  'clean-white': { name: 'Clean White', surface: '#FFFFFF', surface2: '#F1F5F3', soft: 'rgba(18,60,43,.06)', border: 'rgba(18,60,43,.14)' },
  'high-contrast': { name: 'High Contrast', surface: '#0D1712', surface2: '#132119', soft: 'rgba(255,255,255,.06)', border: 'rgba(214, 182, 110, 0.22)' }
};

export const textStyleOptions: Record<TextStyleId, { name: string; text: string; muted: string }> = {
  'luxury-warm': { name: 'Luxury Warm', text: '#FFF8EA', muted: '#C6BDA8' },
  'standard-light': { name: 'Standard Light', text: '#F8FAFC', muted: '#A7B5AE' },
  'enterprise-dark': { name: 'Enterprise Dark', text: '#102A24', muted: '#6C6253' }
};

export const defaultThemeId: ThemeId = 'vaycora-classic';

export const defaultBrandConfig: BrandConfig = {
  themeId: 'vaycora-classic',
  primaryColorId: 'vaycora-deep-green',
  accentColorId: 'vaycora-orange',
  backgroundStyleId: 'luxury-dark',
  surfaceStyleId: 'glass-dark',
  textStyleId: 'luxury-warm'
};

export function buildCssVariables(config: BrandConfig) {
  const primary = primaryColorOptions[config.primaryColorId];
  const accent = accentColorOptions[config.accentColorId];
  const background = backgroundStyleOptions[config.backgroundStyleId];
  const surface = surfaceStyleOptions[config.surfaceStyleId];
  const text = textStyleOptions[config.textStyleId];

  return {
    '--color-primary': primary.primary,
    '--color-primary-deep': primary.primaryDeep,
    '--color-accent': accent.accent,
    '--color-gold': accent.gold,
    '--color-background': background.background,
    '--color-surface': surface.surface,
    '--color-surface-2': surface.surface2,
    '--color-soft': surface.soft,
    '--color-border': surface.border,
    '--color-text': text.text,
    '--color-muted': text.muted
  } as Record<string, string>;
}
