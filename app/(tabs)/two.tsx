import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, Alert, TouchableOpacity, FlatList, ScrollView, Platform, Animated } from 'react-native';
import AppText from '@/components/design-system/AppText';
import { Card, Chip, IconButton, Button, Dialog, Portal, TextInput, Surface } from 'react-native-paper';
import { StorageService } from '@/utils/storage';
import { PoopRecord, SmoothLevel } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { delight, getDelightPreferences } from '@/utils/delight';
import { getAppUiPreferences, type AppUiPreferences } from '@/utils/appUiPreferences';
import HistoryContentTransition from '@/components/delight/HistoryContentTransition';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import Colors from '@/constants/Colors';
import theme from '@/constants/DesignTokens';
import { useColorScheme } from '@/components/useColorScheme';
import { useTranslation } from 'react-i18next';
import i18n from '@/utils/i18n';
import SegmentedTabs from '@/components/design-system/SegmentedTabs';
import SearchBar from '@/components/design-system/SearchBar';
import ModernCard from '@/components/design-system/ModernCard';
import HistoryListItem from '@/components/design-system/HistoryListItem';
import EmptyState from '@/components/design-system/EmptyState';
import SkeletonLoader from '@/components/design-system/SkeletonLoader';
import SwipeableContainer from '@/components/SwipeableContainer';
import { 
  createFadeInAnimation, 
  createSlideInAnimation,
  createCardAppearAnimation 
} from '@/utils/animations';

type ViewType = 'week' | 'month' | 'year';

const getSmoothLevelConfig = (t: any) => ({
  [SmoothLevel.VERY_DIFFICULT]: { label: t('smoothLevel.veryDifficult'), color: theme.colors.smoothLevel.veryDifficult },
  [SmoothLevel.DIFFICULT]: { label: t('smoothLevel.difficult'), color: theme.colors.smoothLevel.difficult },
  [SmoothLevel.NORMAL]: { label: t('smoothLevel.normal'), color: theme.colors.smoothLevel.normal },
  [SmoothLevel.SMOOTH]: { label: t('smoothLevel.smooth'), color: theme.colors.smoothLevel.smooth },
  [SmoothLevel.VERY_SMOOTH]: { label: t('smoothLevel.verySmooth'), color: theme.colors.smoothLevel.verySmooth },
});

