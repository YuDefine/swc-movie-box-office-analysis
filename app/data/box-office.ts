import type {
  WeeklyBoxOffice,
  MovieRanking,
  DerivedMetrics,
  TargetProjection,
  DataQuality,
  DailySnapshot,
} from "~/types";

// 將 dateRange 格式化為簡短顯示（只顯示結束日期，如 "12/7" 或 "2/1"）
export function formatDateRangeShort(dateRange: string): string {
  // dateRange 格式: "2025/12/01~2025/12/07"
  const [, end] = dateRange.split("~");
  if (!end) return dateRange;

  const parts = end.split("/");
  if (parts.length !== 3) return dateRange;
  const month = Number.parseInt(parts[1]!, 10);
  const day = Number.parseInt(parts[2]!, 10);
  return `${month}/${day}`;
}

// 解析單日簡易資訊
// 輸入格式: "1/31(六) #陽光女子合唱團 3027.8萬，累計: 3億6604.6萬"
export function parseDailyInfo(input: string): DailySnapshot | null {
  // 匹配日期: 1/31(六) 或 2/1(日)
  const dateMatch = input.match(/(\d{1,2})\/(\d{1,2})\(([日一二三四五六])\)/);
  if (!dateMatch) return null;

  const month = dateMatch[1]!.padStart(2, "0");
  const day = dateMatch[2]!.padStart(2, "0");
  const dayOfWeek = dateMatch[3]!;

  // 判斷年份（假設跨年時 1-6 月為新年份）
  const currentYear = new Date().getFullYear();
  const monthNum = Number.parseInt(dateMatch[1]!, 10);
  const year = monthNum <= 6 ? currentYear : currentYear - 1;
  const date = `${year}/${month}/${day}`;

  // 匹配單日票房: 3027.8萬 或 1.5億
  const dailyMatch = input.match(/#\S+\s+([\d.]+)(萬|億)/);
  if (!dailyMatch) return null;

  let dailyRevenue = Number.parseFloat(dailyMatch[1]!);
  if (dailyMatch[2] === "萬") {
    dailyRevenue *= 10_000;
  } else if (dailyMatch[2] === "億") {
    dailyRevenue *= 100_000_000;
  }

  // 匹配累計票房: 3億6604.6萬 或 1.5億 或 8888萬
  const cumulativeMatch = input.match(/累計[：:]\s*((\d+)億)?([\d.]+)?(萬)?/);
  if (!cumulativeMatch) return null;

  let cumulativeRevenue = 0;
  // 億的部分
  if (cumulativeMatch[2]) {
    cumulativeRevenue += Number.parseInt(cumulativeMatch[2], 10) * 100_000_000;
  }
  // 萬的部分
  if (cumulativeMatch[3]) {
    const wanValue = Number.parseFloat(cumulativeMatch[3]);
    if (cumulativeMatch[4] === "萬" || cumulativeMatch[2]) {
      // 有「萬」字或前面有「億」，則這個數字是萬
      cumulativeRevenue += wanValue * 10_000;
    } else {
      // 只有數字沒有單位，可能是「X億」的簡寫
      cumulativeRevenue += wanValue * 100_000_000;
    }
  }

  const now = new Date();
  const updatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  return {
    date,
    dayOfWeek,
    dailyRevenue: Math.round(dailyRevenue),
    cumulativeRevenue: Math.round(cumulativeRevenue),
    updatedAt,
    isEstimate: true,
  };
}

// 取得最新累計票房（優先使用 latestDaily，否則使用 weeklyData）
export function getLatestCumulativeRevenue(): number {
  if (latestDaily && latestDaily.cumulativeRevenue > 0) {
    const latestWeek = weeklyData[weeklyData.length - 1];
    // 確保 latestDaily 比 weeklyData 更新
    if (!latestWeek || latestDaily.cumulativeRevenue > latestWeek.cumulativeRevenue) {
      return latestDaily.cumulativeRevenue;
    }
  }
  const latestWeek = weeklyData[weeklyData.length - 1];
  return latestWeek?.cumulativeRevenue ?? 0;
}

// 取得最新累計人次（優先使用 latestDaily，否則使用 weeklyData）
export function getLatestCumulativeTickets(): number {
  if (latestDaily && latestDaily.cumulativeTickets && latestDaily.cumulativeTickets > 0) {
    const latestWeek = weeklyData[weeklyData.length - 1];
    // 確保 latestDaily 比 weeklyData 更新
    if (!latestWeek || latestDaily.cumulativeTickets > latestWeek.cumulativeTickets) {
      return latestDaily.cumulativeTickets;
    }
  }
  const latestWeek = weeklyData[weeklyData.length - 1];
  return latestWeek?.cumulativeTickets ?? 0;
}

// 格式化即時數據的日期顯示（如 "2/4"）
export function formatDailyDateShort(date: string): string {
  // date 格式: "2026/02/04"
  const parts = date.split("/");
  if (parts.length !== 3) return date;
  const month = Number.parseInt(parts[1]!, 10);
  const day = Number.parseInt(parts[2]!, 10);
  return `${month}/${day}`;
}

// 檢查是否有比 weeklyData 更新的即時數據
export function hasNewerDailyData(): boolean {
  if (!latestDaily || latestDaily.cumulativeRevenue <= 0) return false;
  const latestWeek = weeklyData[weeklyData.length - 1];
  return !latestWeek || latestDaily.cumulativeRevenue > latestWeek.cumulativeRevenue;
}

export const movieInfo = {
  title: "陽光女子合唱團",
  englishTitle: "Sunshine Women's Choir",
  releaseDate: "2025-12-31",
  rating: "輔12級",
  runtime: "02:14:00",
  distributor: "壹壹喜喜電影股份有限公司",
  lastUpdated: "2026-03-04 01:07:40",
  dataQuality: {
    lastUpdated: "2026-03-04 01:07:40",
    dataSource: "國家影視聽中心票房資訊系統",
    totalWeeks: 13,
    missingData: [],
    anomalies: [
      {
        week: 2,
        field: "changeRate",
        note: "第 2 週增幅 878.33% 為試映期擴大戲院數",
      },
      {
        week: 4,
        field: "changeRate",
        note: "第 4 週增幅 1473.26% 為試映期轉正式上映前擴大",
      },
      {
        week: 5,
        field: "theaters",
        note: "第 5 週為正式上映，91 間戲院",
      },
    ],
  } as DataQuality,
};

// 即時單日資訊（臨時追蹤用，會被完整週資料取代）
export const latestDaily: DailySnapshot | null = {
  date: "2026/03/02",
  dayOfWeek: "一",
  dailyRevenue: 2_844_000,
  cumulativeRevenue: 704_358_000,
  updatedAt: "2026-03-04 01:07:40",
  isEstimate: true,
};

// 完整週資料（確認後的正式資料）
export const weeklyData: WeeklyBoxOffice[] = [
  {
    week: 1,
    dateRange: "2025/12/01~2025/12/07",
    revenue: 57_720,
    tickets: 222,
    cumulativeRevenue: 57_720,
    cumulativeTickets: 222,
    changeRate: null,
    theaters: 1,
  },
  {
    week: 2,
    dateRange: "2025/12/08~2025/12/14",
    revenue: 564_690,
    tickets: 2_112,
    cumulativeRevenue: 622_410,
    cumulativeTickets: 2_334,
    changeRate: 878.33,
    theaters: 6,
  },
  {
    week: 3,
    dateRange: "2025/12/15~2025/12/21",
    revenue: 142_920,
    tickets: 503,
    cumulativeRevenue: 765_330,
    cumulativeTickets: 2_837,
    changeRate: -74.69,
    theaters: 2,
  },
  {
    week: 4,
    dateRange: "2025/12/22~2025/12/28",
    revenue: 2_248_502,
    tickets: 8_163,
    cumulativeRevenue: 3_013_832,
    cumulativeTickets: 11_000,
    changeRate: 1473.26,
    theaters: 88,
  },
  {
    week: 5,
    dateRange: "2025/12/29~2026/01/04",
    revenue: 7_463_509,
    tickets: 28_216,
    cumulativeRevenue: 10_477_341,
    cumulativeTickets: 39_216,
    changeRate: 231.93,
    theaters: 91,
  },
  {
    week: 6,
    dateRange: "2026/01/05~2026/01/11",
    revenue: 17_761_289,
    tickets: 66_033,
    cumulativeRevenue: 28_238_630,
    cumulativeTickets: 105_249,
    changeRate: 137.98,
    theaters: 90,
  },
  {
    week: 7,
    dateRange: "2026/01/12~2026/01/18",
    revenue: 67_685_840,
    tickets: 246_540,
    cumulativeRevenue: 95_924_470,
    cumulativeTickets: 351_789,
    changeRate: 281.09,
    theaters: 89,
  },
  {
    week: 8,
    dateRange: "2026/01/19~2026/01/25",
    revenue: 152_537_995,
    tickets: 550_716,
    cumulativeRevenue: 248_462_465,
    cumulativeTickets: 902_505,
    changeRate: 125.36,
    theaters: 88,
  },
  {
    week: 9,
    dateRange: "2026/01/26~2026/02/01",
    revenue: 145_240_298,
    tickets: 526_434,
    cumulativeRevenue: 393_702_763,
    cumulativeTickets: 1_428_939,
    changeRate: -4.78,
    theaters: 90,
  },
  {
    week: 10,
    dateRange: "2026/02/02~2026/02/08",
    revenue: 95_133_745,
    tickets: 345_016,
    cumulativeRevenue: 488_836_508,
    cumulativeTickets: 1_773_955,
    changeRate: -34.5,
    theaters: 88,
  },
  {
    week: 11,
    dateRange: "2026/02/09~2026/02/15",
    revenue: 71_142_478,
    tickets: 258_888,
    cumulativeRevenue: 559_978_986,
    cumulativeTickets: 2_032_843,
    changeRate: -25.22,
    theaters: 88,
  },
  {
    week: 12,
    dateRange: "2026/02/16~2026/02/22",
    revenue: 90_329_581,
    tickets: 328_742,
    cumulativeRevenue: 650_308_567,
    cumulativeTickets: 2_361_585,
    changeRate: 26.97,
    theaters: 88,
  },
  {
    week: 13,
    dateRange: "2026/02/23~2026/03/01",
    revenue: 51_024_698,
    tickets: 187_769,
    cumulativeRevenue: 701_333_265,
    cumulativeTickets: 2_549_354,
    changeRate: -43.51,
    theaters: 88,
  },
];

export const taiwanMovieRankings: MovieRanking[] = [
  { rank: 1, title: "陽光女子合唱團", revenue: 701_333_265, tickets: 2_549_354, year: 2025, rating: "輔12級", isActive: true },
  { rank: 2, title: "海角七號", revenue: 534_351_817, tickets: 2_330_000, year: 2008, rating: "普遍級", isActive: false },
  {
    rank: 3,
    title: "賽德克·巴萊（上）：太陽旗",
    revenue: 472_650_000,
    year: 2011,
    isActive: false,
  },
  { rank: 4, title: "那些年，我們一起追的女孩", revenue: 429_054_382, year: 2011, isActive: false },
  { rank: 5, title: "大尾鱸鰻", revenue: 428_027_419, year: 2013, isActive: false },
  { rank: 6, title: "我的少女時代", revenue: 410_000_000, year: 2015, isActive: false },
  { rank: 7, title: "當男人戀愛時", revenue: 405_402_260, year: 2021, isActive: false },
  {
    rank: 8,
    title: "關於我和鬼變成家人的那件事",
    revenue: 363_806_015,
    year: 2023,
    isActive: false,
  },
  { rank: 9, title: "KANO", revenue: 348_360_000, year: 2014, isActive: false },
  { rank: 10, title: "陣頭", revenue: 317_499_033, year: 2012, isActive: false },
];

// 台灣所有電影票房排行（含外片）
export const overallMovieRankings: MovieRanking[] = [
  { rank: 1, title: "阿凡達", revenue: 1_113_700_000, year: 2009, isActive: false, includesRerelease: true },
  { rank: 2, title: "復仇者聯盟：終局之戰", revenue: 910_450_000, year: 2019, isActive: false },
  { rank: 3, title: "鬼滅之刃劇場版 無限城篇 第一章 猗窩座再襲", revenue: 847_470_000, year: 2025, isActive: true },
  { rank: 4, title: "侏羅紀世界", revenue: 827_000_000, year: 2015, isActive: false, includesRerelease: true },
  { rank: 5, title: "玩命關頭7", revenue: 819_000_000, year: 2015, isActive: false, includesRerelease: true },
  { rank: 6, title: "鐵達尼號", revenue: 798_580_000, year: 1997, isActive: false, includesRerelease: true },
  { rank: 7, title: "變形金剛3", revenue: 762_000_000, year: 2011, isActive: false, includesRerelease: true },
  { rank: 8, title: "阿凡達：水之道", revenue: 750_310_000, year: 2022, isActive: false },
  { rank: 9, title: "動物方城市2", revenue: 737_520_000, year: 2025, isActive: true },
  { rank: 10, title: "捍衛戰士：獨行俠", revenue: 736_590_000, year: 2022, isActive: false },
  { rank: 11, title: "陽光女子合唱團", revenue: 701_333_265, tickets: 2_549_354, year: 2025, rating: "輔12級", isActive: true },
  { rank: 12, title: "玩命關頭8", revenue: 650_830_000, year: 2017, isActive: false },
];

// 目標數據（海角七號）
export const targetRevenue = 534_351_817;
export const targetTickets = 2_330_000;

export function getCurrentRanking(): number {
  const currentRevenue = getLatestCumulativeRevenue();
  if (!currentRevenue) return 0;
  return taiwanMovieRankings.findIndex((m) => m.revenue <= currentRevenue) + 1;
}

// 票房相關函數
export function getGapToFirst(): number {
  const currentRevenue = getLatestCumulativeRevenue();
  if (!currentRevenue) return targetRevenue;
  return targetRevenue - currentRevenue;
}

export function getProgressPercentage(): number {
  const currentRevenue = getLatestCumulativeRevenue();
  if (!currentRevenue) return 0;
  return (currentRevenue / targetRevenue) * 100;
}

// 觀影人次相關函數
export function getTicketsGapToFirst(): number {
  const currentTickets = getLatestCumulativeTickets();
  if (!currentTickets) return targetTickets;
  return targetTickets - currentTickets;
}

export function getTicketsProgressPercentage(): number {
  const currentTickets = getLatestCumulativeTickets();
  if (!currentTickets) return 0;
  return (currentTickets / targetTickets) * 100;
}

// 衍生指標計算函數
export function getAverageTicketPrice(week: WeeklyBoxOffice): number {
  if (week.tickets === 0) return 0;
  return week.revenue / week.tickets;
}

export function getDecayRate(
  current: WeeklyBoxOffice,
  previous: WeeklyBoxOffice | null,
): number | null {
  if (!previous || previous.revenue === 0) return null;
  return current.revenue / previous.revenue;
}

export function calculateDerivedMetrics(data: WeeklyBoxOffice[]): DerivedMetrics[] {
  return data.map((week, index) => {
    const previous = index > 0 ? (data[index - 1] ?? null) : null;
    return {
      week: week.week,
      averageTicketPrice: getAverageTicketPrice(week),
      revenuePerTheater: week.theaters > 0 ? week.revenue / week.theaters : 0,
      ticketsPerTheater: week.theaters > 0 ? week.tickets / week.theaters : 0,
      decayRate: getDecayRate(week, previous),
      dailyAverage: week.revenue / 7,
    };
  });
}

// 目標預測函數
const FINAL_WEEK = 14; // 預測統計到第 14 週
const OFFICIAL_RELEASE_WEEK = 5; // 第 5 週正式上映
const THEATER_DROP_START_WEEK = 11; // 第 11 週開始場次驟減

export function calculateTargetProjection(
  data: WeeklyBoxOffice[],
  target: number,
): TargetProjection {
  const latestWeek = data[data.length - 1];
  if (!latestWeek) {
    return {
      remainingToTarget: target,
      requiredWeeklyAverage: target / 4,
      recentWeeklyAverage: 0,
      projectedFinalRevenue: 0,
      projectedWeeksToTarget: null,
      feasibilityScore: "low",
      projectedWeeklyData: [],
    };
  }

  const currentWeekNumber = data.length;
  const currentRevenue = latestWeek.cumulativeRevenue;
  const remainingToTarget = target - currentRevenue;
  const weeksToProject = FINAL_WEEK - currentWeekNumber;

  // 只使用正式上映後的數據（第 5 週起）
  const officialReleaseData = data.filter((w) => w.week >= OFFICIAL_RELEASE_WEEK);

  // 計算近 3 週平均票房（正式上映後）
  const recentWeeks = officialReleaseData.slice(-3);
  const recentWeeklyAverage =
    recentWeeks.length > 0
      ? recentWeeks.reduce((sum, w) => sum + w.revenue, 0) / recentWeeks.length
      : 0;

  // 計算正式上映後的衰退係數（排除試映期異常數據）
  const decayRates: number[] = [];
  for (let i = 1; i < officialReleaseData.length; i++) {
    const prevWeek = officialReleaseData[i - 1];
    const currWeek = officialReleaseData[i];
    if (prevWeek && currWeek && prevWeek.revenue > 0) {
      decayRates.push(currWeek.revenue / prevWeek.revenue);
    }
  }
  const baseDecayRate =
    decayRates.length > 0 ? decayRates.reduce((sum, r) => sum + r, 0) / decayRates.length : 0.9;

  // 模擬到第 13 週的票房
  const projectedWeeklyData: { week: number; revenue: number; cumulative: number }[] = [];
  let lastWeekRevenue = latestWeek.revenue;
  let projectedCumulative = currentRevenue;
  let projectedWeeksToTarget: number | null = null;

  for (let i = 1; i <= weeksToProject; i++) {
    const weekNumber = currentWeekNumber + i;

    // 第 11-13 週場次驟減，加速衰退（使用更激進的衰退係數）
    let decayRate = baseDecayRate;
    if (weekNumber >= THEATER_DROP_START_WEEK) {
      // 場次驟減時，衰退係數減少 30%（更快衰退）
      decayRate = baseDecayRate * 0.7;
    }

    // 使用衰退係數遞減，但不低於 0
    const projectedRevenue = Math.max(0, lastWeekRevenue * Math.min(decayRate, 1));
    projectedCumulative += projectedRevenue;

    projectedWeeklyData.push({
      week: weekNumber,
      revenue: projectedRevenue,
      cumulative: projectedCumulative,
    });

    // 檢查是否達標
    if (projectedWeeksToTarget === null && projectedCumulative >= target) {
      projectedWeeksToTarget = i;
    }

    lastWeekRevenue = projectedRevenue;
  }

  const projectedFinalRevenue = projectedCumulative;

  // 計算達標所需週均票房（到第 13 週）
  const requiredWeeklyAverage =
    remainingToTarget > 0 && weeksToProject > 0 ? remainingToTarget / weeksToProject : 0;

  // 評估達成機率
  let feasibilityScore: "high" | "medium" | "low";
  if (projectedFinalRevenue >= target) {
    feasibilityScore = "high";
  } else if (projectedFinalRevenue >= target * 0.95) {
    // 預測達成 95% 以上
    feasibilityScore = "medium";
  } else {
    feasibilityScore = "low";
  }

  return {
    remainingToTarget,
    requiredWeeklyAverage,
    recentWeeklyAverage,
    projectedFinalRevenue,
    projectedWeeksToTarget,
    feasibilityScore,
    projectedWeeklyData,
  };
}
