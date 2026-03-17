<script setup lang="ts">
const { weeklyData, latestDaily, targetRevenue } = useBoxOfficeData();

const chartData = computed(() => {
  const target = targetRevenue.value;
  const weeklyChartData = weeklyData.value.map((d) => ({
    week: d.week,
    dateRange: d.dateRange,
    label: formatDateRangeShort(d.dateRange),
    cumulative: d.cumulativeRevenue / 100_000_000,
    target: target / 100_000_000,
  }));

  const hasDaily = hasNewerDailyData(weeklyData.value, latestDaily.value);
  if (hasDaily && latestDaily.value) {
    return [
      ...weeklyChartData,
      {
        week: weeklyData.value.length + 0.5,
        dateRange: latestDaily.value.date,
        label: `${formatDailyDateShort(latestDaily.value.date)}*`,
        cumulative: latestDaily.value.cumulativeRevenue / 100_000_000,
        target: target / 100_000_000,
      },
    ];
  }
  return weeklyChartData;
});

const categories = {
  cumulative: { name: "累計票房（億元）", color: "#f59e0b" },
  target: { name: "目標（海角七號）", color: "#ef4444" },
};

const xFormatter = (i: number) => chartData.value[i]?.label ?? "";
const yFormatter = (tick: number) => (tick === 0 ? "0" : `${(Math.trunc(tick * 10) / 10).toFixed(1)} 億`);
const { xExplicitTicks } = useChartTicks(computed(() => chartData.value.length));

const progress = computed(() =>
  Math.round(getProgressPercentage(weeklyData.value, latestDaily.value, targetRevenue.value)),
);
</script>

<template>
  <UCard class="chart-card">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">累計票房成長曲線</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">對比海角七號 5.34 億目標線</p>
        </div>
        <UBadge :color="progress >= 100 ? 'success' : 'warning'" variant="soft" size="sm">
          {{ progress }}%
        </UBadge>
      </div>
    </template>

    <LineChart
      :data="chartData"
      :categories="categories"
      :height="280"
      :x-formatter="xFormatter"
      :x-explicit-ticks="xExplicitTicks"
      :y-formatter="yFormatter"
      :y-num-ticks="6"
      x-label="日期"
    />
  </UCard>
</template>
