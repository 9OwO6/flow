import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import theme from '@/constants/DesignTokens';
import { WaterService } from '@/utils/waterService';
import { StorageService } from '@/utils/storage';
import { UserSettings } from '@/types';
import ModernCard from '@/components/design-system/ModernCard';
import SectionHeader from '@/components/design-system/SectionHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

interface WaterTrackerProps {
  onUpdate?: () => void;
}

export default function WaterTracker({ onUpdate }: WaterTrackerProps) {
  const { t } = useTranslation();
  const [waterStats, setWaterStats] = useState<any>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      const userSettings = await StorageService.getUserSettings();
      setSettings(userSettings);
      const stats = await WaterService.getTodayWaterStats(userSettings);
      setWaterStats(stats);
    } catch (error) {
      console.error('Error loading water data:', error);
    }
  };

  const handleAddWater = async (amount: number) => {
    if (loading) return;
    try {
      setLoading(true);
      await WaterService.addQuickWater(amount);
      await loadWaterData();
      onUpdate?.();
    } catch (error) {
      console.error('Error adding water:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!waterStats || !settings) {
    return null;
  }

  const percentage = waterStats.percentage;
  const isComplete = percentage >= 100;

  return (
    <ModernCard elevation="md" padding="md" style={styles.container}>
      <SectionHeader title={t('water.dailyIntake')} />
      
      {/* 进度显示 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { 
                width: `${Math.min(100, percentage)}%`,
                backgroundColor: isComplete ? theme.colors.success : theme.colors.primary,
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {waterStats.totalAmount}ml / {waterStats.goal}ml ({percentage}%)
        </Text>
      </View>

      {/* 快捷按钮 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.waterButton, { backgroundColor: theme.colors.primaryLight }]}
          onPress={() => handleAddWater(250)}
          disabled={loading}
        >
          <FontAwesome name="tint" size={theme.iconSize.md} color={theme.colors.primary} />
          <Text style={styles.buttonText}>+250ml</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.waterButton, { backgroundColor: theme.colors.primaryLight }]}
          onPress={() => handleAddWater(500)}
          disabled={loading}
        >
          <FontAwesome name="tint" size={theme.iconSize.lg} color={theme.colors.primary} />
          <Text style={styles.buttonText}>+500ml</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.waterButton, { backgroundColor: theme.colors.primaryLight }]}
          onPress={() => handleAddWater(750)}
          disabled={loading}
        >
          <FontAwesome name="tint" size={theme.iconSize.xl} color={theme.colors.primary} />
          <Text style={styles.buttonText}>+750ml</Text>
        </TouchableOpacity>
      </View>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
  progressText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: theme.spacing.sm,
  },
  waterButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.touchTarget.min,
  },
  buttonText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontWeight: '600',
  },
});

