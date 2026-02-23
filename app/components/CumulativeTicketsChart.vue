<script setup lang="ts">
import { weeklyData, formatDateRangeShort } from "~/data/box-office";

// 準備圖表資料：累計人次（萬）
const chartData = weeklyData.map((d) => ({
  week: d.week,
  dateRange: d.dateRange,
  cumulativeTickets: d.cumulativeTickets / 10_000,
}));

const categories = {
  cumulativeTickets: {
    name: "累計人次（萬）",
    color: "#10b981", // emerald-500
  },
};

const xFormatter = (i: number) => {
  const d = chartData[i];
  return d ? formatDateRangeShort(d.dateRange) : "";
};

const yFormatter = (tick: number) => (tick === 0 ? "0" : `${tick.toFixed(0)}`);

// 限制 Y 軸最多顯示 6 個刻度
const yNumTicks = 6;

// 響應式 x 軸刻度
const { xExplicitTicks } = useChartTicks(chartData.length);

// 累計票房輔助資訊
const latestWeek = weeklyData[weeklyData.length - 1];
const latestRevenue = latestWeek?.cumulativeRevenue ?? 0;
const formatRevenue = (latestRevenue / 100_000_000).toFixed(2);

// 累計人次
const latestTickets = latestWeek?.cumulativeTickets ?? 0;
const formatTickets = new Intl.NumberFormat("zh-TW").format(Math.round(latestTickets));

// 里程碑資料
const milestones = [
  { tickets: 10, label: "10萬人" },
  { tickets: 50, label: "50萬人" },
  { tickets: 100, label: "100萬人" },
  { tickets: 150, label: "150萬人" },
  { tickets: 200, label: "200萬人" },
];
</script>

<template>
  <UCard class="transition-shadow duration-200 hover:shadow-lg">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-emerald-500/10">
            <UIcon name="i-lucide-users" class="text-xl text-emerald-500" />
          </div>
          <div>
            <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">累計觀影人次</h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              累計票房：{{ formatRevenue }} 億元
            </p>
          </div>
        </div>
        <UBadge color="emerald" variant="soft" size="sm"> {{ formatTickets }} 人次 </UBadge>
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
      y-label="萬人"
    />

    <template #footer>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="m in milestones"
          :key="m.tickets"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
            latestTickets >= m.tickets * 10_000
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
          ]"
        >
          <UIcon
            :name="
              latestTickets >= m.tickets * 10_000 ? 'i-lucide-check-circle' : 'i-lucide-circle'
            "
            :class="latestTickets >= m.tickets * 10_000 ? 'text-emerald-500' : 'text-neutral-400'"
          />
          {{ m.label }}
        </div>
      </div>
    </template>
  </UCard>
</template>
