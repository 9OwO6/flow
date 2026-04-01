// 大便顺畅度枚举
export enum SmoothLevel {
  VERY_DIFFICULT = 1, // 非常困难
  DIFFICULT = 2,      // 困难
  NORMAL = 3,         // 正常
  SMOOTH = 4,         // 顺畅
  VERY_SMOOTH = 5     // 非常顺畅
}

// 饮食标签
export enum DietTag {
  HIGH_FIBER = 'high_fiber',    // 高纤维
  LOW_FIBER = 'low_fiber',      // 低纤维
  OILY = 'oily',                // 油腻
  SPICY = 'spicy',              // 辛辣
  DAIRY = 'dairy',              // 乳制品
  CAFFEINE = 'caffeine',        // 咖啡因
  ALCOHOL = 'alcohol',          // 酒精
  NONE = 'none',                // 无特殊
}

// 运动强度
export enum ExerciseLevel {
  NONE = 0,           // 无运动
  LIGHT = 1,          // 轻度（散步、拉伸）
  MODERATE = 2,       // 中度（快走、慢跑）
  INTENSE = 3,        // 强度（跑步、健身）
}

// 大便记录接口
export interface PoopRecord {
  id: string;
  timestamp: number; // Unix timestamp
  date: string; // YYYY-MM-DD 格式
  time: string; // HH:MM 格式
  smoothLevel: SmoothLevel;
  notes?: string; // 可选备注
  createdAt: number;
  // 新增字段
  dietTags?: DietTag[]; // 饮食标签
  exerciseLevel?: ExerciseLevel; // 运动强度
  waterIntake?: number; // 当日饮水量（ml）
}

// 统计数据接口
export interface PoopStats {
  totalRecords: number;
  averagePerDay: number;
  averagePerWeek: number;
  longestGap: number; // 最长间隔天数
  averageSmoothLevel: number;
  weeklyData: { week: string; count: number }[];
  monthlyData: { month: string; count: number }[];
  smoothLevelDistribution: { level: SmoothLevel; count: number; percentage: number }[];
}

// 提醒设置接口
export interface ReminderSettings {
  enabled: boolean;
  maxDaysWithoutRecord: number; // 多少天没记录就提醒
  reminderTime: string; // HH:MM 格式
}

// 用户设置接口
export interface UserSettings {
  // 排便提醒
  maxDaysWithoutPoop: number; // 多少天未排便提醒（默认3天）
  reminderEnabled: boolean; // 是否启用提醒
  
  // 饮水设置
  dailyWaterGoal: number; // 每日饮水目标（ml，默认2000ml）
  /** Local notifications: gentle hydration nudges (max 3/day, respects quiet hours) */
  waterReminderEnabled: boolean;
  /** @deprecated Fixed clock times; nudges use interval + quiet hours instead */
  waterReminderTimes: string[];
  /** Quiet hours start/end local time "HH:mm" (e.g. sleep), no nudges inside */
  sleepQuietHoursStart: string;
  sleepQuietHoursEnd: string;
  
  // 快速记录设置
  quickRecordEnabled: boolean; // 是否启用快速记录（一键记录）
  defaultSmoothLevel: SmoothLevel; // 快速记录默认顺畅度
  
  // 数据保留
  autoBackupEnabled: boolean; // 是否自动备份
} 