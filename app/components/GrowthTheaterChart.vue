<script setup lang="ts">
const { weeklyData } = useBoxOfficeData();

const chartData = computed(() =>
  weeklyData.value.slice(1).map((d) => ({
    week: d.week,
    dateRange: d.dateRange,
    changeRate: d.changeRate ?? 0,
    theaters: d.theaters,
  })),
);

const categories = {
  changeRate: { name: "週增長率（%）", color: "#10b981" },
  theaters: { name: "上映院數", color: "#8b5cf6" },
};

const xFormatter = (i: number) => {
  const d = chartData.value[i];
  return d ? formatDateRangeShort(d.dateRange) : "";
};
const { xExplicitTicks } = useChartTicks(computed(() => chartData.value.length));

const maxGrowthWeek = computed(() =>
  chartData.value.reduce(
    (max, curr) => (curr.changeRate > max.changeRate ? curr : max),
    chartData.value[0] ?? { week: 0, dateRange: "", changeRate: 0, theaters: 0 },
  ),
);
</script>

<template>
  <UCard class="chart-card">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">增長率 vs 院數</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">戲院數與票房增長關聯</p>
        </div>
        <UBadge color="emerald" variant="soft" size="sm">
          最高 +{{ Math.trunc(maxGrowthWeek.changeRate) }}%
        </UBadge>
      </div>
    </template>

    <BarChart
      :data="chartData"
      :categories="categories"
      :height="256"
      :x-formatter="xFormatter"
      :x-explicit-ticks="xExplicitTicks"
      x-label="日期"
      :y-axis="['changeRate', 'theaters']"
      :bar-padding="0.35"
      :group-padding="0.15"
    />

    <template #footer>
      <div class="space-y-1.5 text-xs">
        <div class="flex items-start gap-2 p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
          <UIcon name="i-lucide-zap" class="text-violet-500 flex-shrink-0 mt-0.5" />
          <span class="text-violet-700 dark:text-violet-300">第 4 週戲院從 2 家擴至 88 家，帶動 1473% 爆發性增長</span>
        </div>
        <div class="flex items-start gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
          <UIcon name="i-lucide-sparkles" class="text-emerald-500 flex-shrink-0 mt-0.5" />
          <span class="text-emerald-700 dark:text-emerald-300">第 7-8 週維持 88-89 家，票房仍有 125-281% 成長，顯示口碑效應</span>
        </div>
      </div>
    </template>
  </UCard>
</template>
