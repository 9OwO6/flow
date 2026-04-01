import type { TFunction } from 'i18next';

export type CelebrationTone = 'normal' | 'silly';

const NORMAL_KEYS = ['celebration.n1', 'celebration.n2', 'celebration.n3', 'celebration.n4', 'celebration.n5'] as const;
const SILLY_KEYS = ['celebration.s1', 'celebration.s2', 'celebration.s3', 'celebration.s4', 'celebration.s5'] as const;

export function pickCelebrationMessage(t: TFunction, tone: CelebrationTone): string {
  const keys = tone === 'silly' ? SILLY_KEYS : NORMAL_KEYS;
  const k = keys[Math.floor(Math.random() * keys.length)];
  return t(k);
}

export function pickCelebrationDurationMs(): number {
  return 800 + Math.floor(Math.random() * 400);
}
