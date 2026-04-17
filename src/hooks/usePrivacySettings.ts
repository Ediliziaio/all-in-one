import { useState, useEffect, useCallback } from "react";

export interface PrivacySettings {
  visibleInCommunity: boolean;
  showBio: boolean;
  showCorso: boolean;
  showAnno: boolean;
  showInteressi: boolean;
  showInstagram: boolean;
  showEmail: boolean;
  showCamera: boolean;
  showPiano: boolean;
  allowWhatsApp: boolean;
}

export const DEFAULT_PRIVACY: PrivacySettings = {
  visibleInCommunity: true,
  showBio: true,
  showCorso: true,
  showAnno: true,
  showInteressi: true,
  showInstagram: true,
  showEmail: false,
  showCamera: false,
  showPiano: true,
  allowWhatsApp: true,
};

const STORAGE_KEY = "studentato_privacy_settings";

export function usePrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings>(() => {
    if (typeof window === "undefined") return DEFAULT_PRIVACY;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PRIVACY, ...JSON.parse(raw) } : DEFAULT_PRIVACY;
    } catch {
      return DEFAULT_PRIVACY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore quota errors
    }
  }, [settings]);

  const update = useCallback(<K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const reset = useCallback(() => setSettings(DEFAULT_PRIVACY), []);

  return { settings, update, reset, setSettings };
}
