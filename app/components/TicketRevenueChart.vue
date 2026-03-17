<script setup lang="ts">
const { weeklyData } = useBoxOfficeData();

const chartData = computed(() =>
  weeklyData.value.map((d) => ({
    week: d.week,
    dateRange: d.dateRange,
    revenue: d.revenue / 100_000_000,
  })),
);

const categories = {
  revenue: { name: "週票房（億元）", color: "#f59e0b" },
};

const xFormatter = (i: number) => {
  const d = chartData.value[i];
  return d ? formatDateRangeShort(d.dateRange) : "";
};
const yFormatter = (tick: number) => (tick === 0 ? "0" : `${(Math.trunc(tick * 10) / 10).toFixed(1)}`);
const { xExplicitTicks } = useChartTicks(computed(() => chartData.value.length));

const totalRevenue = computed(() => weeklyData.value.reduce((sum, d) => sum + d.revenue, 0));
const totalTickets = computed(() => weeklyData.value.reduce((sum, d) => sum + d.tickets, 0));
const overallAvgPrice = computed(() => Math.round(totalRevenue.value / totalTickets.value));

const latestTickets = computed(() => weeklyData.value[weeklyData.value.length - 1]?.tickets ?? 0);
const formatLatestTickets = computed(() => new Intl.NumberFormat("zh-TW").format(latestTickets.value));

const recentTickets = computed(() =>
  weeklyData.value.slice(-4).map((d) => ({
    week: d.week,
    dateRange: d.dateRange,
    tickets: d.tickets,
  })),
);
</script>

<template>
  <UCard class="chart-card">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">週票房收入</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">本週 {{ formatLatestTickets }} 人次</p>
        </div>
        <UBadge color="amber" variant="soft" size="sm">均價 NT${{ overallAvgPrice }}</UBadge>
      </div>
    </template>

    <AreaChart
      :data="chartData"
      :categories="categories"
      :height="256"
      :x-formatter="xFormatter"
      :x-explicit-ticks="xExplicitTicks"
      :y-formatter="yFormatter"
      :y-num-ticks="6"
      x-label="日期"
      y-label="億元"
    />

    <template #footer>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="text-neutral-500 dark:text-neutral-400">近 4 週：</span>
        <span
          v-for="item in recentTickets"
          :key="item.week"
          class="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
        >
          {{ formatDateRangeShort(item.dateRange) }}
          <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ new Intl.NumberFormat("zh-TW").format(item.tickets) }}</span>
        </span>
      </div>
    </template>
  </UCard>
</template>
