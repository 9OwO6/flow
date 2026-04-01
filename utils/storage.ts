import AsyncStorage from '@react-native-async-storage/async-storage';
import { PoopRecord, ReminderSettings, UserSettings, SmoothLevel } from '@/types';
import { WaterRecord } from '@/types/water';

const STORAGE_KEYS = {
  POOP_RECORDS: 'poop_records',
  REMINDER_SETTINGS: 'reminder_settings',
  USER_SETTINGS: 'user_settings',
  WATER_RECORDS: 'water_records',
  DELIGHT_PREFERENCES: 'delight_preferences_v1',
  WATER_NUDGE_IDS: 'water_nudge_pending_ids_v1',
};

export class StorageService {
  // 获取所有记录
  static async getAllRecords(): Promise<PoopRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.POOP_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting records:', error);
      return [];
    }
  }

  // 添加新记录
  static async addRecord(record: PoopRecord): Promise<void> {
    try {
      const records = await this.getAllRecords();
      records.push(record);
      
      // 按时间倒序排列
      records.sort((a, b) => b.timestamp - a.timestamp);
      
      await AsyncStorage.setItem(STORAGE_KEYS.POOP_RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  }

  // 删除记录
  static async deleteRecord(id: string): Promise<void> {
    try {
      console.log('StorageService: Starting to delete record, ID:', id);
      const records = await this.getAllRecords();
      console.log('StorageService: Current total records:', records.length);
      
      const recordToDelete = records.find(r => r.id === id);
      if (!recordToDelete) {
        console.log('StorageService: Record to delete not found');
        throw new Error('Record to delete not found');
      }
      
      console.log('StorageService: Found record to delete:', recordToDelete);
      const filteredRecords = records.filter(record => record.id !== id);
      console.log('StorageService: Records count after deletion:', filteredRecords.length);
      
      await AsyncStorage.setItem(STORAGE_KEYS.POOP_RECORDS, JSON.stringify(filteredRecords));
      console.log('StorageService: Delete successful');
    } catch (error) {
      console.error('StorageService: Error deleting record:', error);
      throw error;
    }
  }

  // 获取指定日期范围的记录
  static async getRecordsByDateRange(startDate: string, endDate: string): Promise<PoopRecord[]> {
    try {
      const allRecords = await this.getAllRecords();
      return allRecords.filter(record => 
        record.date >= startDate && record.date <= endDate
      );
    } catch (error) {
      console.error('Error getting records by date range:', error);
      return [];
    }
  }

  // 获取最近3个月的记录
  static async getRecentRecords(): Promise<PoopRecord[]> {
    try {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      const startDate = threeMonthsAgo.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];
      
      return await this.getRecordsByDateRange(startDate, endDate);
    } catch (error) {
      console.error('Error getting recent records:', error);
      return [];
    }
  }

  // 获取提醒设置
  static async getReminderSettings(): Promise<ReminderSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REMINDER_SETTINGS);
      return data ? JSON.parse(data) : {
        enabled: true,
        maxDaysWithoutRecord: 2,
        reminderTime: '20:00'
      };
    } catch (error) {
      console.error('Error getting reminder settings:', error);
      return {
        enabled: true,
        maxDaysWithoutRecord: 2,
        reminderTime: '20:00'
      };
    }
  }

  // 保存提醒设置
  static async saveReminderSettings(settings: ReminderSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving reminder settings:', error);
      throw error;
    }
  }

  // 清除所有数据（用于重置）
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.POOP_RECORDS,
        STORAGE_KEYS.REMINDER_SETTINGS,
        STORAGE_KEYS.USER_SETTINGS,
        STORAGE_KEYS.WATER_RECORDS,
        STORAGE_KEYS.DELIGHT_PREFERENCES,
        STORAGE_KEYS.WATER_NUDGE_IDS,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // ========== 用户设置相关 ==========
  static async getUserSettings(): Promise<UserSettings> {
    const defaults: UserSettings = {
      maxDaysWithoutPoop: 3,
      reminderEnabled: true,
      dailyWaterGoal: 2000,
      waterReminderEnabled: false,
      waterReminderTimes: ['09:00', '14:00', '19:00'],
      sleepQuietHoursStart: '22:00',
      sleepQuietHoursEnd: '07:00',
      quickRecordEnabled: true,
      defaultSmoothLevel: SmoothLevel.NORMAL,
      autoBackupEnabled: false,
    };
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data) as Partial<UserSettings>;
        return { ...defaults, ...parsed };
      }
      return defaults;
    } catch (error) {
      console.error('Error getting user settings:', error);
      return defaults;
    }
  }

  static async saveUserSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  }

  // ========== 饮水记录相关 ==========
  static async getAllWaterRecords(): Promise<WaterRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WATER_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting water records:', error);
      return [];
    }
  }

  static async addWaterRecord(record: WaterRecord): Promise<void> {
    try {
      const records = await this.getAllWaterRecords();
      records.push(record);
      records.sort((a, b) => b.timestamp - a.timestamp);
      await AsyncStorage.setItem(STORAGE_KEYS.WATER_RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('Error adding water record:', error);
      throw error;
    }
  }

  static async getWaterRecordsByDate(date: string): Promise<WaterRecord[]> {
    try {
      const allRecords = await this.getAllWaterRecords();
      return allRecords.filter(record => record.date === date);
    } catch (error) {
      console.error('Error getting water records by date:', error);
      return [];
    }
  }

  static async deleteWaterRecord(id: string): Promise<void> {
    try {
      const records = await this.getAllWaterRecords();
      const filteredRecords = records.filter(record => record.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.WATER_RECORDS, JSON.stringify(filteredRecords));
    } catch (error) {
      console.error('Error deleting water record:', error);
      throw error;
    }
  }

  // 获取最后一条排便记录
  static async getLastRecord(): Promise<PoopRecord | null> {
    try {
      const records = await this.getAllRecords();
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      console.error('Error getting last record:', error);
      return null;
    }
  }
} 