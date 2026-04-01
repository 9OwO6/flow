import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text, Chip, TextInput, IconButton } from 'react-native-paper';
import { StorageService } from '@/utils/storage';
import { PoopRecord, SmoothLevel, DietTag, ExerciseLevel } from '@/types';
import { delight } from '@/utils/delight';
import { getMinutesUntilNewRecordAllowed } from '@/utils/recordMinInterval';
import Colors from '@/constants/Colors';
import theme from '@/constants/DesignTokens';
import { useColorScheme } from '@/components/useColorScheme';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '@/components/design-system/PrimaryButton';
import ModernCard from '@/components/design-system/ModernCard';
import { createFadeInAnimation, createSlideInAnimation } from '@/utils/animations';
import type { RecordSaveCelebrationMeta } from '@/contexts/CelebrationContext';

interface RecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (meta: RecordSaveCelebrationMeta) => void;
  editingRecord?: PoopRecord | null; // 新增：要编辑的记录
}

const getSmoothLevelOptions = (t: any) => [
  { level: SmoothLevel.VERY_DIFFICULT, label: t('smoothLevel.veryDifficult'), color: theme.colors.smoothLevel.veryDifficult },
  { level: SmoothLevel.DIFFICULT, label: t('smoothLevel.difficult'), color: theme.colors.smoothLevel.difficult },
  { level: SmoothLevel.NORMAL, label: t('smoothLevel.normal'), color: theme.colors.smoothLevel.normal },
  { level: SmoothLevel.SMOOTH, label: t('smoothLevel.smooth'), color: theme.colors.smoothLevel.smooth },
  { level: SmoothLevel.VERY_SMOOTH, label: t('smoothLevel.verySmooth'), color: theme.colors.smoothLevel.verySmooth },
];

