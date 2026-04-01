import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import theme from '@/constants/DesignTokens';

interface AppIconProps {
  size?: number;
  color?: string;
}

/**
 * Flow App Icon
 * 设计：柔和的流动曲线，象征身体的自然律动
 */
export default function AppIcon({ size = 48, color = theme.colors.primary }: AppIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* 流动曲线 - 象征身体的自然律动 */}
        <Path
          d="M 20 50 Q 35 30, 50 50 T 80 50"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M 20 60 Q 35 40, 50 60 T 80 60"
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
        {/* 小圆点 - 代表记录点 */}
        <Path
          d="M 50 50 L 50 50"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

