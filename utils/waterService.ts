import { StorageService } from './storage';
import { WaterRecord, DailyWaterStats } from '@/types/water';
import { UserSettings } from '@/types';

export class WaterService {
  // 获取今日饮水统计
  static async getTodayWaterStats(settings: UserSettings): Promise<DailyWaterStats> {
    const today = new Date().toISOString().split('T')[0];
    const records = await StorageService.getWaterRecordsByDate(today);
    const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
    const goal = settings.dailyWaterGoal || 2000;
    const percentage = goal > 0 ? Math.min(100, Math.round((totalAmount / goal) * 100)) : 0;

    return {
      date: today,
      totalAmount,
      goal,
      percentage,
      records,
    };
  }

  // 添加饮水记录（快捷按钮）
  static async addQuickWater(amount: number): Promise<WaterRecord> {
    const now = new Date();
    const record: WaterRecord = {
      id: `water_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now.getTime(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      amount,
      createdAt: now.getTime(),
    };

    await StorageService.addWaterRecord(record);
    return record;
  }

  // 获取指定日期范围的饮水记录
  static async getWaterRecordsByDateRange(startDate: string, endDate: string): Promise<WaterRecord[]> {
    try {
      const allRecords = await StorageService.getAllWaterRecords();
      return allRecords.filter(record => 
        record.date >= startDate && record.date <= endDate
      );
    } catch (error) {
      console.error('Error getting water records by date range:', error);
      return [];
    }
  }
}