export default function RecordModal({ visible, onClose, onSave, editingRecord }: RecordModalProps) {
  const { t } = useTranslation();
  const [smoothLevel, setSmoothLevel] = useState<SmoothLevel>(SmoothLevel.NORMAL);
  const [notes, setNotes] = useState('');
  const [dietTags, setDietTags] = useState<DietTag[]>([]);
  const [exerciseLevel, setExerciseLevel] = useState<ExerciseLevel>(ExerciseLevel.NONE);
  const [loading, setLoading] = useState(false);
  
  // 动画状态
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const designColors = theme.colors;

  // 当编辑记录改变时，更新表单
  useEffect(() => {
    if (editingRecord) {
      setSmoothLevel(editingRecord.smoothLevel);
      setNotes(editingRecord.notes || '');
      setDietTags(editingRecord.dietTags || []);
      setExerciseLevel(editingRecord.exerciseLevel || ExerciseLevel.NONE);
    } else {
      // 新建记录时重置表单
      setSmoothLevel(SmoothLevel.NORMAL);
      setNotes('');
      setDietTags([]);
      setExerciseLevel(ExerciseLevel.NONE);
    }
  }, [editingRecord]);

  // 模态框动画
  useEffect(() => {
    if (visible) {
      // 显示动画
      Animated.parallel([
        createFadeInAnimation(fadeAnim, 300),
        createSlideInAnimation(slideAnim, 100, 300),
      ]).start();
    } else {
      // 隐藏动画
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSave = async () => {
    if (loading) return; // Prevent double submission
    
    try {
      setLoading(true);
      const snapshot = await StorageService.getAllRecords();
      const todayStr = new Date().toISOString().split('T')[0];
      const todayCountBefore = snapshot.filter((r) => r.date === todayStr).length;
      const totalCountBefore = snapshot.length;

      if (editingRecord) {
        // Update existing record
        const updatedRecord: PoopRecord = {
          ...editingRecord,
          smoothLevel,
          notes: notes.trim() || undefined,
          dietTags: dietTags.length > 0 ? dietTags : undefined,
          exerciseLevel: exerciseLevel !== ExerciseLevel.NONE ? exerciseLevel : undefined,
        };
        
        // Delete old record and add updated one
        await StorageService.deleteRecord(editingRecord.id);
        await StorageService.addRecord(updatedRecord);
        
        Alert.alert(t('history.updateSuccess'), t('history.updateMessage'));
      } else {
        const waitMin = getMinutesUntilNewRecordAllowed(snapshot);
        if (waitMin > 0) {
          Alert.alert(
            t('home.recordIntervalTitle'),
            t('home.recordIntervalMessage', { minutes: waitMin })
          );
          return;
        }

        // Create new record
        const now = new Date();
        const record: PoopRecord = {
          id: `poop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: now.getTime(),
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().slice(0, 5),
          smoothLevel,
          notes: notes.trim() || undefined,
          dietTags: dietTags.length > 0 ? dietTags : undefined,
          exerciseLevel: exerciseLevel !== ExerciseLevel.NONE ? exerciseLevel : undefined,
          createdAt: now.getTime(),
        };

        await StorageService.addRecord(record);
      }

      // Close modal and trigger save callback
      onClose();
      // Use setTimeout to ensure modal closes before callback
      const celebrationMeta: RecordSaveCelebrationMeta = {
        isNewRecord: !editingRecord,
        todayCountBefore,
        totalCountBefore,
      };
      setTimeout(() => {
        onSave(celebrationMeta);
      }, 100);
    } catch (error) {
      console.error('Error saving record:', error);
      void delight.play('warning');
      Alert.alert(t('common.error'), t('recordModal.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while saving
    void delight.play('tap');
    onClose();
  };

  const getModalTitle = () => {
    return editingRecord ? t('recordModal.editTitle') : t('recordModal.newTitle');
  };

  const getSaveButtonText = () => {
    return editingRecord ? t('recordModal.updateButton') : t('recordModal.saveButton');
  };

  const getTimeInfo = () => {
    if (editingRecord) {
      return t('recordModal.timeInfo', { 
        date: editingRecord.date, 
        time: editingRecord.time 
      });
    }
    const now = new Date();
    return t('recordModal.timeInfo', { 
      date: now.toISOString().split('T')[0], 
      time: now.toTimeString().slice(0, 5) 
    });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={[styles.modal, { backgroundColor: designColors.background }]}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <ModernCard style={styles.card} elevation="lg" padding="lg">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 标题 */}
              <View style={styles.header}>
                <Text style={styles.title}>
                  {getModalTitle()}
                </Text>
                <IconButton
                  icon="close"
                  iconColor={designColors.textPrimary}
                  size={theme.iconSize.md}
                  onPress={handleClose}
                />
              </View>

              {/* 时间信息 */}
              <ModernCard style={styles.timeInfo} elevation="none" padding="md">
                <Text style={styles.timeText}>
                  {getTimeInfo()}
                </Text>
              </ModernCard>

              {/* 顺畅度选择 */}
              <Text style={styles.sectionTitle}>
                {t('recordModal.feelingQuestion')}
              </Text>
              <View style={styles.chipContainer}>
                {getSmoothLevelOptions(t).map((option) => (
                  <TouchableOpacity
                    key={option.level}
                    onPress={() => setSmoothLevel(option.level)}
                    style={[
                      styles.chip,
                      smoothLevel === option.level && { 
                        backgroundColor: option.color,
                        borderColor: option.color,
                      }
                    ]}
                  >
                    <Text style={[
                      styles.chipText,
                      smoothLevel === option.level && styles.chipTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 饮食标签 */}
              <Text style={styles.sectionTitle}>
                {t('recordModal.dietTags', 'Diet Tags (Optional)')}
              </Text>
              <View style={styles.chipContainer}>
                {[
                  { tag: DietTag.HIGH_FIBER, label: t('diet.highFiber', 'High Fiber') },
                  { tag: DietTag.LOW_FIBER, label: t('diet.lowFiber', 'Low Fiber') },
                  { tag: DietTag.OILY, label: t('diet.oily', 'Oily') },
                  { tag: DietTag.SPICY, label: t('diet.spicy', 'Spicy') },
                  { tag: DietTag.DAIRY, label: t('diet.dairy', 'Dairy') },
                  { tag: DietTag.CAFFEINE, label: t('diet.caffeine', 'Caffeine') },
                ].map(({ tag, label }) => {
                  const isSelected = dietTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => {
                        if (isSelected) {
                          setDietTags(dietTags.filter(t => t !== tag));
                        } else {
                          setDietTags([...dietTags, tag]);
                        }
                      }}
                      style={[
                        styles.chip,
                        isSelected && {
                          backgroundColor: designColors.primary,
                          borderColor: designColors.primary,
                        }
                      ]}
                    >
                      <Text style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 运动强度 */}
              <Text style={styles.sectionTitle}>
                {t('recordModal.exercise', 'Exercise (Optional)')}
              </Text>
              <View style={styles.chipContainer}>
                {[
                  { level: ExerciseLevel.NONE, label: t('exercise.none', 'None') },
                  { level: ExerciseLevel.LIGHT, label: t('exercise.light', 'Light') },
                  { level: ExerciseLevel.MODERATE, label: t('exercise.moderate', 'Moderate') },
                  { level: ExerciseLevel.INTENSE, label: t('exercise.intense', 'Intense') },
                ].map(({ level, label }) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setExerciseLevel(level)}
                    style={[
                      styles.chip,
                      exerciseLevel === level && {
                        backgroundColor: designColors.secondary,
                        borderColor: designColors.secondary,
                      }
                    ]}
                  >
                    <Text style={[
                      styles.chipText,
                      exerciseLevel === level && styles.chipTextSelected
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 备注输入 */}
              <Text style={styles.sectionTitle}>
                {t('recordModal.notesLabel')}
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder={t('recordModal.notesPlaceholder')}
                multiline
                numberOfLines={3}
                style={styles.textInput}
                textColor={designColors.textPrimary}
                placeholderTextColor={designColors.textTertiary}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />

              {/* 按钮 */}
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title={t('common.cancel')}
                  onPress={handleClose}
                  variant="outlined"
                  disabled={loading}
                  size="medium"
                />
                <PrimaryButton
                  title={getSaveButtonText()}
                  onPress={handleSave}
                  variant="filled"
                  loading={loading}
                  disabled={loading}
                  size="medium"
                />
              </View>
            </ScrollView>
          </ModernCard>
        </Animated.View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: theme.spacing.md,
    borderRadius: theme.radius.lg,
    maxHeight: '90%',
  },
  card: {
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  timeInfo: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
  },
  timeText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    minHeight: theme.touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
  },
  chipTextSelected: {
    color: theme.colors.textOnPrimary,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
}); 