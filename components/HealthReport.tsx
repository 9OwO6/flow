import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Text, Chip, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { HealthReport, HealthReportService } from '@/utils/healthReport';
import { SmoothLevel } from '@/types';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/constants/DesignTokens';

interface HealthReportProps {
  report: HealthReport;
  onClose?: () => void;
}

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

export default function HealthReportComponent({ report, onClose }: HealthReportProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const smoothEmoji: Record<SmoothLevel, string> = {
    [SmoothLevel.VERY_DIFFICULT]: '😰',
    [SmoothLevel.DIFFICULT]: '😔',
    [SmoothLevel.NORMAL]: '😐',
    [SmoothLevel.SMOOTH]: '😊',
    [SmoothLevel.VERY_SMOOTH]: '😄',
  };

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
        <Text style={styles.scoreTitle}>{t('healthReport.scoreTitle')}</Text>
        <Text style={styles.scoreValue}>{report.healthScore}</Text>
        <Text style={styles.scoreMax}>{t('healthReport.scoreOutOf')}</Text>
        <Text style={styles.scoreDescription}>{scoreBandLabel}</Text>
      </LinearGradient>
    </Card>
  );

  const renderOverviewCard = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.overviewTitle')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{report.totalRecords}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>{t('achievements.totalRecords')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{report.averagePerDay.toFixed(1)}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>{t('healthReport.statAvgPerDay')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{report.averageSmoothLevel.toFixed(1)}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>{t('healthReport.statAvgSmooth')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{report.averageGap.toFixed(1)}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>{t('healthReport.statAvgGap')}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderRatingCard = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.ratingTitle')}</Text>
        <View style={styles.ratingsContainer}>
          <View style={styles.ratingItem}>
            <Text style={[styles.ratingLabel, { color: colors.text }]}>{t('healthReport.labelConsistency')}</Text>
            <Chip
              style={[styles.ratingChip, { backgroundColor: HealthReportService.getRatingColor(report.consistency) }]}
              textStyle={styles.ratingChipText}
            >
              {HealthReportService.getRatingText(report.consistency)}
            </Chip>
          </View>
          <View style={styles.ratingItem}>
            <Text style={[styles.ratingLabel, { color: colors.text }]}>{t('healthReport.labelSmoothness')}</Text>
            <Chip
              style={[styles.ratingChip, { backgroundColor: HealthReportService.getRatingColor(report.smoothness) }]}
              textStyle={styles.ratingChipText}
            >
              {HealthReportService.getRatingText(report.smoothness)}
            </Chip>
          </View>
          <View style={styles.ratingItem}>
            <Text style={[styles.ratingLabel, { color: colors.text }]}>{t('healthReport.labelOverall')}</Text>
            <Chip
              style={[styles.ratingChip, { backgroundColor: HealthReportService.getRatingColor(report.overallHealth) }]}
              textStyle={styles.ratingChipText}
            >
              {HealthReportService.getRatingText(report.overallHealth)}
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSmoothLevelDistribution = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.distributionTitle')}</Text>
        <View style={styles.distributionContainer}>
          {report.smoothLevelDistribution.map((item, index) => (
            <View key={index} style={styles.distributionItem}>
              <View style={styles.distributionHeader}>
                <Text style={[styles.distributionEmoji, { color: smoothLevelColor[item.level] }]}>
                  {smoothEmoji[item.level]}
                </Text>
                <Text style={[styles.distributionLabel, { color: colors.text }]}>
                  {t(`smoothLevel.${smoothLevelI18nKey(item.level)}`)}
                </Text>
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
              <Text style={[styles.distributionValue, { color: colors.text }]}>
                {t('healthReport.distCount', {
                  count: item.count,
                  pct: item.percentage.toFixed(1),
                })}
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderRecommendations = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.recommendationsTitle')}</Text>
        <View style={styles.recommendationsContainer}>
          {report.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={[styles.recommendationText, { color: colors.text }]}>{recommendation}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderTrends = () => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.trendsTitle')}</Text>
        <View style={styles.trendsContainer}>
          {report.trends.map((trend, index) => (
            <View key={index} style={styles.trendItem}>
              <Text style={[styles.trendText, { color: colors.text }]}>{trend}</Text>
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
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('healthReport.timePatternTitle')}</Text>
          <View style={styles.timePatternContainer}>
            {report.timePattern.map((item, index) => (
              <View key={index} style={styles.timePatternItem}>
                <Text style={[styles.timePatternHour, { color: colors.text }]}>
                  {item.hour.toString().padStart(2, '0')}:00
                </Text>
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
                <Text style={[styles.timePatternCount, { color: colors.text }]}>
                  {t('healthReport.hourCount', { count: item.count })}
                </Text>
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
        <Text style={[styles.reportTitle, { color: colors.text }]}>{t('healthReport.reportTitle')}</Text>
        <Text style={[styles.reportPeriod, { color: colors.text, opacity: 0.7 }]}>{report.period}</Text>
      </View>

      {renderScoreCard()}
      {renderOverviewCard()}
      {renderRatingCard()}
      {report.smoothLevelDistribution.length > 0 && renderSmoothLevelDistribution()}
      {renderTimePattern()}
      {report.trends.length > 0 && renderTrends()}
      {report.recommendations.length > 0 && renderRecommendations()}

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
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportPeriod: {
    fontSize: 16,
  },
  scoreCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scoreGradient: {
    padding: 24,
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
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
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
    gap: 12,
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
    gap: 12,
  },
  distributionItem: {
    marginBottom: 8,
  },
  distributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distributionEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  distributionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  distributionBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
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
    gap: 8,
  },
  recommendationItem: {
    paddingVertical: 4,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  trendsContainer: {
    gap: 8,
  },
  trendItem: {
    paddingVertical: 4,
  },
  trendText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timePatternContainer: {
    gap: 8,
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
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginHorizontal: 8,
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
    marginTop: 20,
    marginBottom: 32,
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
