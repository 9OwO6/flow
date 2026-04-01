import { StorageService } from './storage';
import { PoopRecord } from '@/types';
import i18n from 'i18next';

export interface HealthAlert {
  type: 'warning' | 'reminder' | 'success' | 'info';
  title: string;
  message: string;
  emoji: string;
  actions?: Array<{
    text: string;
    action: () => void;
  }>;
}

class HealthManager {
  private readonly WARNING_DAYS = 2; // 2天未记录发出警告
  private readonly CRITICAL_DAYS = 4; // 4天未记录发出严重警告

  /** No minimum time between records; users typically log once per day by habit. */
  async canRecord(): Promise<{ canRecord: boolean; alert?: HealthAlert }> {
    return { canRecord: true };
  }

  // 获取健康状态评估
  async getHealthStatus(): Promise<HealthAlert | null> {
    try {
      const records = await StorageService.getAllRecords();
      
      if (records.length === 0) {
        return {
          type: 'info',
          title: i18n.t('healthManager.start.title'),
          message: i18n.t('healthManager.start.message'),
          emoji: '🚀',
        };
      }

      const lastRecord = records[0];
      const daysSinceLastRecord = this.getDaysSince(lastRecord.timestamp);

      // 检查便秘情况
      if (daysSinceLastRecord >= this.CRITICAL_DAYS) {
        return {
          type: 'warning',
          title: i18n.t('healthManager.constipation.title'),
          message: i18n.t('healthManager.constipation.message', { days: daysSinceLastRecord }),
          emoji: '🚨',
          actions: [
            {
              text: i18n.t('healthManager.constipation.recordNow'),
              action: () => {
                // 打开记录模态框
              },
            },
          ],
        };
      } else if (daysSinceLastRecord >= this.WARNING_DAYS) {
        return {
          type: 'reminder',
          title: i18n.t('healthManager.reminder.title'),
          message: i18n.t('healthManager.reminder.message', { days: daysSinceLastRecord }),
          emoji: '💦',
        };
      }

      // 检查最近的健康趋势
      const recentRecords = records.slice(0, 7); // 最近7条记录
      const healthTip = this.getHealthTip(recentRecords);
      
      if (healthTip) {
        return healthTip;
      }

      return null;
    } catch (error) {
      console.error('Error getting health status:', error);
      return null;
    }
  }

  // 获取个性化健康建议
  private getHealthTip(recentRecords: PoopRecord[]): HealthAlert | null {
    if (recentRecords.length < 3) return null;

    // 分析顺畅度趋势
    const avgSmoothLevel = recentRecords.reduce((sum, record) => sum + record.smoothLevel, 0) / recentRecords.length;

    if (avgSmoothLevel <= 2) {
      return {
        type: 'info',
        title: i18n.t('healthManager.improvement.title'),
        message: i18n.t('healthManager.improvement.message'),
        emoji: '📝',
      };
    } else if (avgSmoothLevel >= 4) {
      return {
        type: 'success',
        title: i18n.t('healthManager.excellent.title'),
        message: i18n.t('healthManager.excellent.message'),
        emoji: '👏',
      };
    }

    return null;
  }

  // 获取鼓励性消息
  getMotivationalMessage(recordCount: number): string {
    const messages = i18n.t('healthManager.motivational.messages', { returnObjects: true }) as string[];

    if (recordCount === 1) {
      return i18n.t('healthManager.motivational.firstRecord');
    } else if (recordCount === 7) {
      return i18n.t('healthManager.motivational.weekRecord');
    } else if (recordCount === 30) {
      return i18n.t('healthManager.motivational.monthRecord');
    } else if (recordCount % 10 === 0) {
      return i18n.t('healthManager.motivational.milestone', { count: recordCount });
    }

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // 计算天数差
  private getDaysSince(timestamp: number): number {
    const now = new Date();
    const recordDate = new Date(timestamp);
    const diffTime = now.getTime() - recordDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // 获取健康评分
  async getHealthScore(): Promise<{ score: number; level: string; color: string }> {
    try {
      const records = await StorageService.getRecentRecords();
      
      if (records.length === 0) {
        return { score: 0, level: i18n.t('healthManager.healthScore.startRecording'), color: '#A0AEC0' };
      }

      // 基于记录频率和顺畅度计算健康评分
      const avgSmoothLevel = records.reduce((sum, record) => sum + record.smoothLevel, 0) / records.length;
      const frequencyScore = Math.min(records.length * 2, 100); // 记录频率得分
      const smoothnessScore = (avgSmoothLevel / 5) * 100; // 顺畅度得分
      
      const totalScore = Math.round((frequencyScore + smoothnessScore) / 2);

      let level = i18n.t('healthManager.healthScore.needsImprovement');
      let color = '#FC8181';

      if (totalScore >= 80) {
        level = i18n.t('healthManager.healthScore.excellent');
        color = '#68D391';
      } else if (totalScore >= 60) {
        level = i18n.t('healthManager.healthScore.good');
        color = '#A8E6A3';
      } else if (totalScore >= 40) {
        level = i18n.t('healthManager.healthScore.good');
        color = '#F6E05E';
      }

      return { score: totalScore, level, color };
    } catch (error) {
      console.error('Error calculating health score:', error);
      return { score: 0, level: i18n.t('healthManager.healthScore.calculationError'), color: '#FC8181' };
    }
  }
}

export const healthManager = new HealthManager(); 