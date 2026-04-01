import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import { PoopRecord, SmoothLevel } from '@/types';
import { WaterRecord } from '@/types/water';
import ModernCard from '@/components/design-system/ModernCard';
import SectionHeader from '@/components/design-system/SectionHeader';
import theme from '@/constants/DesignTokens';
import { useTranslation } from 'react-i18next';

interface DataVisualizationProps {
  records: PoopRecord[];
  waterRecords?: WaterRecord[];
  days?: number; // 显示最近多少天的数据，默认7天
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = 120;
const CHART_PADDING = 20;

export default function DataVisualization({ records, waterRecords = [], days = 7 }: DataVisualizationProps) {
  const { t } = useTranslation();
  // 计算最近N天的数据
  const recentData = useMemo(() => {
    const today = new Date();
    const data: Array<{ date: string; count: number; avgSmooth: number; water: number }> = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRecords = records.filter(r => r.date === dateStr);
      const dayWater = waterRecords.filter(r => r.date === dateStr);
      
      data.push({
        date: dateStr,
        count: dayRecords.length,
        avgSmooth: dayRecords.length > 0 
          ? dayRecords.reduce((sum, r) => sum + r.smoothLevel, 0) / dayRecords.length 
          : 0,
        water: dayWater.reduce((sum, r) => sum + r.amount, 0),
      });
    }
    
    return data;
  }, [records, waterRecords, days]);

  // 计算最大值用于缩放
  const maxCount = Math.max(1, ...recentData.map(d => d.count));
  const maxWater = Math.max(1, ...recentData.map(d => d.water));

  // 渲染7天频次图表
  const renderFrequencyChart = () => {
    const barWidth = (SCREEN_WIDTH - CHART_PADDING * 2 - theme.spacing.md * (days - 1)) / days;
    
    return (
      <ModernCard elevation="md" padding="md" style={styles.chartCard}>
        <SectionHeader title={t('dataViz.frequencyTitle', { days })} />
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {recentData.map((item, index) => {
              const barHeight = (item.count / maxCount) * (CHART_HEIGHT - 40);
              const date = new Date(item.date);
              const dayLabel = date.getDate();
              
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(4, barHeight),
                          width: barWidth - 4,
                          backgroundColor: item.count > 0 ? theme.colors.primary : theme.colors.surfaceVariant,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{dayLabel}</Text>
                  {item.count > 0 && (
                    <Text style={styles.barValue}>{item.count}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ModernCard>
    );
  };

  // 渲染趋势图（顺畅度）
  const renderSmoothnessTrend = () => {
    const barWidth = (SCREEN_WIDTH - CHART_PADDING * 2 - theme.spacing.md * (days - 1)) / days;
    
    return (
      <ModernCard elevation="md" padding="md" style={styles.chartCard}>
        <SectionHeader title={t('dataViz.smoothnessTitle')} />
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {recentData.map((item, index) => {
              if (item.count === 0) {
                const date = new Date(item.date);
                return (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: 4,
                            width: barWidth - 4,
                            backgroundColor: theme.colors.surfaceVariant,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{date.getDate()}</Text>
                  </View>
                );
              }
              
              const level = Math.round(item.avgSmooth) as SmoothLevel;
              const levelMap: Record<SmoothLevel, string> = {
                [SmoothLevel.VERY_DIFFICULT]: theme.colors.smoothLevel.veryDifficult,
                [SmoothLevel.DIFFICULT]: theme.colors.smoothLevel.difficult,
                [SmoothLevel.NORMAL]: theme.colors.smoothLevel.normal,
                [SmoothLevel.SMOOTH]: theme.colors.smoothLevel.smooth,
                [SmoothLevel.VERY_SMOOTH]: theme.colors.smoothLevel.verySmooth,
              };
              const color = levelMap[level] || theme.colors.primary;
              const barHeight = (item.avgSmooth / 5) * (CHART_HEIGHT - 40);
              const date = new Date(item.date);
              
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(4, barHeight),
                          width: barWidth - 4,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{date.getDate()}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ModernCard>
    );
  };

  // 渲染相关性分析（饮水和排便）
  const renderCorrelationChart = () => {
    if (waterRecords.length === 0) return null;
    
    const barWidth = (SCREEN_WIDTH - CHART_PADDING * 2 - theme.spacing.md * (days - 1)) / days;
    
    return (
      <ModernCard elevation="md" padding="md" style={styles.chartCard}>
        <SectionHeader title={t('dataViz.correlationTitle')} />
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {recentData.map((item, index) => {
              const date = new Date(item.date);
              const waterBarHeight = (item.water / maxWater) * (CHART_HEIGHT - 60);
              const countBarHeight = (item.count / maxCount) * (CHART_HEIGHT - 60);
              
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    {/* 饮水条 */}
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(4, waterBarHeight),
                          width: (barWidth - 4) / 2 - 2,
                          backgroundColor: theme.colors.info,
                          marginRight: 2,
                        },
                      ]}
                    />
                    {/* 排便次数条 */}
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(4, countBarHeight),
                          width: (barWidth - 4) / 2 - 2,
                          backgroundColor: item.count > 0 ? theme.colors.primary : theme.colors.surfaceVariant,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{date.getDate()}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.info }]} />
              <Text style={styles.legendText}>{t('dataViz.water')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
              <Text style={styles.legendText}>{t('dataViz.bowelMovement')}</Text>
            </View>
          </View>
        </View>
      </ModernCard>
    );
  };

  return (
    <View style={styles.container}>
      {renderFrequencyChart()}
      {renderSmoothnessTrend()}
      {renderCorrelationChart()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  chartCard: {
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    marginTop: theme.spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: CHART_HEIGHT,
    paddingHorizontal: CHART_PADDING,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: CHART_HEIGHT - 30,
  },
  bar: {
    borderRadius: theme.radius.sm,
    minHeight: 4,
  },
  barLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontSize: 10,
  },
  barValue: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
});

