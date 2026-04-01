import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

export const CUSTOM_SUCCESS_SOUNDS_STORAGE_KEY = 'custom_success_sounds_v1';

const REL_DIR = 'custom_success_sounds';

/** Max imported / recorded clip size (bytes) */
export const CUSTOM_SUCCESS_MAX_BYTES = 2 * 1024 * 1024;

export type SlotIndex = 0 | 1 | 2;

export interface CustomSuccessSoundsPreferences {
  /** When true and at least one valid file exists, play custom instead of bundled success sound */
  useCustom: boolean;
  /** Pick uniformly among occupied slots when true; otherwise always play the first occupied slot */
  random: boolean;
  /** Basenames only, e.g. slot_0.m4a — resolved under documentDirectory/custom_success_sounds/ */
  slots: [string | null, string | null, string | null];
}

export const DEFAULT_CUSTOM_SUCCESS_SOUNDS: CustomSuccessSoundsPreferences = {
  useCustom: false,
  random: false,
  slots: [null, null, null],
};

export async function getCustomSuccessSoundsPreferences(): Promise<CustomSuccessSoundsPreferences> {
  try {
    const raw = await AsyncStorage.getItem(CUSTOM_SUCCESS_SOUNDS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CUSTOM_SUCCESS_SOUNDS, slots: [null, null, null] };
    const parsed = JSON.parse(raw) as Partial<CustomSuccessSoundsPreferences>;
    const slots = parsed.slots;
    const tuple: [string | null, string | null, string | null] = [
      slots?.[0] ?? null,
      slots?.[1] ?? null,
      slots?.[2] ?? null,
    ];
    return {
      ...DEFAULT_CUSTOM_SUCCESS_SOUNDS,
      ...parsed,
      slots: tuple,
    };
  } catch {
    return { ...DEFAULT_CUSTOM_SUCCESS_SOUNDS, slots: [null, null, null] };
  }
}

export async function saveCustomSuccessSoundsPreferences(
  prefs: CustomSuccessSoundsPreferences
): Promise<void> {
  await AsyncStorage.setItem(CUSTOM_SUCCESS_SOUNDS_STORAGE_KEY, JSON.stringify(prefs));
}

export function getCustomSoundsDir(): string {
  const base = FileSystem.documentDirectory;
  if (!base) return '';
  return `${base}${REL_DIR}/`;
}

export async function ensureCustomSoundsDir(): Promise<void> {
  const dir = getCustomSoundsDir();
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

function slotBasename(slot: SlotIndex, ext: string): string {
  const clean = ext.replace(/^\./, '').toLowerCase() || 'm4a';
  return `slot_${slot}.${clean}`;
}

async function deleteFileIfExists(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch {
    /* ignore */
  }
}

/** Ordered list of file URIs for non-empty slots that still exist on disk */
export async function resolveExistingUris(
  slots: [string | null, string | null, string | null]
): Promise<string[]> {
  const base = getCustomSoundsDir();
  const out: string[] = [];
  for (const name of slots) {
    if (!name) continue;
    const uri = `${base}${name}`;
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists && info.size !== undefined && info.size > 0) {
        out.push(uri);
      }
    } catch {
      /* skip missing */
    }
  }
  return out;
}

function extFromPickerName(name: string | undefined, mime: string | undefined): string {
  if (name) {
    const m = /\.([a-z0-9]+)$/i.exec(name);
    if (m) return m[1].toLowerCase();
  }
  if (mime?.includes('mpeg')) return 'mp3';
  if (mime?.includes('wav')) return 'wav';
  if (mime?.includes('mp4') || mime?.includes('aac') || mime?.includes('m4a')) return 'm4a';
  return 'm4a';
}

/**
 * Copy picked or recorded file into slot; updates `slots[slot]` basename.
 * Removes previous file for that slot if basename changes.
 */
export async function importAudioToSlot(
  prefs: CustomSuccessSoundsPreferences,
  slot: SlotIndex,
  sourceUri: string,
  pickerName?: string,
  pickerMime?: string
): Promise<CustomSuccessSoundsPreferences> {
  await ensureCustomSoundsDir();
  const ext = extFromPickerName(pickerName, pickerMime);
  const baseName = slotBasename(slot, ext);
  const dest = `${getCustomSoundsDir()}${baseName}`;

  const prev = prefs.slots[slot];
  if (prev && prev !== baseName) {
    await deleteFileIfExists(`${getCustomSoundsDir()}${prev}`);
  }

  await FileSystem.copyAsync({ from: sourceUri, to: dest });

  const info = await FileSystem.getInfoAsync(dest);
  if (!info.exists || info.size === 0) {
    await deleteFileIfExists(dest);
    throw new Error('COPY_FAILED');
  }
  if (info.size != null && info.size > CUSTOM_SUCCESS_MAX_BYTES) {
    await deleteFileIfExists(dest);
    throw new Error('FILE_TOO_LARGE');
  }

  const nextSlots: [string | null, string | null, string | null] = [...prefs.slots];
  nextSlots[slot] = baseName;
  const next: CustomSuccessSoundsPreferences = { ...prefs, slots: nextSlots };
  await saveCustomSuccessSoundsPreferences(next);
  return next;
}

export async function finalizeRecordingToSlot(
  prefs: CustomSuccessSoundsPreferences,
  slot: SlotIndex,
  tempUri: string
): Promise<CustomSuccessSoundsPreferences> {
  return importAudioToSlot(prefs, slot, tempUri, `slot_${slot}.m4a`, 'audio/m4a');
}

export async function clearSlot(
  prefs: CustomSuccessSoundsPreferences,
  slot: SlotIndex
): Promise<CustomSuccessSoundsPreferences> {
  const name = prefs.slots[slot];
  if (name) {
    await deleteFileIfExists(`${getCustomSoundsDir()}${name}`);
  }
  const nextSlots: [string | null, string | null, string | null] = [...prefs.slots];
  nextSlots[slot] = null;
  const next: CustomSuccessSoundsPreferences = { ...prefs, slots: nextSlots };
  await saveCustomSuccessSoundsPreferences(next);
  return next;
}
