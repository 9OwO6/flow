import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Chip, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { HealthReport, HealthReportService } from '@/utils/healthReport';
import { SmoothLevel } from '@/types';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/constants/DesignTokens';
import AppText from '@/components/design-system/AppText';

interface HealthReportProps {
  report: HealthReport;
  onClose?: () => void;
}

type PatternRating = 'excellent' | 'good' | 'fair' | 'poor';

const smoothLevelColor: Record<SmoothLevel, string> = {
  [SmoothLevel.VERY_DIFFICULT]: theme.colors.smoothLevel.veryDifficult,
  [SmoothLevel.DIFFICULT]: theme.colors.smoothLevel.difficult,
  [SmoothLevel.NORMAL]: theme.colors.smoothLevel.normal,
  [SmoothLevel.SMOOTH]: theme.colors.smoothLevel.smooth,
  [SmoothLevel.VERY_SMOOTH]: theme.colors.smoothLevel.verySmooth,
};

function smoothLevelI18nKey(level: SmoothLevel): string {
  switch (level) {
    case SmoothLevel.VERY_DIFFICULT:
      return 'veryDifficult';
    case SmoothLevel.DIFFICULT:
      return 'difficult';
    case SmoothLevel.NORMAL:
      return 'normal';
    case SmoothLevel.SMOOTH:
      return 'smooth';
    case SmoothLevel.VERY_SMOOTH:
      return 'verySmooth';
    default:
      return 'normal';
  }
}

function ratingI18nKey(prefix: 'regularity' | 'comfort' | 'pattern', rating: PatternRating): string {
  const suffix =
    rating === 'excellent'
      ? 'Excellent'
      : rating === 'good'
        ? 'Good'
        : rating === 'fair'
          ? 'Fair'
          : 'Poor';
  return `healthReport.${prefix}Band${suffix}`;
}

