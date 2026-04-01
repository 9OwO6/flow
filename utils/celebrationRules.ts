/** Rules for layering lightweight confetti (scheme A) on top of minimal celebration (scheme C). */

export type CelebrationConfettiInput = {
  sillyMode: boolean;
  isNewRecord: boolean;
  /** Records on current calendar day before this save (local date string match). */
  todayCountBefore: number;
  /** Total entries after this save (for new: before + 1; for edit: typically same as before). */
  totalCountAfter: number;
};

const MILESTONE_STEP = 10;

export function shouldShowConfettiLayer(input: CelebrationConfettiInput): boolean {
  if (input.sillyMode) return true;
  if (!input.isNewRecord) return false;
  if (input.todayCountBefore === 0) return true;
  if (input.totalCountAfter === 1) return true;
  if (input.totalCountAfter > 0 && input.totalCountAfter % MILESTONE_STEP === 0) return true;
  return false;
}
