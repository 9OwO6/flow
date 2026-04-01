import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, Alert, TouchableOpacity, FlatList, ScrollView, Platform, Animated, Text as RNText } from 'react-native';
import { Text } from '@/components/Themed';
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
  const [enhancedMotionPref, setEnhancedMotionPref] = useState(true);
  const [appUi, setAppUi] = useState<AppUiPreferences | null>(null);
  const reduceMotion = useReduceMotion();

  // 动画状态
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [cardScale] = useState(new Animated.Value(0.95));

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const designColors = theme.colors;

  // 使用useFocusEffect来确保页面获得焦点时重新加载数据
  useFocusEffect(
    useCallback(() => {
      void delight.refreshPrefs();
      getDelightPreferences().then((p) => {
        setEnhancedMotionPref(p.enhancedMotion);
        delight.applyPrefs(p);
      });
      getAppUiPreferences().then(setAppUi);
      loadRecords();
      // 页面加载动画
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

    // 根据视图类型过滤
    if (viewType === 'week') {
      // 最近7天
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(record => new Date(record.timestamp) >= oneWeekAgo);
    } else if (viewType === 'month') {
      // 当前月份
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= startOfMonth && recordDate <= endOfMonth;
      });
    } else if (viewType === 'year') {
      // 当前年份
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.getFullYear() === selectedYear;
      });
    }

    // 搜索过滤
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

  const handleDeleteRecord = async (recordId: string) => {
    try {
      console.log('Preparing to delete record:', recordId);
      
      Alert.alert(
        t('history.deleteTitle'),
        t('history.deleteMessage'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => void delight.play('tap'),
          },
                      {
              text: t('history.deleteButton'),
              style: 'destructive',
            onPress: async () => {
              try {
                console.log('Deleting record:', recordId);
        
        const allRecords = await StorageService.getAllRecords();
        const recordToDelete = allRecords.find(r => r.id === recordId);
        
        if (!recordToDelete) {
          Alert.alert(t('history.deleteFailed'), t('history.recordNotFound'));
          return;
        }
        
        console.log('Found record to delete:', recordToDelete);
                await StorageService.deleteRecord(recordId);
                void delight.play('delete');
                
                // 重新加载数据
                await loadRecords();
                
                        console.log('Delete successful, reloading data completed');
        
        // 显示删除成功提示
        Alert.alert(t('history.deleteSuccess'), t('history.deleteSuccessMessage'));
              } catch (error: any) {
                console.error('Error deleting record:', error);
                Alert.alert(t('history.deleteErrorMessage'), error.message || t('common.error'));
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in delete handler:', error);
    }
  };

  // 周视图 - 7天表格
  const renderWeekView = () => {
    const weekData = [];
    const today = new Date();
    
    // 生成最近7天的数据
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
        <RNText style={[styles.viewTitle, { color: designColors.textPrimary }]}>{t('history.weekTitle')}</RNText>
          <View style={styles.weekTable}>
            {/* 表头 */}
            <View style={styles.weekHeader}>
              {weekData.map((day, index) => (
                <View key={index} style={[styles.dayHeader, day.isToday && { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.dayName, { color: colors.text }, day.isToday && { color: colors.primary, fontWeight: 'bold' }]}>
                    {day.dayName}
                  </Text>
                  <Text style={[styles.dayDate, { color: colors.text, opacity: 0.7 }]}>
                    {new Date(day.date).getDate()}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* 记录内容 */}
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
                                  console.log('Clicked record dot, Platform.OS:', Platform.OS);
        console.log('Record info:', record);
                          
                          // 设置要删除的记录并显示对话框
                          setRecordToDelete(record);
                          setDeleteDialogVisible(true);
                        }}
                        onLongPress={() => handleDeleteRecord(record.id)}
                      >
                        <Text style={[styles.recordTime, { color: designColors.textPrimary }]}>
                          {record.time.slice(0, 5)}
                        </Text>
                      </TouchableOpacity>
                    );
                    })
                  ) : (
                    <View style={styles.emptyDot}>
                      <Text style={styles.emptyText}>-</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
      </ModernCard>
    );
  };

  // 月视图 - 日历
  const renderMonthView = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startWeek = new Date(firstDay);
    startWeek.setDate(startWeek.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));

    const calendarDays = [];
    const currentDate = new Date(startWeek);
    
    // 生成6周的日期
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

    // 检查当前月份是否有记录
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
              <RNText style={[styles.monthTitle, { color: designColors.textPrimary }]}>
                {selectedYear} {getMonths()[selectedMonth]}
              </RNText>
              {!monthHasRecords && (
                <TouchableOpacity
                  onPress={() => {
                    // 回到当前月份
                    const now = new Date();
                    setSelectedYear(now.getFullYear());
                    setSelectedMonth(now.getMonth());
                  }}
                  style={styles.backToCurrentButton}
                >
                  <Text style={styles.backToCurrentText}>
                    {t('history.backToCurrent')}
                  </Text>
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
          {/* 星期标题 */}
          <View style={styles.weekTitleRow}>
            {getWeekDays().map((day, index) => (
              <RNText
                key={index}
                style={[styles.weekTitle, { color: designColors.primaryDark }]}
              >
                {i18n.language === 'zh' ? day.replace('周', '') : day.substring(0, 3)}
              </RNText>
            ))}
          </View>

          {/* 日历内容 */}
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
                      const recordsText = day.records.map(r => 
                        `${r.time} - ${smoothLevelConfig[r.smoothLevel].label}`
                      ).join('\n');
                      Alert.alert(
                        t('history.dayRecordsTitle', { day: day.date.getDate() }),
                        recordsText
                      );
                    }
                  }}
                >
                  <Text style={[styles.calendarDayText, { color: colors.text }]}>
                    {day.date.getDate()}
                  </Text>
                  {day.records.length > 0 && (
                    <View style={styles.recordIndicators}>
                      {day.records.slice(0, 3).map((record, index) => (
                        <View
                          key={index}
                          style={[styles.recordIndicator, { backgroundColor: smoothLevelConfig[record.smoothLevel].color }]}
                        />
                      ))}
                      {day.records.length > 3 && (
                        <Text style={styles.moreIndicator}>+{day.records.length - 3}</Text>
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

  // 年视图 - 月份选择和统计
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
          <RNText style={[styles.yearTitle, { color: designColors.textPrimary }]}>
            {selectedYear} {t('history.yearTitle')}
          </RNText>
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
              <Text style={[styles.monthCardTitle, { color: designColors.textPrimary }]}>
                {item.month}
              </Text>
              <View style={styles.monthCardCountContainer}>
                <Text style={[styles.monthCardCount, { color: designColors.primary }]}>
                  {item.count}
                </Text>
                <Text style={[styles.monthCardCountLabel, { color: designColors.textSecondary }]}>
                  {t('history.times')}
                </Text>
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

  // 当选择改变时重新过滤数据
  useEffect(() => {
    filterRecords(records);
  }, [viewType, selectedYear, selectedMonth, searchQuery]);

  // 获取周/月名称（使用i18n）
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
      {/* 标题区域 */}
      <Animated.View style={[styles.header, { backgroundColor: colors.surface, opacity: fadeAnim }]}>
        <RNText style={[styles.title, { color: colors.text }]}>{t('history.title')}</RNText>
        <RNText style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          {getStatsText()}
        </RNText>
      </Animated.View>

      {/* 视图切换和搜索 */}
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

      {/* 内容区域 */}
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
                  title={t('history.noRecordsInMonth', '本月暂无记录')}
                  subtitle={t('history.noRecordsInMonthSubtitle', '可以切换月份查看其他时间的记录')}
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

      {/* 删除确认对话框 */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>{t('history.recordDetails')}</Dialog.Title>
          <Dialog.Content>
            {recordToDelete && (
              <View>
                <Text style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>{t('history.time')}:</Text> {recordToDelete.time}
                </Text>
                <Text style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>{t('history.feeling')}:</Text> {smoothLevelConfig[recordToDelete.smoothLevel].label}
                </Text>
                <Text style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>{t('history.notes')}:</Text> {recordToDelete.notes || t('history.none')}
                </Text>
    </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>{t('common.close')}</Button>
            <Button 
              mode="contained" 
              buttonColor="#FF6B6B"
              onPress={async () => {
                if (recordToDelete) {
                  try {
                    console.log('Deleting record:', recordToDelete.id);
                    
                    const allRecords = await StorageService.getAllRecords();
                    const recordToDeleteCheck = allRecords.find(r => r.id === recordToDelete.id);
                    
                    if (!recordToDeleteCheck) {
                      Alert.alert(t('common.error'), t('history.recordNotFound'));
                      return;
                    }
                    
                    console.log('Found record to delete:', recordToDeleteCheck);
                    await StorageService.deleteRecord(recordToDelete.id);
                    void delight.play('delete');
                    
                    await loadRecords();
                    
                    console.log('Delete successful, reloading data completed');
                    
                    setDeleteDialogVisible(false);
                    setRecordToDelete(null);
                    
                    Alert.alert(t('history.deleteSuccess'), t('history.deleteSuccessMessage'));
                  } catch (error: any) {
                    console.error('Error deleting record:', error);
                    Alert.alert(t('history.deleteError'), error.message || t('common.error'));
                  }
                }
              }}
            >
              {t('common.delete')}
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
  
  // 周视图样式
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

  // 月视图样式
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

  // 年视图样式
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
    width: '31%', // 3列布局，留出间距
    padding: theme.spacing.md,
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
