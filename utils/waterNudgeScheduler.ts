import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { AppState, Platform } from 'react-native';
import { StorageService } from '@/utils/storage';
import type { UserSettings } from '@/types';
import i18n from '@/utils/i18n';

const NUDGE_IDS_KEY = 'water_nudge_pending_ids_v1';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function parseHm(s: string): number {
  const parts = (s || '00:00').split(':');
  const h = Number(parts[0]) || 0;
  const m = Number(parts[1]) || 0;
  return h * 60 + m;
}

function minutesOfDate(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

/** True if local time is inside quiet window (handles overnight e.g. 22:00–07:00). */
export function isInQuietHours(d: Date, settings: UserSettings): boolean {
  const mm = minutesOfDate(d);
  const start = parseHm(settings.sleepQuietHoursStart || '22:00');
  const end = parseHm(settings.sleepQuietHoursEnd || '07:00');
  if (start <= end) return mm >= start && mm < end;
  return mm >= start || mm < end;
}

function skipQuietForward(d: Date, settings: UserSettings): Date {
  let t = new Date(d);
  for (let i = 0; i < 192; i++) {
    if (!isInQuietHours(t, settings)) return t;
    t = new Date(t.getTime() + 15 * 60 * 1000);
  }
  return d;
}

/** Up to 3 future times: first at least `minFirstDelayMs` from `from`, then +3h each, outside quiet hours. */
export function computeWaterNudgeSlots(
  from: Date,
  settings: UserSettings,
  minFirstDelayMs: number
): Date[] {
  const GAP_MS = 3 * 60 * 60 * 1000;
  const out: Date[] = [];
  let t = new Date(Math.max(from.getTime() + minFirstDelayMs, from.getTime() + 60 * 1000));
  t = skipQuietForward(t, settings);
  for (let k = 0; k < 3; k++) {
    if (out.length > 0) {
      t = new Date(out[out.length - 1].getTime() + GAP_MS);
      t = skipQuietForward(t, settings);
    }
    if (t.getTime() <= from.getTime()) break;
    out.push(new Date(t));
  }
  return out;
}

const BODY_KEYS = ['water.nudgeBody1', 'water.nudgeBody2', 'water.nudgeBody3', 'water.nudgeBody4'] as const;

function pickNudgeBody(): string {
  const k = BODY_KEYS[Math.floor(Math.random() * BODY_KEYS.length)];
  return i18n.t(k);
}

async function loadPendingIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(NUDGE_IDS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

async function savePendingIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(NUDGE_IDS_KEY, JSON.stringify(ids));
}

export async function cancelScheduledWaterNudges(): Promise<void> {
  const ids = await loadPendingIds();
  for (const id of ids) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      /* ignore */
    }
  }
  await savePendingIds([]);
}

export async function ensureWaterNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === 'granted';
}

/**
 * Reschedule gentle hydration nudges. Call on app start and when returning to foreground.
 */
export async function syncWaterNudgeSchedule(): Promise<void> {
  if (Platform.OS === 'web') return;

  await cancelScheduledWaterNudges();

  const settings = await StorageService.getUserSettings();
  if (!settings.waterReminderEnabled) return;

  const perm = await Notifications.getPermissionsAsync();
  if (perm.status !== 'granted') return;

  const now = new Date();
  const slots = computeWaterNudgeSlots(now, settings, 3 * 60 * 60 * 1000);
  const newIds: string[] = [];

  for (let i = 0; i < slots.length; i++) {
    const when = slots[i];
    const sec = Math.floor((when.getTime() - now.getTime()) / 1000);
    if (sec < 60) continue;

    const id = `water-nudge-${Date.now()}-${i}`;
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: i18n.t('water.nudgeTitle'),
        body: pickNudgeBody(),
        data: { type: 'water-nudge' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: sec,
      },
    });
    newIds.push(id);
  }

  await savePendingIds(newIds);
}

let appStateSub: ReturnType<typeof AppState.addEventListener> | null = null;

export function registerWaterNudgeAppStateResync(): () => void {
  if (Platform.OS === 'web') return () => {};

  if (appStateSub) {
    appStateSub.remove();
    appStateSub = null;
  }

  appStateSub = AppState.addEventListener('change', (next) => {
    if (next === 'active') {
      void syncWaterNudgeSchedule();
    }
  });

  return () => {
    appStateSub?.remove();
    appStateSub = null;
  };
}

export type WaterNudgeOpenHandler = () => void;

let waterQuickHandler: WaterNudgeOpenHandler | null = null;

export function setWaterQuickLogHandler(fn: WaterNudgeOpenHandler | null): void {
  waterQuickHandler = fn;
}

export function openWaterQuickFromNotification(): void {
  waterQuickHandler?.();
}

export function subscribeWaterNotificationOpen(handler: WaterNudgeOpenHandler): () => void {
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as { type?: string } | undefined;
    if (data?.type === 'water-nudge') handler();
  });

  return () => sub.remove();
}
