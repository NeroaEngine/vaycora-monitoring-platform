'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  buildCssVariables,
  defaultBrandConfig,
  type AccentColorId,
  type BackgroundStyleId,
  type BrandConfig,
  type PrimaryColorId,
  type SurfaceStyleId,
  type TextStyleId,
  type ThemeId
} from '@/lib/theme';

type ThemeContextValue = {
  brandConfig: BrandConfig;
  themeId: ThemeId;
  setBrandName: (brandName: string) => void;
  setProductName: (productName: string) => void;
  setLogoDataUrl: (logoDataUrl: string | null) => void;
  setThemeId: (themeId: ThemeId) => void;
  setPrimaryColorId: (primaryColorId: PrimaryColorId) => void;
  setAccentColorId: (accentColorId: AccentColorId) => void;
  setBackgroundStyleId: (backgroundStyleId: BackgroundStyleId) => void;
  setSurfaceStyleId: (surfaceStyleId: SurfaceStyleId) => void;
  setTextStyleId: (textStyleId: TextStyleId) => void;
  resetBrandConfig: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function normalizeBrandConfig(config: Partial<BrandConfig>): BrandConfig {
  return { ...defaultBrandConfig, ...config };
}

function applyBrandConfig(config: BrandConfig) {
  document.documentElement.dataset.theme = config.themeId;
  const variables = buildCssVariables(config);
  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [brandConfig, setBrandConfigState] = useState<BrandConfig>(defaultBrandConfig);

  useEffect(() => {
    const stored = window.localStorage.getItem('vaycora-brand-config');
    if (stored) {
      try {
        const parsed = normalizeBrandConfig(JSON.parse(stored) as Partial<BrandConfig>);
        setBrandConfigState(parsed);
        applyBrandConfig(parsed);
        return;
      } catch {
        window.localStorage.removeItem('vaycora-brand-config');
      }
    }
    applyBrandConfig(defaultBrandConfig);
  }, []);

  const saveBrandConfig = (nextConfig: BrandConfig) => {
    setBrandConfigState(nextConfig);
    applyBrandConfig(nextConfig);
    window.localStorage.setItem('vaycora-brand-config', JSON.stringify(nextConfig));
  };

  const value = useMemo(
    () => ({
      brandConfig,
      themeId: brandConfig.themeId,
      setBrandName: (brandName: string) => saveBrandConfig({ ...brandConfig, brandName }),
      setProductName: (productName: string) => saveBrandConfig({ ...brandConfig, productName }),
      setLogoDataUrl: (logoDataUrl: string | null) => saveBrandConfig({ ...brandConfig, logoDataUrl }),
      setThemeId: (themeId: ThemeId) => saveBrandConfig({ ...brandConfig, themeId }),
      setPrimaryColorId: (primaryColorId: PrimaryColorId) => saveBrandConfig({ ...brandConfig, primaryColorId }),
      setAccentColorId: (accentColorId: AccentColorId) => saveBrandConfig({ ...brandConfig, accentColorId }),
      setBackgroundStyleId: (backgroundStyleId: BackgroundStyleId) => saveBrandConfig({ ...brandConfig, backgroundStyleId }),
      setSurfaceStyleId: (surfaceStyleId: SurfaceStyleId) => saveBrandConfig({ ...brandConfig, surfaceStyleId }),
      setTextStyleId: (textStyleId: TextStyleId) => saveBrandConfig({ ...brandConfig, textStyleId }),
      resetBrandConfig: () => saveBrandConfig(defaultBrandConfig)
    }),
    [brandConfig]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
