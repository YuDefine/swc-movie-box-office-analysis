export interface WeeklyBoxOffice {
  week: number;
  dateRange: string;
  revenue: number;
  tickets: number;
  cumulativeRevenue: number;
  cumulativeTickets: number;
  changeRate: number | null;
  theaters: number;
}

export interface MovieRanking {
  rank: number;
  title: string;
  revenue: number;
  tickets?: number; // 觀影人次（部分電影可能沒有資料）
  year: number;
  rating?: string; // 電影分級（如：普遍級、輔12級）
  isActive: boolean;
  includesRerelease?: boolean; // 含重映票房
}

export interface DerivedMetrics {
  week: number;
  averageTicketPrice: number; // 週平均票價 = revenue / tickets
  revenuePerTheater: number; // 每院週票房 = revenue / theaters
  ticketsPerTheater: number; // 每院週人次 = tickets / theaters
  decayRate: number | null; // 衰退係數 = 本週 / 上週 (< 1 為衰退)
  dailyAverage: number; // 日均票房 = revenue / 7
}

export interface TargetProjection {
  remainingToTarget: number; // 剩餘差距
  requiredWeeklyAverage: number; // 達標所需週均票房
  recentWeeklyAverage: number; // 近 3 週平均
  projectedFinalRevenue: number; // 預測最終累計
  projectedWeeksToTarget: number | null; // 預測達標週數
  feasibilityScore: "high" | "medium" | "low"; // 達成機率評級
  projectedWeeklyData: { week: number; revenue: number; cumulative: number }[];
}

export interface DataQuality {
  lastUpdated: string; // 最後更新時間
  dataSource: string; // 資料來源
  totalWeeks: number; // 資料週數
  missingData: string[]; // 缺失資料註記
  anomalies: {
    // 異常值註記
    week: number;
    field: string;
    note: string;
  }[];
}

// 單日簡易資訊（即時追蹤用）
export interface DailySnapshot {
  date: string; // 日期 "2026/01/31"
  dayOfWeek: string; // 星期 "六"
  dailyRevenue: number; // 單日票房
  cumulativeRevenue: number; // 累計票房
  cumulativeTickets?: number; // 累計人次（如有）
  updatedAt: string; // 更新時間
  isEstimate: boolean; // 是否為估算值
  note?: string; // 備註
}
