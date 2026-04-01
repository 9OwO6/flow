import { StorageService } from './storage';
import { UserSettings } from '@/types';

export interface ReminderStatus {
  shouldRemind: boolean;
  daysSinceLastPoop: number;
  message: string;
  type: 'poop' | 'water' | 'none';
}

export class ReminderService {
  // 检查是否需要提醒
  static async checkReminders(): Promise<ReminderStatus> {
    const settings = await StorageService.getUserSettings();
    const lastRecord = await StorageService.getLastRecord();

    if (!lastRecord) {
      // 没有记录，检查是否超过阈值
      const firstRecord = await StorageService.getAllRecords();
      if (firstRecord.length === 0) {
        // 完全没有记录，不提醒
        return {
          shouldRemind: false,
          daysSinceLastPoop: 0,
          message: '',
          type: 'none',
        };
      }
    }

    // 计算距离上次排便的天数
    const now = Date.now();
    const lastPoopTime = lastRecord ? lastRecord.timestamp : 0;
    const daysSinceLastPoop = Math.floor((now - lastPoopTime) / (1000 * 60 * 60 * 24));

    // 检查是否超过阈值
    if (settings.reminderEnabled && daysSinceLastPoop >= settings.maxDaysWithoutPoop) {
      return {
        shouldRemind: true,
        daysSinceLastPoop,
        message: `您已经 ${daysSinceLastPoop} 天没有排便了，记得多喝水、多吃高纤维食物哦！`,
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

  // 获取距离上次排便的时间描述
  static async getLastPoopTimeDescription(): Promise<string> {
    const lastRecord = await StorageService.getLastRecord();
    if (!lastRecord) {
      return '暂无记录';
    }

    const now = Date.now();
    const diff = now - lastRecord.timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} 天前`;
    } else if (hours > 0) {
      return `${hours} 小时前`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes > 0 ? `${minutes} 分钟前` : '刚刚';
    }
  }
}

