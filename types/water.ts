// 饮水记录接口
export interface WaterRecord {
  id: string;
  timestamp: number; // Unix timestamp
  date: string; // YYYY-MM-DD 格式
  time: string; // HH:MM 格式
  amount: number; // 饮水量（ml）
  createdAt: number;
}

// 每日饮水统计
export interface DailyWaterStats {
  date: string;
  totalAmount: number; // 总饮水量
  goal: number; // 目标饮水量
  percentage: number; // 完成百分比
  records: WaterRecord[]; // 当日所有饮水记录
}

