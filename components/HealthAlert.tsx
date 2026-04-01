import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { HealthAlert as HealthAlertType } from '@/utils/healthManager';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { useTranslation } from 'react-i18next';

interface HealthAlertProps {
  alert: HealthAlertType;
  onDismiss?: () => void;
}

export default function HealthAlert({ alert, onDismiss }: HealthAlertProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getAlertStyles = (type: HealthAlertType['type']) => {
    switch (type) {
      case 'warning':
        return {
          backgroundColor: '#FFF5F5',
          borderColor: colors.error,
          iconColor: colors.error,
        };
      case 'success':
        return {
          backgroundColor: '#F0FFF4',
          borderColor: colors.success,
          iconColor: colors.success,
        };
      case 'info':
        return {
          backgroundColor: '#F7FAFC',
          borderColor: colors.primary,
          iconColor: colors.primary,
        };
      case 'reminder':
        return {
          backgroundColor: '#FFFAF0',
          borderColor: colors.warning,
          iconColor: colors.warning,
        };
      default:
        return {
          backgroundColor: colors.card,
          borderColor: colors.border,
          iconColor: colors.text,
        };
    }
  };

  const alertStyles = getAlertStyles(alert.type);

  return (
    <Card style={[
      styles.container,
      {
        backgroundColor: alertStyles.backgroundColor,
        borderLeftWidth: 4,
        borderLeftColor: alertStyles.borderColor,
      }
    ]}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.emoji, { color: alertStyles.iconColor }]}>
            {alert.emoji}
          </Text>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: alertStyles.iconColor }]}>
              {alert.title}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.message, { color: colors.text }]}>
          {alert.message}
        </Text>

        {alert.actions && alert.actions.length > 0 && (
          <View style={styles.actions}>
            {alert.actions.map((action, index) => (
              <Button
                key={index}
                mode={index === 0 ? "outlined" : "contained"}
                onPress={() => {
                  action.action();
                  onDismiss?.();
                }}
                style={[
                  styles.actionButton,
                  index === 0 ? {} : { backgroundColor: alertStyles.iconColor }
                ]}
                labelStyle={{
                  color: index === 0 ? alertStyles.iconColor : 'white',
                  fontSize: 12,
                }}
              >
                {action.text}
              </Button>
            ))}
            {onDismiss && (
              <Button
                mode="text"
                onPress={onDismiss}
                style={styles.dismissButton}
                labelStyle={{ color: colors.text, fontSize: 12 }}
              >
                {t('common.later')}
              </Button>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: 20,
    marginRight: 8,
  },
  dismissButton: {
    marginLeft: 'auto',
  },
}); 