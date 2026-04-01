import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_DELIGHT_PREFERENCES, DelightPreferences } from './types';

const DELIGHT_PREFERENCES_KEY = 'delight_preferences_v1';

export { DELIGHT_PREFERENCES_KEY };

export async function getDelightPreferences(): Promise<DelightPreferences> {
  try {
    const raw = await AsyncStorage.getItem(DELIGHT_PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_DELIGHT_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<DelightPreferences>;
    return { ...DEFAULT_DELIGHT_PREFERENCES, ...parsed };
  } catch {
    return { ...DEFAULT_DELIGHT_PREFERENCES };
  }
}

export async function saveDelightPreferences(prefs: DelightPreferences): Promise<void> {
  await AsyncStorage.setItem(DELIGHT_PREFERENCES_KEY, JSON.stringify(prefs));
}
