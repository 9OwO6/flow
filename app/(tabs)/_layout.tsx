import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import theme from '@/constants/DesignTokens';
import { useTranslation } from 'react-i18next';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <View style={props.focused ? styles.focusedIconContainer : null}>
      <FontAwesome 
        size={22} 
        style={{ marginBottom: -3 }} 
        {...props} 
      />
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="leaf" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: t('history.title'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="history" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="cog" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 64,
    paddingBottom: 10,
    paddingTop: 10,
    ...theme.elevation.soft,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  focusedIconContainer: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
  },
  header: {
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
});
