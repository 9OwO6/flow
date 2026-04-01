/**
 * Delight Pack v1 — timing and tuning (keep animations 0.6–1s total where applicable).
 */
export const DelightTokens = {
  motion: {
    pressInMs: 90,
    pressOutMs: 110,
    pressScaleDown: 0.97,
    /** Success pulse: scale segment durations (sum within ~0.6–0.9s) */
    successScaleUpMs: 150,
    successScalePeak: 1.09,
    /** Spring settle after peak (replacing linear scale-down for organic feel) */
    successSettleFriction: 7,
    successSettleTension: 68,
    pressReleaseFriction: 8,
    pressReleaseTension: 128,
    /** Tab content cross-fade */
    tabContentFadeMs: 280,
    tabContentOpacityFrom: 0.92,
    /** Reduce-motion “opacity flash” — minimal duration for one frame of visibility */
    reduceMotionOpacityMs: 16,
    reduceMotionOpacityDip: 0.88,
  },
  sound: {
    /** Minimum gap between automated success samples (anti-stacking) */
    minSuccessIntervalMs: 380,
    defaultVolume: 0.4,
  },
} as const;
