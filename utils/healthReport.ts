import { StorageService } from './storage';
import { PoopRecord, SmoothLevel } from '@/types';
import i18n from '@/utils/i18n';

export interface HealthReport {
  period: string; // 报告期间
  totalRecords: number;
  averagePerDay: number;
  averageSmoothLevel: number;
  smoothLevelDistribution: { level: SmoothLevel; count: number; percentage: number }[];
  longestGap: number; // 最长间隔天数
  shortestGap: number; // 最短间隔天数
  averageGap: number; // 平均间隔天数
  consistency: 'excellent' | 'good' | 'fair' | 'poor'; // 规律性评级
  smoothness: 'excellent' | 'good' | 'fair' | 'poor'; // 顺畅度评级
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor'; // 整体健康评级
  recommendations: string[]; // 健康建议
  trends: string[]; // 趋势分析
  dailyPattern: { date: string; count: number; smoothLevel: number }[]; // 每日模式
  timePattern: { hour: number; count: number }[]; // 时间模式
  healthScore: number; // 健康评分 (0-100)
}

export class HealthReportService {
  // 生成周报告
  static async generateWeeklyReport(startDate: Date): Promise<HealthReport> {
    try {
      if (__DEV__) console.log('Generating weekly report, start date:', startDate);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      if (__DEV__) console.log('Date range:', startDateStr, 'to', endDateStr);
      
      const records = await StorageService.getRecordsByDateRange(startDateStr, endDateStr);
      if (__DEV__) console.log('Found records count:', records.length);
      
      return this.analyzeRecords(records, 'weekly', startDateStr, endDateStr);
    } catch (error) {
      console.error('Error generating weekly report:', error);
      throw error;
    }
  }

  // 生成月报告
  static async generateMonthlyReport(year: number, month: number): Promise<HealthReport> {
    try {
      if (__DEV__) console.log('Generating monthly report, year:', year, 'month:', month);
      
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      if (__DEV__) console.log('Date range:', startDateStr, 'to', endDateStr);
      
      const records = await StorageService.getRecordsByDateRange(startDateStr, endDateStr);
      if (__DEV__) console.log('Found records count:', records.length);
      
      return this.analyzeRecords(records, 'monthly', startDateStr, endDateStr);
    } catch (error) {
      console.error('Error generating monthly report:', error);
      throw error;
    }
  }

  private static analyzeRecords(records: PoopRecord[], reportType: 'weekly' | 'monthly', startDate: string, endDate: string): HealthReport {
    try {
      if (__DEV__) console.log('Starting record analysis, record count:', records.length);
      
      if (records.length === 0) {
        if (__DEV__) console.log('No records, generating empty report');
        return this.generateEmptyReport(reportType, startDate, endDate);
      }

      // 基础统计
      const totalRecords = records.length;
      const daysInPeriod = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const averagePerDay = totalRecords / daysInPeriod;
      
      if (__DEV__) console.log('Basic statistics completed, total records:', totalRecords, 'days:', daysInPeriod, 'daily average:', averagePerDay);
    
    // 顺畅度分析
    const smoothLevelSum = records.reduce((sum, record) => sum + record.smoothLevel, 0);
    const averageSmoothLevel = smoothLevelSum / totalRecords;
    
    // 顺畅度分布
    const smoothLevelDistribution = [
      SmoothLevel.VERY_DIFFICULT,
      SmoothLevel.DIFFICULT,
      SmoothLevel.NORMAL,
      SmoothLevel.SMOOTH,
      SmoothLevel.VERY_SMOOTH
    ].map(level => {
      const count = records.filter(r => r.smoothLevel === level).length;
      return {
        level,
        count,
        percentage: (count / totalRecords) * 100
      };
    });

    // 间隔分析
    const gaps = this.calculateGaps(records);
    const longestGap = Math.max(...gaps);
    const shortestGap = Math.min(...gaps);
    const averageGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;

    // 评级计算
    const consistency = this.rateConsistency(averageGap, longestGap);
    const smoothness = this.rateSmoothness(averageSmoothLevel);
    const overallHealth = this.calculateOverallHealth(consistency, smoothness, averagePerDay);

    // 健康评分
    const healthScore = this.calculateHealthScore(consistency, smoothness, averagePerDay, longestGap);

    // 每日模式
    const dailyPattern = this.analyzeDailyPattern(records, startDate, endDate);

    // 时间模式
    const timePattern = this.analyzeTimePattern(records);

    // 生成建议和趋势
    const recommendations = this.generateRecommendations(consistency, smoothness, averagePerDay, longestGap, averageSmoothLevel);
    const trends = this.analyzeTrends(records, dailyPattern);

    return {
      period: i18n.t('healthReport.periodRange', { start: startDate, end: endDate }),
      totalRecords,
      averagePerDay,
      averageSmoothLevel,
      smoothLevelDistribution,
      longestGap,
      shortestGap,
      averageGap,
      consistency,
      smoothness,
      overallHealth,
      recommendations,
      trends,
      dailyPattern,
      timePattern,
      healthScore
    };
    } catch (error) {
      console.error('分析记录时出错:', error);
      throw error;
    }
  }

