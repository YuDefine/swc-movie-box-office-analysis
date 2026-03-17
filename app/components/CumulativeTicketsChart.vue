<script setup lang="ts">
const { weeklyData } = useBoxOfficeData();

const chartData = computed(() =>
  weeklyData.value.map((d) => ({
    week: d.week,
    dateRange: d.dateRange,
    cumulativeTickets: d.cumulativeTickets / 10_000,
  })),
);

const categories = {
  cumulativeTickets: { name: "累計人次（萬）", color: "#10b981" },
};

const xFormatter = (i: number) => {
  const d = chartData.value[i];
  return d ? formatDateRangeShort(d.dateRange) : "";
};
const yFormatter = (tick: number) => (tick === 0 ? "0" : `${Math.trunc(tick)}`);
const { xExplicitTicks } = useChartTicks(computed(() => chartData.value.length));

const latestTickets = computed(() => weeklyData.value[weeklyData.value.length - 1]?.cumulativeTickets ?? 0);
const formatTickets = computed(() =>
  new Intl.NumberFormat("zh-TW").format(Math.round(latestTickets.value)),
);

</script>

<template>
  <UCard class="chart-card">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">累計觀影人次</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">人次成長趨勢</p>
        </div>
        <UBadge color="emerald" variant="soft" size="sm">{{ formatTickets }} 人</UBadge>
      </div>
    </template>

    <LineChart
      :data="chartData"
      :categories="categories"
      :height="256"
      :x-formatter="xFormatter"
      :x-explicit-ticks="xExplicitTicks"
      :y-formatter="yFormatter"
      :y-num-ticks="6"
      x-label="日期"
      y-label="萬人"
    />

  </UCard>
</template>
