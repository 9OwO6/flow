import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity, Animated, Modal, Platform, Pressable } from 'react-native';
import AppText from '@/components/design-system/AppText';
import { Card, Button, Chip, Surface } from 'react-native-paper';
import { StorageService } from '@/utils/storage';
import { PoopRecord, SmoothLevel } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { delight } from '@/utils/delight';
import { runSuccessPulse, runSuccessRipple } from '@/utils/delight/motionTemplates';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { healthManager } from '@/utils/healthManager';
import { HealthReportService } from '@/utils/healthReport';
import Colors from '@/constants/Colors';
import theme from '@/constants/DesignTokens';
import { useColorScheme } from '@/components/useColorScheme';
import { useTranslation } from 'react-i18next';
import RecordModal from '@/components/RecordModal';
import HealthAlert from '@/components/HealthAlert';
import HealthReportComponent from '@/components/HealthReport';
import WaterTracker from '@/components/WaterTracker';
import DataVisualization from '@/components/DataVisualization';
import PrimaryButton from '@/components/design-system/PrimaryButton';
import StatCard from '@/components/design-system/StatCard';
import ModernCard from '@/components/design-system/ModernCard';
import SectionHeader from '@/components/design-system/SectionHeader';
import SwipeableContainer from '@/components/SwipeableContainer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ReminderService } from '@/utils/reminderService';
import { WaterService } from '@/utils/waterService';
import { 
  createFadeInAnimation, 
  createSlideInAnimation,
} from '@/utils/animations';
import { getAppUiPreferences, type AppUiPreferences } from '@/utils/appUiPreferences';
import {
  getMinutesUntilNewRecordAllowed,
} from '@/utils/recordMinInterval';
import HomeEmptyGuide from '@/components/home/HomeEmptyGuide';
import { useCelebration, type RecordSaveCelebrationMeta } from '@/contexts/CelebrationContext';
import QuickRecordSmoothModal from '@/components/home/QuickRecordSmoothModal';
import WaterQuickLogModal from '@/components/water/WaterQuickLogModal';
import {
  setWaterQuickLogHandler,
  subscribeWaterNotificationOpen,
} from '@/utils/waterNudgeScheduler';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [todayRecords, setTodayRecords] = useState<PoopRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PoopRecord | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [healthAlert, setHealthAlert] = useState<any>(null);
  const [healthScore, setHealthScore] = useState(0);
  const [successPulseScale] = useState(new Animated.Value(1));
  const [successPulseOpacity] = useState(new Animated.Value(1));
  const [successRingScale] = useState(new Animated.Value(1));
  const [successRingOpacity] = useState(new Animated.Value(0));
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [isLoading, setIsLoading] = useState(false);
  const [lastPoopTime, setLastPoopTime] = useState<string>('');
  const [reminderStatus, setReminderStatus] = useState<any>(null);
  const [allRecords, setAllRecords] = useState<PoopRecord[]>([]);
  const [waterRecords, setWaterRecords] = useState<any[]>([]);
  const [appUi, setAppUi] = useState<AppUiPreferences | null>(null);
  const [smoothPickerVisible, setSmoothPickerVisible] = useState(false);
  const [waterQuickVisible, setWaterQuickVisible] = useState(false);
  
  // 动画状态
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [cardScale] = useState(new Animated.Value(0.9));

  // Refs for cleanup
  const isMountedRef = useRef(true);
  const loadingRef = useRef(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const designColors = theme.colors;
  const reduceMotion = useReduceMotion();
  const { notifyRecordSaved } = useCelebration();

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initial load and animations
  useEffect(() => {
    // Start animations immediately (non-blocking)
    Animated.parallel([
      createFadeInAnimation(fadeAnim, 600),
      createSlideInAnimation(slideAnim, 50, 600),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Load data after a short delay to ensure UI renders first
    const timer = setTimeout(() => {
      loadData().catch(err => {
        console.error('Initial data load error:', err);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    void getAppUiPreferences().then(setAppUi);
  }, []);

  // Reload data when screen is focused
  useFocusEffect(
    useCallback(() => {
      void delight.refreshPrefs();
      void getAppUiPreferences().then(setAppUi);
      if (!loadingRef.current) {
        loadData();
      }
    }, [])
  );

  useEffect(() => {
    setWaterQuickLogHandler(() => setWaterQuickVisible(true));
    const unsub = subscribeWaterNotificationOpen(() => setWaterQuickVisible(true));
    return () => {
      setWaterQuickLogHandler(null);
      unsub();
    };
  }, []);

  const delightMotionOpts = useCallback(
    () => ({
      allowEnhancedMotion: delight.getPrefs().enhancedMotion,
      reduceMotion,
    }),
    [reduceMotion]
  );

  const triggerSuccessDelight = useCallback(() => {
    void delight.play('success');
    runSuccessPulse(successPulseScale, successPulseOpacity, delightMotionOpts());
  }, [successPulseScale, successPulseOpacity, delightMotionOpts]);

  /** Extra ripple + spring pulse on the main quick-record control only */
  const triggerQuickRecordDelight = useCallback(() => {
    void delight.play('success');
    const opts = delightMotionOpts();
    runSuccessPulse(successPulseScale, successPulseOpacity, opts);
    runSuccessRipple(successRingScale, successRingOpacity, opts);
  }, [
    successPulseScale,
    successPulseOpacity,
    successRingScale,
    successRingOpacity,
    delightMotionOpts,
  ]);

  const completeQuickRecordWithLevel = useCallback(
    async (smoothLevel: SmoothLevel) => {
      try {
        const existing = await StorageService.getAllRecords();
        const waitMin = getMinutesUntilNewRecordAllowed(existing);
        if (waitMin > 0) {
          setSmoothPickerVisible(false);
          Alert.alert(t('home.recordIntervalTitle'), t('home.recordIntervalMessage', { minutes: waitMin }));
          return;
        }

        const now = new Date();
        const record: PoopRecord = {
          id: `poop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: now.getTime(),
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().slice(0, 5),
          smoothLevel,
          createdAt: now.getTime(),
        };

        const todayStr = now.toISOString().split('T')[0];
        const todayCountBefore = existing.filter((r) => r.date === todayStr).length;
        const totalCountBefore = existing.length;

        await StorageService.addRecord(record);
        setSmoothPickerVisible(false);
        triggerQuickRecordDelight();
        await notifyRecordSaved({
          isNewRecord: true,
          todayCountBefore,
          totalCountBefore,
        });
        loadData();
      } catch (error) {
        console.error('Quick record error:', error);
        Alert.alert(t('common.error'), t('recordModal.saveError'));
      }
    },
    [t, triggerQuickRecordDelight, notifyRecordSaved]
  );

  // Load all data
  const loadData = async () => {
    if (loadingRef.current || !isMountedRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      // Load data with timeout protection (5 seconds max)
      await Promise.race([
        Promise.all([
          loadTodayRecords(),
          loadTotalRecords(),
          loadHealthStatus(),
          loadHealthScore(),
          loadLastPoopTime(),
          loadReminderStatus(),
          loadAllRecords(),
          loadWaterRecords(),
        ]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Data load timeout')), 5000)
        )
      ]).catch(err => {
        if (err.message !== 'Data load timeout') {
          console.error('Error loading data:', err);
        }
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      if (isMountedRef.current) {
        loadingRef.current = false;
        setIsLoading(false);
      }
    }
  };

  const loadAllRecords = async () => {
    try {
      const records = await StorageService.getAllRecords();
      if (isMountedRef.current) {
        setAllRecords(records);
      }
    } catch (error) {
      console.error('Error loading all records:', error);
    }
  };

  const loadWaterRecords = async () => {
    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const startDate = weekAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      const records = await WaterService.getWaterRecordsByDateRange(startDate, endDate);
      if (isMountedRef.current) {
        setWaterRecords(records);
      }
    } catch (error) {
      console.error('Error loading water records:', error);
    }
  };

  const loadTodayRecords = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const records = await StorageService.getRecordsByDateRange(today, today);
      if (isMountedRef.current) {
        setTodayRecords(records);
      }
    } catch (error) {
      console.error('Error loading today records:', error);
    }
  };

  const loadTotalRecords = async () => {
    try {
      const allRecords = await StorageService.getAllRecords();
      if (isMountedRef.current) {
        setTotalRecords(allRecords.length);
      }
    } catch (error) {
      console.error('Error loading total records:', error);
    }
  };

  const loadHealthStatus = async () => {
    try {
      const alert = await healthManager.getHealthStatus();
      if (isMountedRef.current) {
        setHealthAlert(alert);
      }
    } catch (error) {
      console.error('Error loading health status:', error);
    }
  };

  const loadHealthScore = async () => {
    try {
      const score = await healthManager.getHealthScore();
      if (isMountedRef.current) {
        setHealthScore(score.score);
      }
    } catch (error) {
      console.error('Error loading health score:', error);
    }
  };

  const loadLastPoopTime = async () => {
    try {
      const description = await ReminderService.getLastPoopTimeDescription();
      if (isMountedRef.current) {
        setLastPoopTime(description);
      }
    } catch (error) {
      console.error('Error loading last poop time:', error);
    }
  };

  const loadReminderStatus = async () => {
    try {
      const status = await ReminderService.checkReminders();
      if (isMountedRef.current) {
        setReminderStatus(status);
      }
    } catch (error) {
      console.error('Error loading reminder status:', error);
    }
  };

  const handleQuickRecord = async () => {
    if (modalVisible) return;

    try {
      // 检查是否启用快速记录
      const settings = await StorageService.getUserSettings();
      
      if (settings.quickRecordEnabled) {
        const existing = await StorageService.getAllRecords();
        const waitMin = getMinutesUntilNewRecordAllowed(existing);
        if (waitMin > 0) {
          Alert.alert(
            t('home.recordIntervalTitle'),
            t('home.recordIntervalMessage', { minutes: waitMin })
          );
          return;
        }

        setSmoothPickerVisible(true);
      } else {
        // 打开详细记录模态框（tap 触感已由 PrimaryButton 处理）
        setModalVisible(true);
        setEditingRecord(null);
      }
    } catch (error) {
      console.error('Error in quick record:', error);
      Alert.alert(t('common.error'), t('recordModal.saveError'));
    }
  };

  const handleRecordSaved = async (meta: RecordSaveCelebrationMeta) => {
    try {
      triggerSuccessDelight();
      await notifyRecordSaved(meta);

      // Reload data
      await loadData();

      if (meta.isNewRecord) {
        const newTotal = meta.totalCountBefore + 1;
        const message = healthManager.getMotivationalMessage(newTotal);
        Alert.alert(t('history.recordSuccess'), message);
      }
    } catch (error) {
      console.error('Error handling record saved:', error);
      // Still reload data even if message fails
      loadData().catch(err => console.error('Reload error:', err));
    }
  };

  const handleGenerateReport = async (type: 'weekly' | 'monthly') => {
    if (reportModalVisible || isLoading) return; // Prevent multiple calls
    
    try {
      setIsLoading(true);
      setReportType(type);
      
      // Check if there's data
      const allRecords = await StorageService.getAllRecords();
      if (allRecords.length === 0) {
        Alert.alert(t('common.warning'), t('home.noDataForReport'));
        setIsLoading(false);
        return;
      }

      let report;
      if (type === 'weekly') {
        // Generate weekly report (from Monday)
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);
        report = await HealthReportService.generateWeeklyReport(monday);
      } else {
        // Generate monthly report
        const today = new Date();
        report = await HealthReportService.generateMonthlyReport(today.getFullYear(), today.getMonth());
      }

      if (report && isMountedRef.current) {
        setCurrentReport(report);
        setReportModalVisible(true);
      } else if (isMountedRef.current) {
        Alert.alert(t('common.error'), t('home.generateReportError'));
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      
      if (!isMountedRef.current) return;
      
      // Show error message
      let errorMessage = t('home.generateReportFailed');
      if (error?.message) {
        errorMessage += `: ${error.message}`;
      }
      
      Alert.alert(t('common.error'), errorMessage);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const closeReportModal = useCallback(() => {
    setReportModalVisible(false);
  }, []);

  return (
    <>
    <SwipeableContainer style={[styles.container, { backgroundColor: designColors.background }]}>
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick record first: keep Home focused on the daily loop. */}
        <Animated.View style={[styles.primaryActionContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.quickRecordInner}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.successRippleRing,
                {
                  borderColor: `${theme.colors.primary}4D`,
                  transform: [{ scale: successRingScale }],
                  opacity: successRingOpacity,
                },
              ]}
            />
            <Animated.View
              style={{
                transform: [{ scale: successPulseScale }],
                opacity: successPulseOpacity,
                width: '100%',
                maxWidth: 560,
                alignSelf: 'center',
              }}
            >
              <PrimaryButton
                title={t('home.quickRecord')}
                onPress={handleQuickRecord}
                disabled={isLoading || modalVisible || smoothPickerVisible}
                icon="leaf"
                loading={isLoading}
                delightPress
                size="large"
                style={styles.quickRecordButtonWide}
              />
            </Animated.View>
          </View>
        </Animated.View>
        {/* 健康提醒 */}
        {healthAlert && (
          <HealthAlert 
            alert={healthAlert} 
            onDismiss={() => setHealthAlert(null)}
          />
        )}

        {/* 异常提醒 */}
        {reminderStatus?.shouldRemind && (
          <ModernCard elevation="md" padding="md" style={[styles.reminderCard, { backgroundColor: theme.colors.primaryLight }]}>
            <View style={styles.reminderContent}>
              <FontAwesome name="info-circle" size={theme.iconSize.lg} color={theme.colors.primary} />
              <View style={styles.reminderTextContainer}>
                <AppText variant="h3" style={[styles.reminderTitle, { color: theme.colors.primaryDark }]}>
                  {t('reminder.attention')}
                </AppText>
                <AppText variant="body2" color="secondary" style={styles.reminderMessage}>
                  {reminderStatus.message}
                </AppText>
              </View>
            </View>
          </ModernCard>
        )}

        {/* 距离上次排便时间 */}
        {lastPoopTime && (
          <ModernCard elevation="sm" padding="md" style={styles.lastPoopCard}>
            <View style={styles.lastPoopContent}>
              <FontAwesome name="clock-o" size={theme.iconSize.md} color={theme.colors.textSecondary} />
              <AppText variant="body" color="secondary" style={styles.lastPoopText}>
                {t('home.lastPoop')}: {lastPoopTime}
              </AppText>
            </View>
          </ModernCard>
        )}

        {/* Today's status */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <SectionHeader 
            title={t('home.todayStats')}
          />
          <View style={styles.statsRow}>
            <StatCard
              icon="leaf"
              value={todayRecords.length}
              label={t('home.todayRecords')}
              color={designColors.primary}
            />
            <StatCard
              icon="bar-chart"
              value={totalRecords}
              label={t('home.totalRecords')}
              color={designColors.accent}
            />
            <StatCard
              icon="line-chart"
              value={healthScore}
              label={t('home.healthScore')}
              color={designColors.success}
            />
          </View>
        </Animated.View>

        {totalRecords === 0 && (appUi?.emptyGuidanceEnabled ?? true) && (
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <HomeEmptyGuide />
          </Animated.View>
        )}

        {/* 饮水追踪 */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <WaterTracker onUpdate={loadData} />
        </Animated.View>

        {/* 数据可视化 */}
        {allRecords.length > 0 && (
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <DataVisualization 
              records={allRecords} 
              waterRecords={waterRecords}
              days={7}
            />
          </Animated.View>
        )}

        {/* 健康报告区域 - 轻量化 */}
        <Animated.View style={{ transform: [{ scale: cardScale }] }}>
          <SectionHeader 
            title={t('health.healthReport')}
            subtitle={t('home.detailedHealthAnalysis')}
          />
          <View style={styles.reportButtons}>
            <ModernCard style={styles.reportButtonCard} elevation="sm">
              <TouchableOpacity
                onPress={() => handleGenerateReport('weekly')}
                activeOpacity={0.7}
                style={styles.reportButtonTouchable}
              >
                <View style={styles.reportIconWrap}>
                  <FontAwesome name="calendar" size={theme.iconSize.lg} color={theme.colors.primary} />
                </View>
                <View style={styles.reportButtonTextContainer}>
                  <AppText variant="h3" style={styles.reportButtonTitle}>{t('health.weeklyReport')}</AppText>
                  <AppText variant="body2" color="secondary" style={styles.reportButtonSubtitle}>
                    {t('health.weeklyReportSubtitle')}
                  </AppText>
                </View>
              </TouchableOpacity>
            </ModernCard>
            
            <ModernCard style={styles.reportButtonCard} elevation="sm">
              <TouchableOpacity
                onPress={() => handleGenerateReport('monthly')}
                activeOpacity={0.7}
                style={styles.reportButtonTouchable}
              >
                <View style={styles.reportIconWrap}>
                  <FontAwesome name="bar-chart" size={theme.iconSize.lg} color={theme.colors.primary} />
                </View>
                <View style={styles.reportButtonTextContainer}>
                  <AppText variant="h3" style={styles.reportButtonTitle}>{t('health.monthlyReport')}</AppText>
                  <AppText variant="body2" color="secondary" style={styles.reportButtonSubtitle}>
                    {t('health.monthlyReportSubtitle')}
                  </AppText>
                </View>
              </TouchableOpacity>
            </ModernCard>
          </View>
        </Animated.View>

      </Animated.ScrollView>

      {/* 记录模态框 */}
      <RecordModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingRecord(null);
        }}
        onSave={handleRecordSaved}
        editingRecord={editingRecord}
      />

      <QuickRecordSmoothModal
        visible={smoothPickerVisible}
        onClose={() => setSmoothPickerVisible(false)}
        onConfirm={(level: SmoothLevel) => void completeQuickRecordWithLevel(level)}
      />

      <WaterQuickLogModal
        visible={waterQuickVisible}
        onClose={() => setWaterQuickVisible(false)}
        onLogged={() => loadData()}
      />

    </SwipeableContainer>

      {/* Outside SwipeableContainer: nested transform breaks modal hit-testing on web */}
      <Modal
        visible={reportModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeReportModal}
      >
        <View style={[styles.modalContainer, { backgroundColor: designColors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: designColors.surface, borderBottomColor: designColors.border }]}>
            <View style={styles.modalTitleRow}>
              <FontAwesome
                name={reportType === 'weekly' ? 'calendar' : 'bar-chart'}
                size={theme.iconSize.md}
                color={designColors.textPrimary}
                style={styles.modalTitleIcon}
              />
              <AppText variant="h3" style={[styles.modalTitle, { color: designColors.textPrimary }]} numberOfLines={1}>
                {reportType === 'weekly' ? t('health.weeklyReport') : t('health.monthlyReport')}
              </AppText>
            </View>
            <Pressable
              onPress={closeReportModal}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              style={({ pressed }) => [styles.reportModalCloseHit, pressed && { opacity: 0.65 }]}
            >
              <FontAwesome name="close" size={22} color={designColors.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.reportModalBody}>
            {currentReport && (
              <HealthReportComponent report={currentReport} onClose={closeReportModal} />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  primaryActionContainer: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.sm,
  },
  quickRecordInner: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.touchTarget.min + 24,
    width: '100%',
  },
  quickRecordButtonWide: {
    width: '100%',
    minHeight: 56,
    paddingVertical: theme.spacing.lg,
  },
  successRippleRing: {
    position: 'absolute',
    width: '92%',
    maxWidth: 520,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    alignSelf: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  reportButtons: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  reportButtonCard: {
    marginBottom: 0,
  },
  reportButtonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  reportIconWrap: {
    marginRight: theme.spacing.md,
    width: theme.iconSize.lg + theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonTextContainer: {
    flex: 1,
  },
  reportButtonTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  reportButtonSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    zIndex: 10,
    elevation: Platform.OS === 'android' ? 4 : 0,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  modalTitleIcon: {
    marginRight: theme.spacing.sm,
  },
  modalTitle: {
    flex: 1,
    minWidth: 0,
  },
  reportModalCloseHit: {
    padding: theme.spacing.sm,
    minWidth: theme.touchTarget.min,
    minHeight: theme.touchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportModalBody: {
    flex: 1,
    minHeight: 0,
  },
  reminderCard: {
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  reminderTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  reminderMessage: {},
  lastPoopCard: {
    marginBottom: theme.spacing.md,
  },
  lastPoopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastPoopText: {
    marginLeft: theme.spacing.sm,
  },
});
