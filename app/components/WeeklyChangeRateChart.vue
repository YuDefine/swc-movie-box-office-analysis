<script setup lang="ts">
const { weeklyData } = useBoxOfficeData();

const chartData = computed(() =>
  weeklyData.value.slice(1).map((d) => ({
    week: d.week,
    dateRange: d.dateRange,
    changeRate: d.changeRate ?? 0,
  })),
);

const categories = {
  changeRate: { name: "週變動率（%）", color: "#10b981" },
};

const xFormatter = (i: number) => {
  const d = chartData.value[i];
  return d ? formatDateRangeShort(d.dateRange) : "";
};
const { xExplicitTicks } = useChartTicks(computed(() => chartData.value.length));

const positiveWeeks = computed(() => chartData.value.filter((d) => d.changeRate > 0).length);
const negativeWeeks = computed(() => chartData.value.filter((d) => d.changeRate < 0).length);
const maxGrowthWeek = computed(() => chartData.value.find((d) => d.changeRate === Math.max(...chartData.value.map((x) => x.changeRate))));
</script>

<template>
  <UCard class="chart-card">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">週變動率</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">每週票房變化百分比</p>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />{{ positiveWeeks }}
          </span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500" />{{ negativeWeeks }}
          </span>
        </div>
      </div>
    </template>

    <BarChart
      :data="chartData"
      :categories="categories"
      :height="256"
      :x-formatter="xFormatter"
      :x-explicit-ticks="xExplicitTicks"
      x-label="日期"
      :y-axis="['changeRate']"
      :bar-padding="0.4"
    />

    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <div class="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
          <p class="text-[11px] text-emerald-600 dark:text-emerald-400 mb-0.5">正成長</p>
          <p class="font-bold text-sm text-emerald-700 dark:text-emerald-300">{{ positiveWeeks }} 週</p>
        </div>
        <div class="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
          <p class="text-[11px] text-red-600 dark:text-red-400 mb-0.5">負成長</p>
          <p class="font-bold text-sm text-red-700 dark:text-red-300">{{ negativeWeeks }} 週</p>
        </div>
        <div class="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
          <p class="text-[11px] text-amber-600 dark:text-amber-400 mb-0.5">最高成長</p>
          <p class="font-bold text-sm text-amber-700 dark:text-amber-300">
            {{ maxGrowthWeek ? formatDateRangeShort(maxGrowthWeek.dateRange) : '-' }}
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>
