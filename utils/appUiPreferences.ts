import AsyncStorage from '@react-native-async-storage/async-storage';

/** Separate from UserSettings / PoopRecord — not cleared by “clear all records” flow. */
const KEY = 'app_ui_preferences_v1';

export type AppUiPreferences = {
  onboardingCompleted: boolean;
  /** When false, hide all 7-day share card entry points */
  share7DaySummaryEnabled: boolean;
  /** When false, home/history use minimal empty copy (no extra guidance cards) */
  emptyGuidanceEnabled: boolean;
};

export const DEFAULT_APP_UI_PREFERENCES: AppUiPreferences = {
  onboardingCompleted: false,
  share7DaySummaryEnabled: true,
  emptyGuidanceEnabled: true,
};

const DEFAULTS = DEFAULT_APP_UI_PREFERENCES;

export async function getAppUiPreferences(): Promise<AppUiPreferences> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const p = JSON.parse(raw) as Partial<AppUiPreferences>;
    return { ...DEFAULTS, ...p };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveAppUiPreferences(
  prefs: AppUiPreferences
): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(prefs));
}

export async function patchAppUiPreferences(
  patch: Partial<AppUiPreferences>
): Promise<AppUiPreferences> {
  const next = { ...(await getAppUiPreferences()), ...patch };
  await saveAppUiPreferences(next);
  return next;
}

export const APP_UI_PREFERENCES_STORAGE_KEY = KEY;
