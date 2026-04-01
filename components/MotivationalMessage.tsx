import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

interface MotivationalMessageProps {
  recordCount: number;
  onClose?: () => void;
}

export default function MotivationalMessage({ recordCount, onClose }: MotivationalMessageProps) {
  const { t } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // 成就系统
  const achievements: Achievement[] = [
    { id: 'first', title: t('achievements.first.title'), description: t('achievements.first.description'), emoji: t('achievements.first.emoji'), unlocked: recordCount >= 1 },
    { id: 'week', title: t('achievements.week.title'), description: t('achievements.week.description'), emoji: t('achievements.week.emoji'), unlocked: recordCount >= 7 },
    { id: 'month', title: t('achievements.month.title'), description: t('achievements.month.description'), emoji: t('achievements.month.emoji'), unlocked: recordCount >= 30 },
    { id: 'hundred', title: t('achievements.hundred.title'), description: t('achievements.hundred.description'), emoji: t('achievements.hundred.emoji'), unlocked: recordCount >= 100 },
  ];

  // 鼓励语句
  const getMotivationalQuote = () => {
    const quotes = t('motivational.default', { returnObjects: true }) as Array<{text: string, emoji: string}>;

    if (recordCount === 1) {
      return { text: t('motivational.firstRecord'), emoji: '🎉' };
    } else if (recordCount === 7) {
      return { text: t('motivational.weekRecord'), emoji: '🎊' };
    } else if (recordCount === 30) {
      return { text: t('motivational.monthRecord'), emoji: '🌟' };
    } else if (recordCount === 100) {
      return { text: t('motivational.monthRecord'), emoji: '👑' };
    } else if (recordCount % 10 === 0) {
      return { text: t('motivational.recordCount', { count: recordCount }), emoji: '🔥' };
    }

    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const getCurrentAchievement = () => {
    return achievements.find(achievement => 
      achievement.unlocked && 
      (recordCount === 1 || recordCount === 7 || recordCount === 30 || recordCount === 100)
    );
  };

  const quote = getMotivationalQuote();
  const currentAchievement = getCurrentAchievement();

  useEffect(() => {
    // 入场动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content style={styles.content}>
          {/* 成就展示 */}
          {currentAchievement && (
            <View style={[styles.achievementContainer, { backgroundColor: colors.success + '20' }]}>
              <Text style={styles.achievementEmoji}>{currentAchievement.emoji}</Text>
              <View style={styles.achievementText}>
                <Text style={[styles.achievementTitle, { color: colors.success }]}>
                  {t('achievements.unlocked')}
                </Text>
                <Text style={[styles.achievementName, { color: colors.text }]}>
                  {currentAchievement.title}
                </Text>
                <Text style={[styles.achievementDesc, { color: colors.text, opacity: 0.7 }]}>
                  {currentAchievement.description}
                </Text>
              </View>
            </View>
          )}

          {/* 鼓励消息 */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageEmoji}>{quote.emoji}</Text>
            <Text style={[styles.messageText, { color: colors.text }]}>
              {quote.text}
            </Text>
          </View>

          {/* 统计信息 */}
          <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.statsText, { color: colors.text }]}>
              📈 {t('achievements.totalRecords')}：<Text style={{ fontWeight: 'bold', color: colors.primary }}>{recordCount}</Text>
            </Text>
            
            {recordCount >= 7 && (
              <Text style={[styles.statsText, { color: colors.text }]}>
                🎯 {t('achievements.weeklyAverage')}：<Text style={{ fontWeight: 'bold', color: colors.secondary }}>{Math.round(recordCount / Math.ceil(recordCount / 7))}</Text> {t('achievements.times')}
              </Text>
            )}
          </View>

          {/* 关闭按钮 */}
          <Button 
            mode="contained" 
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            {t('achievements.continueButton')}
          </Button>
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  card: {
    margin: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    padding: 24,
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  achievementEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  messageEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  closeButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
}); 