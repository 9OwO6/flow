import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Card, Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import AppText from '@/components/design-system/AppText';
import theme from '@/constants/DesignTokens';

type QuoteIcon = React.ComponentProps<typeof FontAwesome>['name'];

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface MotivationalMessageProps {
  recordCount: number;
  onClose?: () => void;
}

function quoteForCount(recordCount: number, t: TFunction): { text: string; icon: QuoteIcon } {
  const raw = t('motivational.default', { returnObjects: true });
  const quotes = Array.isArray(raw) ? (raw as { text: string; emoji: string }[]) : [];

  if (recordCount === 1) return { text: t('motivational.firstRecord'), icon: 'star' };
  if (recordCount === 7) return { text: t('motivational.weekRecord'), icon: 'certificate' };
  if (recordCount === 30) return { text: t('motivational.monthRecord'), icon: 'sun-o' };
  if (recordCount === 100) return { text: t('motivational.monthRecord'), icon: 'trophy' };
  if (recordCount % 10 === 0) return { text: t('motivational.recordCount', { count: recordCount }), icon: 'fire' };

  if (quotes.length === 0) {
    return { text: t('motivational.firstRecord'), icon: 'leaf' };
  }
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  return { text: q.text, icon: 'comment-o' };
}

export default function MotivationalMessage({ recordCount, onClose }: MotivationalMessageProps) {
  const { t } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const achievements: Achievement[] = [
    {
      id: 'first',
      title: t('achievements.first.title'),
      description: t('achievements.first.description'),
      unlocked: recordCount >= 1,
    },
    {
      id: 'week',
      title: t('achievements.week.title'),
      description: t('achievements.week.description'),
      unlocked: recordCount >= 7,
    },
    {
      id: 'month',
      title: t('achievements.month.title'),
      description: t('achievements.month.description'),
      unlocked: recordCount >= 30,
    },
    {
      id: 'hundred',
      title: t('achievements.hundred.title'),
      description: t('achievements.hundred.description'),
      unlocked: recordCount >= 100,
    },
  ];

  const getCurrentAchievement = () =>
    achievements.find(
      (a) =>
        a.unlocked &&
        (recordCount === 1 || recordCount === 7 || recordCount === 30 || recordCount === 100)
    );

  const quote = quoteForCount(recordCount, t);
  const currentAchievement = getCurrentAchievement();

  useEffect(() => {
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
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content style={styles.content}>
          {currentAchievement ? (
            <View style={[styles.achievementContainer, { backgroundColor: colors.success + '20' }]}>
              <View style={styles.achievementIcon}>
                <FontAwesome name="trophy" size={theme.iconSize.lg} color={colors.success} />
              </View>
              <View style={styles.achievementText}>
                <AppText variant="caption" style={[styles.achievementTitle, { color: colors.success }]}>
                  {t('achievements.unlocked')}
                </AppText>
                <AppText variant="h3" style={[styles.achievementName, { color: colors.text }]}>
                  {currentAchievement.title}
                </AppText>
                <AppText variant="body2" color="secondary" style={[styles.achievementDesc, { color: colors.text, opacity: 0.7 }]}>
                  {currentAchievement.description}
                </AppText>
              </View>
            </View>
          ) : null}

          <View style={styles.messageContainer}>
            <FontAwesome name={quote.icon} size={theme.iconSize.lg} color={theme.colors.primary} style={styles.quoteIcon} />
            <AppText variant="h3" style={[styles.messageText, { color: colors.text }]}>
              {quote.text}
            </AppText>
          </View>

          <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
            <View style={styles.statsRow}>
              <FontAwesome name="line-chart" size={theme.iconSize.sm} color={colors.text} style={styles.statsRowIcon} />
              <AppText variant="body2" style={[styles.statsText, { color: colors.text }]}>
                {t('achievements.totalRecords')}：
                <AppText variant="body2" style={{ fontWeight: 'bold', color: colors.primary }}>
                  {recordCount}
                </AppText>
              </AppText>
            </View>

            {recordCount >= 7 ? (
              <View style={styles.statsRow}>
                <FontAwesome name="bullseye" size={theme.iconSize.sm} color={colors.text} style={styles.statsRowIcon} />
                <AppText variant="body2" style={[styles.statsText, { color: colors.text }]}>
                  {t('achievements.weeklyAverage')}：
                  <AppText variant="body2" style={{ fontWeight: 'bold', color: colors.secondary }}>
                    {Math.round(recordCount / Math.ceil(recordCount / 7))}
                  </AppText>{' '}
                  {t('achievements.times')}
                </AppText>
              </View>
            ) : null}
          </View>

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
    margin: theme.spacing.md,
    borderRadius: theme.radius.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    padding: theme.spacing.lg,
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  achievementIcon: {
    marginRight: theme.spacing.md,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  achievementName: {
    marginBottom: theme.spacing.xs,
  },
  achievementDesc: {},
  messageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  quoteIcon: {
    marginBottom: theme.spacing.sm,
  },
  messageText: {
    textAlign: 'center',
  },
  statsContainer: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  statsRowIcon: {
    marginRight: theme.spacing.sm,
  },
  statsText: {
    textAlign: 'center',
    flexShrink: 1,
  },
  closeButton: {
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.xs,
  },
});
