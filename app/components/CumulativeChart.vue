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
  cumulative: {
    name: "累計票房（億元）",
    color: "#f59e0b",
  },
  target: {
    name: "目標（海角七號）",
    color: "#ef4444",
  },
};

const xFormatter = (i: number) => {
  const d = chartData.value[i];
  return d ? d.label : "";
};

const yFormatter = (tick: number) => (tick === 0 ? "0" : `${tick.toFixed(1)} 億`);

const yNumTicks = 6;

const { xExplicitTicks } = useChartTicks(computed(() => chartData.value.length));

const progress = computed(() =>
  Math.round(getProgressPercentage(weeklyData.value, latestDaily.value, targetRevenue.value)),
);
</script>

<template>
  <UCard class="transition-shadow duration-200 hover:shadow-lg">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-amber-500/10">
            <UIcon name="i-lucide-chart-line" class="text-xl text-amber-500" />
          </div>
          <div>
            <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">累計票房</h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">票房累積成長曲線</p>
          </div>
        </div>
        <UBadge :color="progress >= 100 ? 'success' : 'warning'" variant="soft" size="sm">
          達成率：{{ progress }}%
        </UBadge>
      </div>
    </template>

    <LineChart
      :data="chartData"
      :categories="categories"
      :height="256"
      :x-formatter="xFormatter"
      :x-explicit-ticks="xExplicitTicks"
      :y-formatter="yFormatter"
      :y-num-ticks="yNumTicks"
      x-label="日期"
    />
  </UCard>
</template>