export default function HistoryScreen() {
  const { t } = useTranslation();
  const smoothLevelConfig = getSmoothLevelConfig(t);
  const [records, setRecords] = useState<PoopRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PoopRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<ViewType>('week');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [hasRecordsInMonth, setHasRecordsInMonth] = useState(true);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<PoopRecord | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [dayRecordsDialogVisible, setDayRecordsDialogVisible] = useState(false);
  const [selectedDayRecords, setSelectedDayRecords] = useState<PoopRecord[]>([]);
  const [enhancedMotionPref, setEnhancedMotionPref] = useState(true);
  const [appUi, setAppUi] = useState<AppUiPreferences | null>(null);
  const reduceMotion = useReduceMotion();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [cardScale] = useState(new Animated.Value(0.95));

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const designColors = theme.colors;

  // 浣跨敤useFocusEffect鏉ョ‘淇濋〉闈㈣幏寰楃劍鐐规椂閲嶆柊鍔犺浇鏁版嵁
  useFocusEffect(
    useCallback(() => {
      void delight.refreshPrefs();
      getDelightPreferences().then((p) => {
        setEnhancedMotionPref(p.enhancedMotion);
        delight.applyPrefs(p);
      });
      getAppUiPreferences().then(setAppUi);
      loadRecords();
      // 椤甸潰鍔犺浇鍔ㄧ敾
      Animated.parallel([
        createFadeInAnimation(fadeAnim, 800),
        createSlideInAnimation(slideAnim, 50, 800),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  const loadRecords = async () => {
    try {
      setLoading(true);
      const allRecords = await StorageService.getAllRecords();
      setRecords(allRecords);
      filterRecords(allRecords);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = (allRecords: PoopRecord[]) => {
    let filtered = [...allRecords];

    // 鏍规嵁瑙嗗浘绫诲瀷杩囨护
    if (viewType === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(record => new Date(record.timestamp) >= oneWeekAgo);
    } else if (viewType === 'month') {
      // 褰撳墠鏈堜唤
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= startOfMonth && recordDate <= endOfMonth;
      });
    } else if (viewType === 'year') {
      // 褰撳墠骞翠唤
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.getFullYear() === selectedYear;
      });
    }

    // 鎼滅储杩囨护
    if (searchQuery.trim()) {
      filtered = filtered.filter(record => 
        record.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.date.includes(searchQuery) ||
        smoothLevelConfig[record.smoothLevel].label.includes(searchQuery)
      );
    }

    setFilteredRecords(filtered);
  };

  const handleViewTypeChange = (value: string) => {
    void delight.play('tap');
    setViewType(value as ViewType);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterRecords(records);
  };

  const openRecordDetails = (record: PoopRecord) => {
    setRecordToDelete(record);
    setDeleteDialogVisible(true);
  };

  const openDayRecords = (dayRecords: PoopRecord[]) => {
    if (dayRecords.length === 1) {
      openRecordDetails(dayRecords[0]);
      return;
    }

    setSelectedDayRecords(dayRecords);
    setDayRecordsDialogVisible(true);
  };

  const confirmDeleteSelectedRecord = async () => {
    if (!recordToDelete) {
      return;
    }

    try {
      const allRecords = await StorageService.getAllRecords();
      const recordToDeleteCheck = allRecords.find(r => r.id === recordToDelete.id);

      if (!recordToDeleteCheck) {
        Alert.alert(t('common.error'), t('history.recordNotFound'));
        return;
      }

      await StorageService.deleteRecord(recordToDelete.id);
      void delight.play('delete');

      await loadRecords();
      setDeleteConfirmVisible(false);
      setDeleteDialogVisible(false);
      setDayRecordsDialogVisible(false);
      setRecordToDelete(null);
      setSelectedDayRecords([]);

      Alert.alert(t('history.deleteSuccess'), t('history.deleteSuccessMessage'));
    } catch (error: any) {
      console.error('Error deleting record:', error);
      Alert.alert(t('history.deleteError'), error.message || t('common.error'));
    }
  };


  const renderWeekView = () => {
    const weekData = [];
    const today = new Date();
    
    // 鐢熸垚鏈€杩?澶╃殑鏁版嵁
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRecords = filteredRecords.filter(record => record.date === dateStr);
      
      weekData.push({
        date: dateStr,
        dayName: getWeekDays()[date.getDay() === 0 ? 6 : date.getDay() - 1],
        records: dayRecords,
        isToday: dateStr === today.toISOString().split('T')[0]
      });
    }

    return (
      <ModernCard elevation="md" padding="lg">
        <AppText style={[styles.viewTitle, { color: designColors.textPrimary }]}>{t('history.weekTitle')}</AppText>
          <View style={styles.weekTable}>
            {/* 琛ㄥご */}
            <View style={styles.weekHeader}>
              {weekData.map((day, index) => (
                <View key={index} style={[styles.dayHeader, day.isToday && { backgroundColor: colors.primary + '20' }]}>
                  <AppText style={[styles.dayName, { color: colors.text }, day.isToday && { color: colors.primary, fontWeight: 'bold' }]}>
                    {day.dayName}
                  </AppText>
                  <AppText style={[styles.dayDate, { color: colors.text, opacity: 0.7 }]}>
                    {new Date(day.date).getDate()}
                  </AppText>
                </View>
              ))}
            </View>
            
            {/* 璁板綍鍐呭 */}
            <View style={styles.weekContent}>
              {weekData.map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  {day.records.length > 0 ? (
                    day.records.map((record, recordIndex) => {
                      const levelColor =
                        smoothLevelConfig[record.smoothLevel]?.color ?? designColors.border;
                      return (
                      <TouchableOpacity
                        key={recordIndex}
                        style={[
                          styles.recordDot,
                          { borderColor: levelColor, backgroundColor: theme.colors.surfaceVariant },
                        ]}
                        onPress={() => {
                          
                          // 璁剧疆瑕佸垹闄ょ殑璁板綍骞舵樉绀哄璇濇
                          openRecordDetails(record);
                        }}
                      >
                        <AppText style={[styles.recordTime, { color: designColors.textPrimary }]}>
                          {record.time.slice(0, 5)}
                        </AppText>
                      </TouchableOpacity>
                    );
                    })
                  ) : (
                    <View style={styles.emptyDot}>
                      <AppText style={styles.emptyText}>-</AppText>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
      </ModernCard>
    );
  };

  // 鏈堣鍥?- 鏃ュ巻
  const renderMonthView = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startWeek = new Date(firstDay);
    startWeek.setDate(startWeek.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));

    const calendarDays = [];
    const currentDate = new Date(startWeek);
    
    // 鐢熸垚6鍛ㄧ殑鏃ユ湡
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayRecords = filteredRecords.filter(record => record.date === dateStr);
        const isCurrentMonth = currentDate.getMonth() === selectedMonth;
        
        weekDays.push({
          date: new Date(currentDate),
          dateStr,
          records: dayRecords,
          isCurrentMonth,
          isToday: dateStr === new Date().toISOString().split('T')[0]
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendarDays.push(weekDays);
    }

    // 妫€鏌ュ綋鍓嶆湀浠芥槸鍚︽湁璁板綍
    const monthHasRecords = records.some(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate.getFullYear() === selectedYear && recordDate.getMonth() === selectedMonth;
    });

    return (
      <ModernCard elevation="md" padding="lg">
          <View style={styles.monthHeader}>
            <TouchableOpacity 
              onPress={() => {
                const newMonth = selectedMonth - 1;
                if (newMonth < 0) {
                  setSelectedYear(selectedYear - 1);
                  setSelectedMonth(11);
                } else {
                  setSelectedMonth(newMonth);
                }
              }}
            >
              <IconButton icon="chevron-left" iconColor={designColors.primary} />
            </TouchableOpacity>
            <View style={styles.monthTitleContainer}>
              <AppText style={[styles.monthTitle, { color: designColors.textPrimary }]}>
                {selectedYear} {getMonths()[selectedMonth]}
              </AppText>
              {!monthHasRecords && (
                <TouchableOpacity
                  onPress={() => {
                    // 鍥炲埌褰撳墠鏈堜唤
                    const now = new Date();
                    setSelectedYear(now.getFullYear());
                    setSelectedMonth(now.getMonth());
                  }}
                  style={styles.backToCurrentButton}
                >
                  <AppText style={styles.backToCurrentText}>
                    {t('history.backToCurrent')}
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              onPress={() => {
                const newMonth = selectedMonth + 1;
                if (newMonth > 11) {
                  setSelectedYear(selectedYear + 1);
                  setSelectedMonth(0);
                } else {
                  setSelectedMonth(newMonth);
                }
              }}
            >
              <IconButton icon="chevron-right" iconColor={designColors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
          {/* 鏄熸湡鏍囬 */}
          <View style={styles.weekTitleRow}>
            {getWeekDays().map((day, index) => (
              <AppText
                key={index}
                style={[styles.weekTitle, { color: designColors.primaryDark }]}
              >
                {i18n.language === 'zh' ? day.replace('周', '') : day.substring(0, 3)}
              </AppText>
            ))}
          </View>

          {/* 鏃ュ巻鍐呭 */}
          {calendarDays.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.calendarWeek}>
              {week.map((day, dayIndex) => (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.calendarDay,
                    day.isToday && { backgroundColor: colors.primary + '20' },
                    !day.isCurrentMonth && { opacity: 0.3 }
                  ]}
                  onPress={() => {
                    if (day.records.length > 0) {
                      openDayRecords(day.records);
                    }
                  }}
                >
                  <AppText style={[styles.calendarDayText, { color: colors.text }]}>
                    {day.date.getDate()}
                  </AppText>
                  {day.records.length > 0 && (
                    <View style={styles.recordIndicators}>
                      {day.records.slice(0, 3).map((record, index) => (
                        <View
                          key={index}
                          style={[styles.recordIndicator, { backgroundColor: smoothLevelConfig[record.smoothLevel].color }]}
                        />
                      ))}
                      {day.records.length > 3 && (
                        <AppText style={styles.moreIndicator}>+{day.records.length - 3}</AppText>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ModernCard>
    );
  };

  const renderYearView = () => {
    const monthlyStats = getMonths().map((month, index) => {
      const monthRecords = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.getFullYear() === selectedYear && recordDate.getMonth() === index;
      });
      
      return {
        month,
        index,
        count: monthRecords.length,
        avgSmoothLevel: monthRecords.length > 0 
          ? monthRecords.reduce((sum, r) => sum + r.smoothLevel, 0) / monthRecords.length 
          : 0
      };
    });

    return (
      <ModernCard elevation="md" padding="lg">
        <View style={styles.yearHeader}>
          <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)}>
            <IconButton icon="chevron-left" iconColor={designColors.primary} />
          </TouchableOpacity>
          <AppText style={[styles.yearTitle, { color: designColors.textPrimary }]}>
            {selectedYear} {t('history.yearTitle')}
          </AppText>
          <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)}>
            <IconButton icon="chevron-right" iconColor={designColors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.monthGrid}>
          {monthlyStats.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.monthCard, { backgroundColor: designColors.surfaceVariant, borderColor: designColors.border }]}
              onPress={() => {
                setSelectedMonth(item.index);
                setViewType('month');
              }}
            >
              <AppText style={[styles.monthCardTitle, { color: designColors.textPrimary }]}>
                {item.month}
              </AppText>
              <View style={styles.monthCardCountContainer}>
                <AppText style={[styles.monthCardCount, { color: designColors.primary }]}>
                  {item.count}
                </AppText>
                <AppText style={[styles.monthCardCountLabel, { color: designColors.textSecondary }]}>
                  {t('history.times')}
                </AppText>
              </View>
              {item.count > 0 && (
                <View style={[styles.monthCardLevel, { backgroundColor: smoothLevelConfig[Math.round(item.avgSmoothLevel) as SmoothLevel]?.color || designColors.border }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ModernCard>
    );
  };

  const getStatsText = () => {
    const total = filteredRecords.length;
    if (viewType === 'week') return `${t('history.week')} ${total} ${t('home.records')}`;
    if (viewType === 'month') return `${getMonths()[selectedMonth]} ${total} ${t('home.records')}`;
    if (viewType === 'year') return `${selectedYear} ${total} ${t('home.records')}`;
    return `${total} ${t('home.records')}`;
  };

  const renderContent = () => {
    switch (viewType) {
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'year':
        return renderYearView();
      default:
        return null;
    }
  };

  useEffect(() => {
    filterRecords(records);
  }, [viewType, selectedYear, selectedMonth, searchQuery]);

  const getWeekDays = () => {
    const weekDays = t('history.weekDays', { returnObjects: true });
    return Array.isArray(weekDays) ? weekDays : 
      (i18n.language === 'zh' ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] : 
       ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  };

  const getMonths = () => {
    const months = t('history.months', { returnObjects: true });
    return Array.isArray(months) ? months :
      (i18n.language === 'zh' ? 
        ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] :
        ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  };

  return (
    <SwipeableContainer style={[styles.container, { backgroundColor: designColors.background }]}>
      {/* 鏍囬鍖哄煙 */}
      <Animated.View style={[styles.header, { backgroundColor: colors.surface, opacity: fadeAnim }]}>
        <AppText style={[styles.title, { color: colors.text }]}>{t('history.title')}</AppText>
        <AppText style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          {getStatsText()}
        </AppText>
      </Animated.View>

      {/* 瑙嗗浘鍒囨崲鍜屾悳绱?*/}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <SegmentedTabs
          tabs={[
            { key: 'week', label: t('history.week') },
            { key: 'month', label: t('history.month') },
            { key: 'year', label: t('history.year') },
          ]}
          selectedKey={viewType}
          onSelect={handleViewTypeChange}
        />

        {viewType !== 'year' && (
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder={t('history.searchPlaceholder')}
          />
        )}
      </Animated.View>

      {/* 鍐呭鍖哄煙 */}
      <Animated.ScrollView 
        style={[styles.contentArea, { opacity: fadeAnim }]}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadRecords}
            tintColor={designColors.primary}
            colors={[designColors.primary]}
          />
        }
      >
        <HistoryContentTransition
          activeKey={viewType}
          enhancedMotionPref={enhancedMotionPref}
          reduceMotion={reduceMotion}
        >
          {loading && filteredRecords.length === 0 ? (
            <View style={styles.loadingContainer}>
              <SkeletonLoader width="100%" height={80} borderRadius={theme.radius.lg} style={styles.skeleton} />
              <SkeletonLoader width="100%" height={80} borderRadius={theme.radius.lg} style={styles.skeleton} />
              <SkeletonLoader width="100%" height={80} borderRadius={theme.radius.lg} style={styles.skeleton} />
            </View>
          ) : filteredRecords.length === 0 && viewType === 'month' ? (
            <View>
              <ModernCard elevation="md" padding="lg">
                <EmptyState
                  icon="inbox"
                  title={t('history.noRecordsInMonth')}
                  subtitle={t('history.noRecordsInMonthSubtitle')}
                />
              </ModernCard>
              {renderMonthView()}
            </View>
          ) : filteredRecords.length === 0 ? (
            <EmptyState
              icon="inbox"
              title={
                records.length === 0 && (appUi?.emptyGuidanceEnabled ?? true)
                  ? t('history.emptyGuidedTitle')
                  : t('history.noRecords')
              }
              subtitle={
                records.length === 0 && (appUi?.emptyGuidanceEnabled ?? true)
                  ? t('history.emptyGuidedSubtitle')
                  : t('history.noRecordsSubtitle')
              }
            />
          ) : (
            <Animated.View style={{ transform: [{ scale: cardScale }] }}>
              {renderContent()}
            </Animated.View>
          )}
        </HistoryContentTransition>
      </Animated.ScrollView>

      {/* 鍒犻櫎纭瀵硅瘽妗?*/}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>{t('history.recordDetails')}</Dialog.Title>
          <Dialog.Content>
            {recordToDelete && (
              <View>
                <AppText style={{ marginBottom: theme.spacing.sm }}>
                  <AppText style={{ fontWeight: 'bold' }}>{t('history.time')}:</AppText> {recordToDelete.time}
                </AppText>
                <AppText style={{ marginBottom: theme.spacing.sm }}>
                  <AppText style={{ fontWeight: 'bold' }}>{t('history.feeling')}:</AppText>{' '}
                  {smoothLevelConfig[recordToDelete.smoothLevel].label}
                </AppText>
                <AppText style={{ marginBottom: theme.spacing.sm }}>
                  <AppText style={{ fontWeight: 'bold' }}>{t('history.notes')}:</AppText> {recordToDelete.notes || t('history.none')}
                </AppText>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>{t('common.close')}</Button>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              textColor={theme.colors.textOnPrimary}
              onPress={() => setDeleteConfirmVisible(true)}
            >
              {t('common.delete')}
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={dayRecordsDialogVisible}
          onDismiss={() => {
            setDayRecordsDialogVisible(false);
            setSelectedDayRecords([]);
          }}
        >
          <Dialog.Title>
            {t('history.dayRecordsTitle', {
              day: selectedDayRecords[0]
                ? new Date(selectedDayRecords[0].timestamp).getDate()
                : '',
            })}
          </Dialog.Title>
          <Dialog.Content>
            {selectedDayRecords.map(record => (
              <TouchableOpacity
                key={record.id}
                style={styles.dayRecordRow}
                onPress={() => {
                  setDayRecordsDialogVisible(false);
                  openRecordDetails(record);
                }}
              >
                <View
                  style={[
                    styles.recordIndicator,
                    { backgroundColor: smoothLevelConfig[record.smoothLevel].color },
                  ]}
                />
                <View style={styles.dayRecordText}>
                  <AppText style={styles.dayRecordTime}>{record.time}</AppText>
                  <AppText style={styles.dayRecordMeta}>
                    {smoothLevelConfig[record.smoothLevel].label}
                  </AppText>
                </View>
              </TouchableOpacity>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDayRecordsDialogVisible(false);
                setSelectedDayRecords([]);
              }}
            >
              {t('common.close')}
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={deleteConfirmVisible}
          onDismiss={() => setDeleteConfirmVisible(false)}
        >
          <Dialog.Title>{t('history.deleteTitle')}</Dialog.Title>
          <Dialog.Content>
            <AppText>{t('history.deleteMessage')}</AppText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteConfirmVisible(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              textColor={theme.colors.textOnPrimary}
              onPress={() => void confirmDeleteSelectedRecord()}
            >
              {t('history.deleteButton')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SwipeableContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterCard: {
    borderRadius: 16,
    padding: 16,
  },
  viewButtons: {
    borderRadius: 12,
    marginBottom: 16,
  },
  searchbar: {
    elevation: 2,
    borderRadius: 16,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  skeleton: {
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  
  weekContainer: {
    paddingVertical: 16,
    borderRadius: 16,
  },
  cardContent: {
    padding: 20,
  },
  viewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  weekTable: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  dayName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayDate: {
    fontSize: 12,
    marginTop: 2,
  },
  weekContent: {
    flexDirection: 'row',
    minHeight: 200,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  recordDot: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
  },
  recordTime: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textTertiary,
    fontSize: 14,
  },

  monthContainer: {
    paddingVertical: 16,
    borderRadius: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  backToCurrentButton: {
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
  },
  backToCurrentText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  weekTitleRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  calendarWeek: {
    flexDirection: 'row',
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    margin: 2,
    backgroundColor: theme.colors.surfaceVariant,
    minHeight: 44,
  },
  calendarDayText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  recordIndicators: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 2,
  },
  recordIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreIndicator: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    marginLeft: 2,
    fontWeight: '600',
  },
  dayRecordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dayRecordText: {
    flex: 1,
  },
  dayRecordTime: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  dayRecordMeta: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  yearContainer: {
    paddingVertical: 16,
    borderRadius: 16,
  },
  yearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  yearTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  monthCard: {
    width: '31%', // 3鍒楀竷灞€锛岀暀鍑洪棿璺?    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 110,
    justifyContent: 'center',
    ...theme.elevation.soft,
  },
  monthCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  monthCardCountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    gap: 4,
  },
  monthCardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  monthCardCountLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  monthCardLevel: {
    width: 30,
    height: 4,
    borderRadius: 2,
  },
});
