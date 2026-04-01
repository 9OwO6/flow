import * as Haptics from 'expo-haptics';
import { AccessibilityInfo, AppState, type AppStateStatus, NativeEventSubscription, Platform } from 'react-native';
import type { DelightKind, DelightPreferences } from './types';
import { SmoothLevel } from '@/types';
import { DEFAULT_DELIGHT_PREFERENCES } from './types';
import { getDelightPreferences } from './preferences';
import {
  configureDelightAudioMode,
  playSuccessTestSample,
  playSuccessThrottled,
  unloadDelightSounds,
  type CustomSuccessPayload,
} from './soundEngine';
import {
  getCustomSuccessSoundsPreferences,
  resolveExistingUris,
  type CustomSuccessSoundsPreferences,
  DEFAULT_CUSTOM_SUCCESS_SOUNDS,
} from '@/utils/customSuccessSounds';

class DelightController {
  private static instance: DelightController | null = null;

  private prefs: DelightPreferences = { ...DEFAULT_DELIGHT_PREFERENCES };
  private customSuccessSounds: CustomSuccessSoundsPreferences = {
    ...DEFAULT_CUSTOM_SUCCESS_SOUNDS,
    slots: [null, null, null],
  };
  private reduceMotion = false;
  private appStateSub: NativeEventSubscription | null = null;
  private reduceMotionSub: NativeEventSubscription | null = null;
  private initialized = false;

  static getInstance(): DelightController {
    if (!DelightController.instance) {
      DelightController.instance = new DelightController();
    }
    return DelightController.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    try {
      this.prefs = await getDelightPreferences();
    } catch {
      this.prefs = { ...DEFAULT_DELIGHT_PREFERENCES };
    }
    try {
      this.customSuccessSounds = await getCustomSuccessSoundsPreferences();
    } catch {
      this.customSuccessSounds = {
        ...DEFAULT_CUSTOM_SUCCESS_SOUNDS,
        slots: [null, null, null],
      };
    }
    try {
      this.reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
    } catch {
      this.reduceMotion = false;
    }
    this.reduceMotionSub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (v: boolean) => {
        this.reduceMotion = v;
      }
    );
    this.appStateSub = AppState.addEventListener('change', this.onAppState);
    await configureDelightAudioMode();
  }

  private onAppState = (next: AppStateStatus) => {
    if (next === 'background' || next === 'inactive') {
      void unloadDelightSounds();
    }
  };

  dispose(): void {
    this.reduceMotionSub?.remove();
    this.reduceMotionSub = null;
    this.appStateSub?.remove();
    this.appStateSub = null;
    void unloadDelightSounds();
    this.initialized = false;
  }

  async refreshPrefs(): Promise<void> {
    try {
      this.prefs = await getDelightPreferences();
    } catch {
      /* keep previous */
    }
    try {
      this.customSuccessSounds = await getCustomSuccessSoundsPreferences();
    } catch {
      /* keep previous */
    }
  }

  applyPrefs(prefs: DelightPreferences): void {
    this.prefs = { ...prefs };
  }

  getPrefs(): DelightPreferences {
    return { ...this.prefs };
  }

  shouldPlayEnhancedMotion(): boolean {
    return this.prefs.enhancedMotion && !this.reduceMotion;
  }

  isSystemReduceMotion(): boolean {
    return this.reduceMotion;
  }

  /**
   * Sound is only played for `success` (never tap / delete / warning).
   */
  async play(kind: DelightKind): Promise<void> {
    try {
      if (Platform.OS !== 'web' && this.prefs.haptics) {
        if (kind === 'tap') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (kind === 'success') {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        } else if (kind === 'delete') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (kind === 'warning') {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
        }
      }

      if (kind === 'success' && this.prefs.sound) {
        const custom = await this.buildCustomSuccessPayload();
        await playSuccessThrottled(custom);
      }
    } catch {
      /* never block UX */
    }
  }

  /**
   * Quick-record smoothness pager: distinct haptics per level; success chime for NORMAL+ when sound on.
   */
  async playSmoothPick(level: SmoothLevel): Promise<void> {
    try {
      if (Platform.OS !== 'web' && this.prefs.haptics) {
        switch (level) {
          case SmoothLevel.VERY_DIFFICULT:
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case SmoothLevel.DIFFICULT:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case SmoothLevel.NORMAL:
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case SmoothLevel.SMOOTH:
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case SmoothLevel.VERY_SMOOTH:
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        }
      }
    } catch {
      /* non-blocking */
    }
  }

  /** Settings “Test sound” — respects sound toggle */
  async playSuccessTest(): Promise<void> {
    try {
      if (!this.prefs.sound) return;
      await configureDelightAudioMode();
      const custom = await this.buildCustomSuccessPayload();
      await playSuccessTestSample(custom);
    } catch {
      /* non-blocking */
    }
  }

  private async buildCustomSuccessPayload(): Promise<CustomSuccessPayload | null> {
    if (Platform.OS === 'web') return null;
    const p = this.customSuccessSounds;
    if (!p.useCustom) return null;
    const uris = await resolveExistingUris(p.slots);
    if (uris.length === 0) return null;
    return { uris, random: p.random && uris.length > 1 };
  }
}

export const delight = DelightController.getInstance();