  private static generateEmptyReport(_reportType: 'weekly' | 'monthly', startDate: string, endDate: string): HealthReport {
    return {
      period: i18n.t('healthReport.periodRange', { start: startDate, end: endDate }),
      totalRecords: 0,
      averagePerDay: 0,
      averageSmoothLevel: 0,
      smoothLevelDistribution: [],
      longestGap: 0,
      shortestGap: 0,
      averageGap: 0,
      consistency: 'poor',
      smoothness: 'poor',
      overallHealth: 'poor',
      recommendations: [i18n.t('healthReport.emptyStart')],
      trends: [i18n.t('healthReport.noTrendData')],
      dailyPattern: [],
      timePattern: [],
      healthScore: 0
    };
  }

  private static calculateGaps(records: PoopRecord[]): number[] {
    const sortedRecords = records.sort((a, b) => a.timestamp - b.timestamp);
    const gaps: number[] = [];
    
    for (let i = 1; i < sortedRecords.length; i++) {
      const gap = Math.ceil((sortedRecords[i].timestamp - sortedRecords[i-1].timestamp) / (1000 * 60 * 60 * 24));
      gaps.push(gap);
    }
    
    return gaps.length > 0 ? gaps : [0];
  }

  private static rateConsistency(averageGap: number, longestGap: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (averageGap <= 1.5 && longestGap <= 3) return 'excellent';
    if (averageGap <= 2 && longestGap <= 4) return 'good';
    if (averageGap <= 3 && longestGap <= 6) return 'fair';
    return 'poor';
  }

  private static rateSmoothness(averageSmoothLevel: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (averageSmoothLevel >= 4.5) return 'excellent';
    if (averageSmoothLevel >= 3.5) return 'good';
    if (averageSmoothLevel >= 2.5) return 'fair';
    return 'poor';
  }

  private static calculateOverallHealth(
    consistency: 'excellent' | 'good' | 'fair' | 'poor',
    smoothness: 'excellent' | 'good' | 'fair' | 'poor',
    averagePerDay: number
  ): 'excellent' | 'good' | 'fair' | 'poor' {
    const consistencyScore = { excellent: 4, good: 3, fair: 2, poor: 1 }[consistency];
    const smoothnessScore = { excellent: 4, good: 3, fair: 2, poor: 1 }[smoothness];
    const frequencyScore = averagePerDay >= 0.8 && averagePerDay <= 2 ? 4 : 
                          averagePerDay >= 0.5 && averagePerDay <= 3 ? 3 :
                          averagePerDay >= 0.3 && averagePerDay <= 4 ? 2 : 1;
    
    const averageScore = (consistencyScore + smoothnessScore + frequencyScore) / 3;
    
    if (averageScore >= 3.5) return 'excellent';
    if (averageScore >= 2.5) return 'good';
    if (averageScore >= 1.5) return 'fair';
    return 'poor';
  }

  private static calculateHealthScore(
    consistency: 'excellent' | 'good' | 'fair' | 'poor',
    smoothness: 'excellent' | 'good' | 'fair' | 'poor',
    averagePerDay: number,
    longestGap: number
  ): number {
    let score = 0;
    
    // 规律性评分 (30分)
    const consistencyScore = { excellent: 30, good: 25, fair: 15, poor: 5 }[consistency];
    score += consistencyScore;
    
    // 顺畅度评分 (30分)
    const smoothnessScore = { excellent: 30, good: 25, fair: 15, poor: 5 }[smoothness];
    score += smoothnessScore;
    
    // 频率评分 (25分)
    const frequencyScore = averagePerDay >= 0.8 && averagePerDay <= 2 ? 25 :
                          averagePerDay >= 0.5 && averagePerDay <= 3 ? 20 :
                          averagePerDay >= 0.3 && averagePerDay <= 4 ? 15 : 5;
    score += frequencyScore;
    
    // 最长间隔评分 (15分)
    const gapScore = longestGap <= 2 ? 15 :
                    longestGap <= 4 ? 10 :
                    longestGap <= 6 ? 5 : 0;
    score += gapScore;
    
    return Math.round(score);
  }

