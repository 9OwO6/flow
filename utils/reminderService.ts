import { StorageService } from './storage';
import { UserSettings } from '@/types';
import i18n from '@/utils/i18n';

export interface ReminderStatus {
  shouldRemind: boolean;
  daysSinceLastPoop: number;
  message: string;
  type: 'poop' | 'water' | 'none';
}

export class ReminderService {
  static async checkReminders(): Promise<ReminderStatus> {
    const settings = await StorageService.getUserSettings();
    const lastRecord = await StorageService.getLastRecord();

    if (!lastRecord) {
      const firstRecord = await StorageService.getAllRecords();
      if (firstRecord.length === 0) {
        return {
          shouldRemind: false,
          daysSinceLastPoop: 0,
          message: '',
          type: 'none',
        };
      }
    }

    const now = Date.now();
    const lastPoopTime = lastRecord ? lastRecord.timestamp : 0;
    const daysSinceLastPoop = Math.floor((now - lastPoopTime) / (1000 * 60 * 60 * 24));

    if (settings.reminderEnabled && daysSinceLastPoop >= settings.maxDaysWithoutPoop) {
      return {
        shouldRemind: true,
        daysSinceLastPoop,
        message: i18n.t('reminder.poopStreakMessage', { days: daysSinceLastPoop }),
        type: 'poop',
      };
    }

    return {
      shouldRemind: false,
      daysSinceLastPoop,
      message: '',
      type: 'none',
    };
  }

  /** Human-readable relative time; always localized via `time.*` keys (never hardcoded locale strings). */
  static async getLastPoopTimeDescription(): Promise<string> {
    const lastRecord = await StorageService.getLastRecord();
    if (!lastRecord) {
      return i18n.t('time.noRecords');
    }

    const now = Date.now();
    const diff = now - lastRecord.timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? i18n.t('time.dayAgo') : i18n.t('time.daysAgo', { count: days });
    }
    if (hours > 0) {
      return hours === 1 ? i18n.t('time.hourAgo') : i18n.t('time.hoursAgo', { count: hours });
    }
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 0) {
      return minutes === 1 ? i18n.t('time.minuteAgo') : i18n.t('time.minutesAgo', { count: minutes });
    }
    return i18n.t('time.justNow');
  }
}
