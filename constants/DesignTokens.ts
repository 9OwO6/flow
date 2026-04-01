/**
 * La Le Mo Design Tokens
 * 方案：柔和有机 (Soft Organic Fluidity)
 * 特点：去图标化、极简形状、丝滑动效
 */

export const colors = {
  // 核心色系：鼠尾草绿 & 温暖陶土
  primary: '#8FB9A8',      // 鼠尾草绿 - 代表平衡与流动
  primaryLight: '#E2EAE6', // 极浅绿
  primaryDark: '#6D8E81',  
  
  secondary: '#D4A574',    // 温暖陶土 - 代表自然与回归
  accent: '#F2D0A9',       // 柔和沙色
  
  // 背景色系
  background: '#F8F7F2',   // 暖白色 - 极具质感的纸张感
  surface: '#FFFFFF',      
  surfaceVariant: '#F1F4F2', // 浅灰绿 - 用于次要容器
  border: '#E2E8E4',       // 极细边框
  
  // 文字色系
  textPrimary: '#2D3436',  // 炭黑
  textSecondary: '#636E72', // 灰黑
  textTertiary: '#B2BEC3',  // 浅灰
  textOnPrimary: '#FFFFFF', 
  
  // 功能色（保持柔和）
  success: '#8FB9A8',
  warning: '#FAD390',
  error: '#E66767',
  info: '#74B9FF',

  // 顺畅度等级颜色（改为梯度，不再使用表情）
  smoothLevel: {
    veryDifficult: '#E66767',
    difficult: '#F3A683',
    normal: '#F7D794',
    smooth: '#8FB9A8',
    verySmooth: '#63C232',
  },
};

export const typography = {
  h1: {
    fontSize: 34,
    fontWeight: '300' as const, // 使用更轻盈的字重
    lineHeight: 42,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 24,
    fontWeight: '400' as const,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
};

export const touchTarget = {
  min: 44,
  comfortable: 48,
};

export const iconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

export const spacing = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
};

export const radius = {
  none: 0,
  sm: 10,
  md: 18,
  lg: 28,
  full: 9999,
  // 有机形状圆角：不规则的圆润感
  organic: 40,
};

export const elevation = {
  none: {
    shadowOpacity: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#8FB9A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  // 柔和发光感，而非硬阴影
  soft: {
    shadowColor: '#8FB9A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  md: {
    shadowColor: '#8FB9A8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  glow: {
    shadowColor: '#8FB9A8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  lg: {
    shadowColor: '#8FB9A8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
};

export const animation = {
  spring: {
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
  duration: {
    fast: 200,
    normal: 400,
    slow: 600,
  }
};

export default {
  colors,
  typography,
  spacing,
  radius,
  elevation,
  animation,
  touchTarget,
  iconSize,
};