  private static analyzeDailyPattern(records: PoopRecord[], startDate: string, endDate: string) {
    const pattern: { date: string; count: number; smoothLevel: number }[] = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayRecords = records.filter(r => r.date === dateStr);
      const count = dayRecords.length;
      const smoothLevel = count > 0 ? 
        dayRecords.reduce((sum, r) => sum + r.smoothLevel, 0) / count : 0;
      
      pattern.push({ date: dateStr, count, smoothLevel });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return pattern;
  }

  private static analyzeTimePattern(records: PoopRecord[]) {
    const timeCounts: { [hour: number]: number } = {};
    
    records.forEach(record => {
      const hour = parseInt(record.time.split(':')[0]);
      timeCounts[hour] = (timeCounts[hour] || 0) + 1;
    });
    
    return Object.entries(timeCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour);
  }

  private static generateRecommendations(
    consistency: 'excellent' | 'good' | 'fair' | 'poor',
    smoothness: 'excellent' | 'good' | 'fair' | 'poor',
    averagePerDay: number,
    longestGap: number,
    averageSmoothLevel: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (consistency === 'poor') {
      recommendations.push(i18n.t('healthReport.rec_cp1'));
      recommendations.push(i18n.t('healthReport.rec_cp2'));
      recommendations.push(i18n.t('healthReport.rec_cp3'));
    } else if (consistency === 'fair') {
      recommendations.push(i18n.t('healthReport.rec_cf1'));
      recommendations.push(i18n.t('healthReport.rec_cf2'));
    }

    if (smoothness === 'poor') {
      recommendations.push(i18n.t('healthReport.rec_sp1'));
      recommendations.push(i18n.t('healthReport.rec_sp2'));
      recommendations.push(i18n.t('healthReport.rec_sp3'));
    } else if (smoothness === 'fair') {
      recommendations.push(i18n.t('healthReport.rec_sf1'));
      recommendations.push(i18n.t('healthReport.rec_sf2'));
    }

    if (averagePerDay < 0.5) {
      recommendations.push(i18n.t('healthReport.rec_fl1'));
      recommendations.push(i18n.t('healthReport.rec_fl2'));
    } else if (averagePerDay > 3) {
      recommendations.push(i18n.t('healthReport.rec_fh1'));
    }

    if (longestGap > 4) {
      recommendations.push(i18n.t('healthReport.rec_gap1'));
    }

    if (consistency === 'excellent' && smoothness === 'excellent') {
      recommendations.push(i18n.t('healthReport.rec_pos1'));
    }
    
    return recommendations;
  }

  private static analyzeTrends(records: PoopRecord[], dailyPattern: { date: string; count: number; smoothLevel: number }[]): string[] {
    const trends: string[] = [];
    
    if (records.length < 2) {
      trends.push(i18n.t('healthReport.trendDataShort'));
      return trends;
    }

    const recentCount = dailyPattern.slice(-3).reduce((sum, day) => sum + day.count, 0);
    const earlierCount = dailyPattern.slice(-6, -3).reduce((sum, day) => sum + day.count, 0);

    if (recentCount > earlierCount * 1.2) {
      trends.push(i18n.t('healthReport.trendFreqUp'));
    } else if (recentCount < earlierCount * 0.8) {
      trends.push(i18n.t('healthReport.trendFreqDown'));
    } else {
      trends.push(i18n.t('healthReport.trendFreqStable'));
    }

    const recentDays = dailyPattern.slice(-3).filter((day) => day.count > 0);
    const earlierDays = dailyPattern.slice(-6, -3).filter((day) => day.count > 0);
    if (recentDays.length === 0 || earlierDays.length === 0) {
      trends.push(i18n.t('healthReport.trendDataShort'));
      return trends;
    }
    const recentSmooth =
      recentDays.reduce((sum, day) => sum + day.smoothLevel, 0) / recentDays.length;
    const earlierSmooth =
      earlierDays.reduce((sum, day) => sum + day.smoothLevel, 0) / earlierDays.length;

    if (recentSmooth > earlierSmooth + 0.5) {
      trends.push(i18n.t('healthReport.trendSmoothUp'));
    } else if (recentSmooth < earlierSmooth - 0.5) {
      trends.push(i18n.t('healthReport.trendSmoothDown'));
    } else {
      trends.push(i18n.t('healthReport.trendSmoothStable'));
    }
    
    return trends;
  }

  static getRatingText(rating: 'excellent' | 'good' | 'fair' | 'poor'): string {
    return i18n.t(`health.${rating}`);
  }

  // 获取评级的颜色
  static getRatingColor(rating: 'excellent' | 'good' | 'fair' | 'poor'): string {
    const colorMap = {
      excellent: '#4ECDC4',
      good: '#6BCF7F',
      fair: '#FFD93D',
      poor: '#FF6B6B'
    };
    return colorMap[rating];
  }
} 
