<script setup lang="ts">
const { weeklyData } = useBoxOfficeData();

const OFFICIAL_RELEASE_WEEK = 5;

const metrics = computed(() => calculateDerivedMetrics(weeklyData.value));

const chartData = computed(() =>
  metrics.value
    .filter((m) => m.week >= OFFICIAL_RELEASE_WEEK)
    .map((m) => {
      const weekData = weeklyData.value.find((w) => w.week === m.week);
      return {
        week: m.week,
        dateRange: weekData?.dateRange ?? "",
        decayRate: m.decayRate !== null ? Number(m.decayRate.toFixed(2)) : 0,
        baseline: 1,
      };
    }),
);

const categories = {
  decayRate: {
    name: "週變動係數",
    color: "#8b5cf6",
  },
  baseline: {
    name: "基準線（持平）",
    color: "#6b7280",
  },
};

const xFormatter = (i: number) => {
  const d = chartData.value[i];
  return d ? formatDateRangeShort(d.dateRange) : "";
};

const { xExplicitTicks } = useChartTicks(computed(() => chartData.value.length));

const growthWeeks = computed(() => chartData.value.filter((d) => d.decayRate > 1).length);
const decayWeeks = computed(() => chartData.value.filter((d) => d.decayRate < 1 && d.decayRate > 0).length);
const avgDecayRate = computed(() =>
  chartData.value.length > 0
    ? chartData.value.reduce((sum, d) => sum + d.decayRate, 0) / chartData.value.length
    : 0,
);

const recent3 = computed(() => chartData.value.slice(-3));
const recentAvg = computed(() =>
  recent3.value.length > 0
    ? recent3.value.reduce((sum, d) => sum + d.decayRate, 0) / recent3.value.length
    : 0,
);
const trend = computed(() => (recentAvg.value >= 1 ? "成長" : "衰退"));
const trendColor = computed(() => (recentAvg.value >= 1 ? "success" : "warning"));
</script>

<template>
  <UCard class="transition-shadow duration-200 hover:shadow-lg">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-violet-500/10">
            <UIcon name="i-lucide-activity" class="text-xl text-violet-500" />
          </div>
          <div>
            <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">週變動係數</h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              本週票房 / 上週票房（&gt;1 成長, &lt;1 衰退）
            </p>
          </div>
        </div>
        <UBadge :color="trendColor" variant="soft" size="sm"> 近期趨勢：{{ trend }} </UBadge>
      </div>
    </template>

    <BarChart
      :data="chartData"
      :categories="categories"
      :height="256"
      :x-formatter="xFormatter"
      :x-explicit-ticks="xExplicitTicks"
      x-label="日期"
      :y-axis="['decayRate', 'baseline']"
      :bar-padding="0.35"
      :group-padding="0.15"
    />

    <template #footer>
      <div class="grid grid-cols-4 gap-3">
        <div class="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
          <p class="text-xs text-emerald-600 dark:text-emerald-400 mb-1">成長週數</p>
          <p class="font-bold text-emerald-700 dark:text-emerald-300">{{ growthWeeks }} 週</p>
        </div>
        <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
          <p class="text-xs text-red-600 dark:text-red-400 mb-1">衰退週數</p>
          <p class="font-bold text-red-700 dark:text-red-300">{{ decayWeeks }} 週</p>
        </div>
        <div class="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-center">
          <p class="text-xs text-violet-600 dark:text-violet-400 mb-1">平均係數</p>
          <p class="font-bold text-violet-700 dark:text-violet-300">
            {{ avgDecayRate.toFixed(2) }}
          </p>
        </div>
        <div class="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
          <p class="text-xs text-amber-600 dark:text-amber-400 mb-1">近 3 週平均</p>
          <p class="font-bold text-amber-700 dark:text-amber-300">{{ recentAvg.toFixed(2) }}</p>
        </div>
      </div>
    </template>
  </UCard>
</template>
