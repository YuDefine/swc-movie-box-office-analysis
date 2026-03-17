<script setup lang="ts">
const { weeklyData } = useBoxOfficeData();

const metrics = computed(() => calculateDerivedMetrics(weeklyData.value));

const totalRevenue = computed(() => weeklyData.value.reduce((sum, w) => sum + w.revenue, 0));
const totalTickets = computed(() => weeklyData.value.reduce((sum, w) => sum + w.tickets, 0));
const overallAveragePrice = computed(() =>
  totalTickets.value > 0 ? totalRevenue.value / totalTickets.value : 0,
);

const chartData = computed(() =>
  metrics.value.map((m, i) => ({
    week: m.week,
    dateRange: weeklyData.value[i]?.dateRange ?? "",
    price: Math.round(m.averageTicketPrice),
    average: Math.round(overallAveragePrice.value),
  })),
);

const categories = {
  price: { name: "週平均票價（元）", color: "#f59e0b" },
  average: { name: "整體平均票價", color: "#6b7280" },
};

const xFormatter = (i: number) => {
  const d = chartData.value[i];
  return d ? formatDateRangeShort(d.dateRange) : "";
};
const { xExplicitTicks } = useChartTicks(computed(() => chartData.value.length));

const minPrice = computed(() => Math.min(...chartData.value.map((d) => d.price)));
const maxPrice = computed(() => Math.max(...chartData.value.map((d) => d.price)));
</script>

<template>
  <UCard class="chart-card">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">平均票價趨勢</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">每週平均票價變化</p>
        </div>
        <UBadge color="neutral" variant="soft" size="sm">
          均價 {{ Math.round(overallAveragePrice) }} 元
        </UBadge>
      </div>
    </template>

    <LineChart
      :data="chartData"
      :categories="categories"
      :height="256"
      :x-formatter="xFormatter"
      :x-explicit-ticks="xExplicitTicks"
      x-label="日期"
      y-label="元"
    />

    <template #footer>
      <div class="grid grid-cols-3 gap-3 text-sm">
        <div>
          <span class="text-neutral-500 dark:text-neutral-400 text-xs">最低</span>
          <p class="font-semibold text-neutral-800 dark:text-neutral-200">{{ minPrice }} 元</p>
        </div>
        <div>
          <span class="text-neutral-500 dark:text-neutral-400 text-xs">最高</span>
          <p class="font-semibold text-neutral-800 dark:text-neutral-200">{{ maxPrice }} 元</p>
        </div>
        <div>
          <span class="text-neutral-500 dark:text-neutral-400 text-xs">價差</span>
          <p class="font-semibold text-neutral-800 dark:text-neutral-200">{{ maxPrice - minPrice }} 元</p>
        </div>
      </div>
    </template>
  </UCard>
</template>