export default function HealthReportComponent({ report, onClose }: HealthReportProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scoreBandLabel =
    report.healthScore >= 80
      ? t('healthReport.scoreBandExcellent')
      : report.healthScore >= 60
        ? t('healthReport.scoreBandGood')
        : report.healthScore >= 40
          ? t('healthReport.scoreBandFair')
          : t('healthReport.scoreBandPoor');

  const renderScoreCard = () => (
    <Card style={[styles.scoreCard, { backgroundColor: colors.card }]}>
      <LinearGradient
        colors={['#4ECDC4', '#6BCF7F']}
        style={styles.scoreGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AppText variant="h3" style={styles.scoreTitle}>{t('healthReport.scoreTitle')}</AppText>
        <AppText variant="h1" style={styles.scoreValue}>{report.healthScore}</AppText>
        <AppText variant="body2" style={styles.scoreMax}>{t('healthReport.scoreOutOf')}</AppText>
        <AppText variant="body" style={styles.scoreDescription}>{scoreBandLabel}</AppText>
      </LinearGradient>
    </Card>
  );

  const renderOverviewCard = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <AppText style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.overviewTitle')}</AppText>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <AppText style={[styles.statValue, { color: colors.primary }]}>{report.totalRecords}</AppText>
            <AppText style={[styles.statLabel, { color: colors.text }]}>{t('achievements.totalRecords')}</AppText>
          </View>
          <View style={styles.statItem}>
            <AppText style={[styles.statValue, { color: colors.primary }]}>{report.averagePerDay.toFixed(1)}</AppText>
            <AppText style={[styles.statLabel, { color: colors.text }]}>{t('healthReport.statAvgPerDay')}</AppText>
          </View>
          <View style={styles.statItem}>
            <AppText style={[styles.statValue, { color: colors.primary }]}>{report.averageSmoothLevel.toFixed(1)}</AppText>
            <AppText style={[styles.statLabel, { color: colors.text }]}>{t('healthReport.statAvgSmooth')}</AppText>
          </View>
          <View style={styles.statItem}>
            <AppText style={[styles.statValue, { color: colors.primary }]}>{report.averageGap.toFixed(1)}</AppText>
            <AppText style={[styles.statLabel, { color: colors.text }]}>{t('healthReport.statAvgGap')}</AppText>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderRatingCard = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <AppText style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.ratingTitle')}</AppText>
        <View style={styles.ratingsContainer}>
          <View style={styles.ratingItem}>
            <AppText style={[styles.ratingLabel, { color: colors.text }]}>{t('healthReport.labelConsistency')}</AppText>
            <Chip
              style={[styles.ratingChip, { backgroundColor: HealthReportService.getRatingColor(report.consistency) }]}
              textStyle={styles.ratingChipText}
            >
              {t(ratingI18nKey('regularity', report.consistency))}
            </Chip>
          </View>
          <View style={styles.ratingItem}>
            <AppText style={[styles.ratingLabel, { color: colors.text }]}>{t('healthReport.labelSmoothness')}</AppText>
            <Chip
              style={[styles.ratingChip, { backgroundColor: HealthReportService.getRatingColor(report.smoothness) }]}
              textStyle={styles.ratingChipText}
            >
              {t(ratingI18nKey('comfort', report.smoothness))}
            </Chip>
          </View>
          <View style={styles.ratingItem}>
            <AppText style={[styles.ratingLabel, { color: colors.text }]}>{t('healthReport.labelOverall')}</AppText>
            <Chip
              style={[styles.ratingChip, { backgroundColor: HealthReportService.getRatingColor(report.overallHealth) }]}
              textStyle={styles.ratingChipText}
            >
              {t(ratingI18nKey('pattern', report.overallHealth))}
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSmoothLevelDistribution = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <AppText style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.distributionTitle')}</AppText>
        <View style={styles.distributionContainer}>
          {report.smoothLevelDistribution.map((item, index) => (
            <View key={index} style={styles.distributionItem}>
              <View style={styles.distributionHeader}>
                <View style={[styles.distributionDot, { backgroundColor: smoothLevelColor[item.level] }]} />
                <AppText style={[styles.distributionLabel, { color: colors.text }]}>
                  {t(`smoothLevel.${smoothLevelI18nKey(item.level)}`)}
                </AppText>
              </View>
              <View style={styles.distributionBar}>
                <View
                  style={[
                    styles.distributionBarFill,
                    {
                      backgroundColor: smoothLevelColor[item.level],
                      width: `${item.percentage}%`,
                    },
                  ]}
                />
              </View>
              <AppText style={[styles.distributionValue, { color: colors.text }]}>
                {t('healthReport.distCount', {
                  count: item.count,
                  pct: item.percentage.toFixed(1),
                })}
              </AppText>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderRecommendations = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <AppText style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.recommendationsTitle')}</AppText>
        <View style={styles.recommendationsContainer}>
          {report.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <AppText style={[styles.recommendationText, { color: colors.text }]}>{recommendation}</AppText>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderTrends = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <AppText style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.trendsTitle')}</AppText>
        <View style={styles.trendsContainer}>
          {report.trends.map((trend, index) => (
            <View key={index} style={styles.trendItem}>
              <AppText style={[styles.trendText, { color: colors.text }]}>{trend}</AppText>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderTimePattern = () => {
    if (report.timePattern.length === 0) return null;

    return (
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <AppText style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.timePatternTitle')}</AppText>
          <View style={styles.timePatternContainer}>
            {report.timePattern.map((item, index) => (
              <View key={index} style={styles.timePatternItem}>
                <AppText style={[styles.timePatternHour, { color: colors.text }]}>
                  {item.hour.toString().padStart(2, '0')}:00
                </AppText>
                <View style={styles.timePatternBar}>
                  <View
                    style={[
                      styles.timePatternBarFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${(item.count / Math.max(...report.timePattern.map((tp) => tp.count))) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <AppText style={[styles.timePatternCount, { color: colors.text }]}>
                  {t('healthReport.hourCount', { count: item.count })}
                </AppText>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <AppText style={[styles.reportTitle, { color: colors.text }]}>{t('healthReport.reportTitle')}</AppText>
        <AppText style={[styles.reportPeriod, { color: colors.text, opacity: 0.7 }]}>{report.period}</AppText>
        <AppText style={[styles.reportNote, { color: colors.text }]}>
          {t('healthReport.basisNote')} {t('healthReport.reflectionNote')}
        </AppText>
      </View>

      {report.totalRecords === 0 ? (
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <AppText style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.overviewTitle')}</AppText>
            <AppText style={[styles.emptyReportText, { color: colors.text }]}>
              {t('healthReport.emptyStart')}
            </AppText>
          </Card.Content>
        </Card>
      ) : (
        <>
      {renderScoreCard()}
      {renderOverviewCard()}
      {renderRatingCard()}
      {report.smoothLevelDistribution.length > 0 && renderSmoothLevelDistribution()}
      {renderTimePattern()}
      {report.trends.length > 0 && renderTrends()}
      {report.recommendations.length > 0 && renderRecommendations()}
        </>
      )}

      {onClose && (
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            labelStyle={styles.closeButtonText}
          >
            {t('healthReport.closeReport')}
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportPeriod: {
    fontSize: 16,
  },
  reportNote: {
    ...theme.typography.caption,
    opacity: 0.65,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  emptyReportText: {
    ...theme.typography.body,
    lineHeight: 22,
  },
  scoreCard: {
    marginBottom: theme.spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scoreGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  scoreTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreMax: {
    color: 'white',
    fontSize: 18,
    opacity: 0.8,
  },
  scoreDescription: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  ratingsContainer: {
    gap: theme.spacing.sm,
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingChip: {
    borderRadius: 16,
  },
  ratingChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  distributionContainer: {
    gap: theme.spacing.sm,
  },
  distributionItem: {
    marginBottom: 8,
  },
  distributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distributionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  distributionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  distributionBar: {
    height: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 4,
    marginBottom: 4,
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionValue: {
    fontSize: 12,
    opacity: 0.7,
  },
  recommendationsContainer: {
    gap: theme.spacing.xs,
  },
  recommendationItem: {
    paddingVertical: 4,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  trendsContainer: {
    gap: theme.spacing.xs,
  },
  trendItem: {
    paddingVertical: 4,
  },
  trendText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timePatternContainer: {
    gap: theme.spacing.xs,
  },
  timePatternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timePatternHour: {
    fontSize: 12,
    width: 50,
    fontWeight: '500',
  },
  timePatternBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 3,
    marginHorizontal: theme.spacing.sm,
  },
  timePatternBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  timePatternCount: {
    fontSize: 12,
    width: 52,
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  closeButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
