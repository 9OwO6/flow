export interface DelightPreferences {
  sound: boolean;
  haptics: boolean;
  enhancedMotion: boolean;
  /** Master switch for post-save SuccessCelebration overlay */
  celebrationEnabled: boolean;
  /** Silly copy + confetti on every successful save (still rate-limited globally) */
  celebrationSillyMode: boolean;
}

/** Defaults: quiet by default; motion + haptics on */
export const DEFAULT_DELIGHT_PREFERENCES: DelightPreferences = {
  sound: false,
  haptics: true,
  enhancedMotion: true,
  celebrationEnabled: true,
  celebrationSillyMode: false,
};

export type DelightKind = 'tap' | 'success' | 'delete' | 'warning';
