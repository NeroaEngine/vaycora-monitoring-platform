'use client';

import {
  accentColorOptions,
  backgroundStyleOptions,
  primaryColorOptions,
  surfaceStyleOptions,
  textStyleOptions,
  themePresets,
  type AccentColorId,
  type BackgroundStyleId,
  type PrimaryColorId,
  type SurfaceStyleId,
  type TextStyleId,
  type ThemeId
} from '@/lib/theme';
import { useTheme } from '@/components/ThemeProvider';

export function ThemeSwitcher() {
  const {
    brandConfig,
    setBrandName,
    setProductName,
    setLogoDataUrl,
    setThemeId,
    setPrimaryColorId,
    setAccentColorId,
    setBackgroundStyleId,
    setSurfaceStyleId,
    setTextStyleId,
    resetBrandConfig
  } = useTheme();

  const handleLogoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid two">
      <div className="card compact">
        <p className="kicker">Brand identity</p>
        <h3 className="cardTitle">Name and logo controls</h3>
        <p className="muted">
          Vaycora remains the default. This room lets an admin preview customer-facing brand text and logo before we wire Supabase storage.
        </p>

        <div className="formGrid single" style={{ marginTop: 16 }}>
          <label>
            <span>Brand name</span>
            <input value={brandConfig.brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Vaycora" />
          </label>
          <label>
            <span>Product name</span>
            <input value={brandConfig.productName} onChange={(event) => setProductName(event.target.value)} placeholder="Asset Operations" />
          </label>
          <label>
            <span>Upload logo</span>
            <input type="file" accept="image/*" onChange={(event) => handleLogoUpload(event.target.files?.[0])} />
          </label>
        </div>

        <div className="brandPreview">
          {brandConfig.logoDataUrl ? (
            <img className="brandLogoPreview" src={brandConfig.logoDataUrl} alt={`${brandConfig.brandName} logo preview`} />
          ) : (
            <span className="brandIcon">VM</span>
          )}
          <span className="brandText">
            <small>{brandConfig.brandName || 'Vaycora'}</small>
            <strong>{brandConfig.productName || 'Asset Operations'}</strong>
          </span>
        </div>

        {brandConfig.logoDataUrl && (
          <div style={{ marginTop: 12 }}>
            <button className="btn secondary" type="button" onClick={() => setLogoDataUrl(null)}>Remove Uploaded Logo</button>
          </div>
        )}
      </div>

      <div className="card compact">
        <p className="kicker">Color control layer</p>
        <h3 className="cardTitle">Dropdown controls</h3>
        <div className="formGrid">
          <label>
            <span>Theme preset</span>
            <select value={brandConfig.themeId} onChange={(event) => setThemeId(event.target.value as ThemeId)}>
              {themePresets.map((theme) => (
                <option key={theme.id} value={theme.id}>{theme.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Primary color</span>
            <select value={brandConfig.primaryColorId} onChange={(event) => setPrimaryColorId(event.target.value as PrimaryColorId)}>
              {Object.entries(primaryColorOptions).map(([id, option]) => (
                <option key={id} value={id}>{option.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Accent color</span>
            <select value={brandConfig.accentColorId} onChange={(event) => setAccentColorId(event.target.value as AccentColorId)}>
              {Object.entries(accentColorOptions).map(([id, option]) => (
                <option key={id} value={id}>{option.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Background style</span>
            <select value={brandConfig.backgroundStyleId} onChange={(event) => setBackgroundStyleId(event.target.value as BackgroundStyleId)}>
              {Object.entries(backgroundStyleOptions).map(([id, option]) => (
                <option key={id} value={id}>{option.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Surface/card style</span>
            <select value={brandConfig.surfaceStyleId} onChange={(event) => setSurfaceStyleId(event.target.value as SurfaceStyleId)}>
              {Object.entries(surfaceStyleOptions).map(([id, option]) => (
                <option key={id} value={id}>{option.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Text contrast</span>
            <select value={brandConfig.textStyleId} onChange={(event) => setTextStyleId(event.target.value as TextStyleId)}>
              {Object.entries(textStyleOptions).map(([id, option]) => (
                <option key={id} value={id}>{option.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn secondary" type="button" onClick={resetBrandConfig}>Reset Vaycora Default</button>
        </div>
      </div>
    </div>
  );
}
