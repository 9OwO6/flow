import type { PoopRecord } from '@/types';

/** Minimum time between *new* records (rolling window from latest entry). */
export const MIN_NEW_RECORD_INTERVAL_MS = 3 * 60 * 60 * 1000;

/**
 * @param records Must include the most recent entry first (same order as StorageService.getAllRecords).
 * @returns Minutes until a new record is allowed; 0 if allowed now.
 */
export function getMinutesUntilNewRecordAllowed(records: PoopRecord[]): number {
  if (records.length === 0) return 0;
  const elapsed = Date.now() - records[0].timestamp;
  const remainingMs = MIN_NEW_RECORD_INTERVAL_MS - elapsed;
  if (remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / 60000);
}

export function isNewRecordBlockedByMinInterval(records: PoopRecord[]): boolean {
  return getMinutesUntilNewRecordAllowed(records) > 0;
}
