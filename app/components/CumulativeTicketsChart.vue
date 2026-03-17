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

const milestones = [
  { tickets: 10, label: "10萬" },
  { tickets: 50, label: "50萬" },
  { tickets: 100, label: "100萬" },
  { tickets: 150, label: "150萬" },
  { tickets: 200, label: "200萬" },
];
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

    <template #footer>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="m in milestones"
          :key="m.tickets"
          :class="[
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
            latestTickets >= m.tickets * 10_000
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500',
          ]"
        >
          <UIcon
            :name="latestTickets >= m.tickets * 10_000 ? 'i-lucide-check' : 'i-lucide-circle'"
            class="text-[10px]"
          />
          {{ m.label }}
        </span>
      </div>
    </template>
  </UCard>
</template>
