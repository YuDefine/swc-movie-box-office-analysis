import type {
  WeeklyBoxOffice,
  DerivedMetrics,
  TargetProjection,
  DailySnapshot,
} from "~/types";

// 將 dateRange 格式化為簡短顯示（只顯示結束日期，如 "12/7" 或 "2/1"）
export function formatDateRangeShort(dateRange: string): string {
  const [, end] = dateRange.split("~");
  if (!end) return dateRange;

  const parts = end.split("/");
  if (parts.length !== 3) return dateRange;
  const month = Number.parseInt(parts[1]!, 10);
  const day = Number.parseInt(parts[2]!, 10);
  return `${month}/${day}`;
}

// 格式化即時數據的日期顯示（如 "2/4"）
export function formatDailyDateShort(date: string): string {
  const parts = date.split("/");
  if (parts.length !== 3) return date;
  const month = Number.parseInt(parts[1]!, 10);
  const day = Number.parseInt(parts[2]!, 10);
  return `${month}/${day}`;
}

// 解析單日簡易資訊
export function parseDailyInfo(input: string): DailySnapshot | null {
  const dateMatch = input.match(/(\d{1,2})\/(\d{1,2})\(([日一二三四五六])\)/);
  if (!dateMatch) return null;

  const month = dateMatch[1]!.padStart(2, "0");
  const day = dateMatch[2]!.padStart(2, "0");
  const dayOfWeek = dateMatch[3]!;

  const currentYear = new Date().getFullYear();
  const monthNum = Number.parseInt(dateMatch[1]!, 10);
  const year = monthNum <= 6 ? currentYear : currentYear - 1;
  const date = `${year}/${month}/${day}`;

  const dailyMatch = input.match(/#\S+\s+([\d.]+)(萬|億)/);
  if (!dailyMatch) return null;

  let dailyRevenue = Number.parseFloat(dailyMatch[1]!);
  if (dailyMatch[2] === "萬") {
    dailyRevenue *= 10_000;
  } else if (dailyMatch[2] === "億") {
    dailyRevenue *= 100_000_000;
  }

  const cumulativeMatch = input.match(/累計[：:]\s*((\d+)億)?([\d.]+)?(萬)?/);
  if (!cumulativeMatch) return null;

  let cumulativeRevenue = 0;
  if (cumulativeMatch[2]) {
    cumulativeRevenue += Number.parseInt(cumulativeMatch[2], 10) * 100_000_000;
  }
  if (cumulativeMatch[3]) {
    const wanValue = Number.parseFloat(cumulativeMatch[3]);
    if (cumulativeMatch[4] === "萬" || cumulativeMatch[2]) {
      cumulativeRevenue += wanValue * 10_000;
    } else {
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
export function getLatestCumulativeRevenue(
  weeklyData: WeeklyBoxOffice[],
  latestDaily: DailySnapshot | null,
): number {
  if (latestDaily && latestDaily.cumulativeRevenue > 0) {
    const latestWeek = weeklyData[weeklyData.length - 1];
    if (!latestWeek || latestDaily.cumulativeRevenue > latestWeek.cumulativeRevenue) {
      return latestDaily.cumulativeRevenue;
    }
  }
  const latestWeek = weeklyData[weeklyData.length - 1];
  return latestWeek?.cumulativeRevenue ?? 0;
}

// 取得最新累計人次（優先使用 latestDaily，否則使用 weeklyData）
export function getLatestCumulativeTickets(
  weeklyData: WeeklyBoxOffice[],
  latestDaily: DailySnapshot | null,
): number {
  if (latestDaily && latestDaily.cumulativeTickets && latestDaily.cumulativeTickets > 0) {
    const latestWeek = weeklyData[weeklyData.length - 1];
    if (!latestWeek || latestDaily.cumulativeTickets > latestWeek.cumulativeTickets) {
      return latestDaily.cumulativeTickets;
    }
  }
  const latestWeek = weeklyData[weeklyData.length - 1];
  return latestWeek?.cumulativeTickets ?? 0;
}

// 檢查是否有比 weeklyData 更新的即時數據
export function hasNewerDailyData(
  weeklyData: WeeklyBoxOffice[],
  latestDaily: DailySnapshot | null,
): boolean {
  if (!latestDaily || latestDaily.cumulativeRevenue <= 0) return false;
  const latestWeek = weeklyData[weeklyData.length - 1];
  return !latestWeek || latestDaily.cumulativeRevenue > latestWeek.cumulativeRevenue;
}

export function getCurrentRanking(
  weeklyData: WeeklyBoxOffice[],
  latestDaily: DailySnapshot | null,
  rankings: { revenue: number }[],
): number {
  const currentRevenue = getLatestCumulativeRevenue(weeklyData, latestDaily);
  if (!currentRevenue) return 0;
  return rankings.findIndex((m) => m.revenue <= currentRevenue) + 1;
}

export function getGapToFirst(
  weeklyData: WeeklyBoxOffice[],
  latestDaily: DailySnapshot | null,
  target: number,
): number {
  const currentRevenue = getLatestCumulativeRevenue(weeklyData, latestDaily);
  if (!currentRevenue) return target;
  return target - currentRevenue;
}

export function getProgressPercentage(
  weeklyData: WeeklyBoxOffice[],
  latestDaily: DailySnapshot | null,
  target: number,
): number {
  const currentRevenue = getLatestCumulativeRevenue(weeklyData, latestDaily);
  if (!currentRevenue) return 0;
  return (currentRevenue / target) * 100;
}

export function getTicketsGapToFirst(
  weeklyData: WeeklyBoxOffice[],
  latestDaily: DailySnapshot | null,
  target: number,
): number {
  const currentTickets = getLatestCumulativeTickets(weeklyData, latestDaily);
  if (!currentTickets) return target;
  return target - currentTickets;
}

export function getTicketsProgressPercentage(
  weeklyData: WeeklyBoxOffice[],
  latestDaily: DailySnapshot | null,
  target: number,
): number {
  const currentTickets = getLatestCumulativeTickets(weeklyData, latestDaily);
  if (!currentTickets) return 0;
  return (currentTickets / target) * 100;
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
const FINAL_WEEK = 14;
const OFFICIAL_RELEASE_WEEK = 5;
const THEATER_DROP_START_WEEK = 11;

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

  const officialReleaseData = data.filter((w) => w.week >= OFFICIAL_RELEASE_WEEK);

  const recentWeeks = officialReleaseData.slice(-3);
  const recentWeeklyAverage =
    recentWeeks.length > 0
      ? recentWeeks.reduce((sum, w) => sum + w.revenue, 0) / recentWeeks.length
      : 0;

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

  const projectedWeeklyData: { week: number; revenue: number; cumulative: number }[] = [];
  let lastWeekRevenue = latestWeek.revenue;
  let projectedCumulative = currentRevenue;
  let projectedWeeksToTarget: number | null = null;

  for (let i = 1; i <= weeksToProject; i++) {
    const weekNumber = currentWeekNumber + i;

    let decayRate = baseDecayRate;
    if (weekNumber >= THEATER_DROP_START_WEEK) {
      decayRate = baseDecayRate * 0.7;
    }

    const projectedRevenue = Math.max(0, lastWeekRevenue * Math.min(decayRate, 1));
    projectedCumulative += projectedRevenue;

    projectedWeeklyData.push({
      week: weekNumber,
      revenue: projectedRevenue,
      cumulative: projectedCumulative,
    });

    if (projectedWeeksToTarget === null && projectedCumulative >= target) {
      projectedWeeksToTarget = i;
    }

    lastWeekRevenue = projectedRevenue;
  }

  const projectedFinalRevenue = projectedCumulative;

  const requiredWeeklyAverage =
    remainingToTarget > 0 && weeksToProject > 0 ? remainingToTarget / weeksToProject : 0;

  let feasibilityScore: "high" | "medium" | "low";
  if (projectedFinalRevenue >= target) {
    feasibilityScore = "high";
  } else if (projectedFinalRevenue >= target * 0.95) {
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
