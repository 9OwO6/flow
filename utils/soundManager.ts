/**
 * Legacy entry points — delegate to Delight Pack (prefs + reduce motion aware).
 */
import { delight, type DelightKind } from '@/utils/delight';

function play(kind: DelightKind) {
  return delight.play(kind);
}

export const playHapticFeedback = () => play('tap');

export const playPoopSound = () => play('tap');

export const playSuccessSound = () => play('success');

export const playClickSound = () => play('tap');

export const playWarningSound = () => play('warning');
