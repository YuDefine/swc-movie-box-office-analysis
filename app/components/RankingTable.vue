<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import type { MovieRanking } from "~/types";

const { taiwanMovieRankings, overallMovieRankings, weeklyData, latestDaily, movieInfo } =
  useBoxOfficeData();

interface EnhancedMovieRanking extends MovieRanking {
  isSWC: boolean;
  gapFromSWC: number;
  percentOfSWC: number;
}

type TabValue = "domestic" | "overall";
const activeTab = ref<TabValue>("domestic");

const tabs: { label: string; value: TabValue; icon: string }[] = [
  { label: "國片排行", value: "domestic", icon: "i-lucide-flag" },
  { label: "總體排行", value: "overall", icon: "i-lucide-globe" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatGap(value: number): string {
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absValue);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return "—";
}

function formatPercent(value: number): string {
  const rounded = Number(value.toFixed(1));
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  const sign = normalized > 0 ? "+" : "";
  return `${sign}${normalized.toFixed(1)}%`;
}

const swcRevenue = computed(() =>
  getLatestCumulativeRevenue(weeklyData.value, latestDaily.value),
);

const enhancedRankings = computed<EnhancedMovieRanking[]>(() => {
  const source =
    activeTab.value === "domestic" ? taiwanMovieRankings.value : overallMovieRankings.value;
  const revenue = swcRevenue.value;

  const enhanced = source.map((movie) => {
    const isSWC = movie.title === movieInfo.value.title;
    const movieRevenue = isSWC ? revenue : movie.revenue;
    const rawPercentDiff = revenue > 0 ? ((movieRevenue - revenue) / revenue) * 100 : 0;
    const clampedPercentDiff = Math.max(rawPercentDiff, -100);
    return {
      ...movie,
      isSWC,
      revenue: movieRevenue,
      gapFromSWC: movieRevenue - revenue,
      percentOfSWC: clampedPercentDiff,
    };
  });

  enhanced.sort((a, b) => b.revenue - a.revenue);
  enhanced.forEach((movie, index) => {
    movie.rank = index + 1;
  });

  return enhanced;
});

const columns: TableColumn<EnhancedMovieRanking>[] = [
  { accessorKey: "rank", header: "排名" },
  { accessorKey: "title", header: "片名" },
  { accessorKey: "revenue", header: "票房" },
  { accessorKey: "gapFromSWC", header: "差距" },
  { accessorKey: "percentOfSWC", header: "相對差異%" },
  { accessorKey: "year", header: "年份" },
  { accessorKey: "isActive", header: "狀態" },
];

const totalMovies = computed(() => {
  const source =
    activeTab.value === "domestic" ? taiwanMovieRankings.value : overallMovieRankings.value;
  return source.length;
});
const activeCount = computed(() => {
  const source =
    activeTab.value === "domestic" ? taiwanMovieRankings.value : overallMovieRankings.value;
  return source.filter((m) => m.isActive).length;
});

const headerTitle = computed(() =>
  activeTab.value === "domestic" ? "台灣國片票房排行榜" : "台灣票房總排行榜",
);
const headerSubtitle = computed(() =>
  activeTab.value === "domestic" ? "台灣本土電影歷史票房紀錄" : "台灣所有電影歷史票房紀錄（含外片）",
);

const tableMeta = {
  class: {
    tr: (row: Row<EnhancedMovieRanking>) => {
      if (row.original.isSWC) {
        return "bg-amber-50/50 dark:bg-amber-900/10 border-l-2 border-l-amber-500";
      }
      return row.index % 2 === 0 ? "" : "bg-neutral-50/50 dark:bg-neutral-800/30";
    },
  },
};
</script>

<template>
  <UCard class="chart-card">
    <template #header>
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">{{ headerTitle }}</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{{ headerSubtitle }}</p>
        </div>
        <div class="flex items-center gap-2">
          <UBadge color="neutral" variant="soft" size="sm">{{ totalMovies }} 部</UBadge>
          <UBadge v-if="activeCount > 0" color="success" variant="soft" size="sm">
            {{ activeCount }} 部熱映中
          </UBadge>
        </div>
      </div>

      <!-- Tabs -->
      <div class="inline-flex rounded-lg bg-neutral-100 dark:bg-neutral-800 p-0.5 mt-4">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all',
            activeTab === tab.value
              ? 'bg-white dark:bg-neutral-700 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
          ]"
          @click="activeTab = tab.value"
        >
          <UIcon :name="tab.icon" class="text-sm" />
          {{ tab.label }}
        </button>
      </div>
    </template>

    <UTable :data="enhancedRankings" :columns="columns" :meta="tableMeta" :ui="{ td: 'py-3.5' }">
      <template #rank-cell="{ row }">
        <div class="flex items-center">
          <template v-if="row.original.rank <= 3">
            <UIcon
              name="i-heroicons-trophy-solid"
              :class="[
                'text-lg',
                row.original.rank === 1 ? 'text-yellow-500'
                  : row.original.rank === 2 ? 'text-gray-400'
                  : 'text-orange-700',
              ]"
            />
          </template>
          <span
            v-else
            class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            {{ row.original.rank }}
          </span>
        </div>
      </template>

      <template #title-cell="{ row }">
        <div class="flex items-center gap-1.5">
          <span v-if="row.original.isSWC">☀️</span>
          <span
            :class="[
              row.original.isSWC
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-neutral-800 dark:text-neutral-200 font-medium',
            ]"
          >
            {{ row.original.title }}
          </span>
        </div>
      </template>

      <template #revenue-cell="{ row }">
        <span
          :class="[
            'font-mono text-sm',
            row.original.isSWC
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-neutral-700 dark:text-neutral-300',
          ]"
        >
          {{ formatCurrency(row.original.revenue) }}
        </span>
      </template>

      <template #gapFromSWC-cell="{ row }">
        <span v-if="row.original.isSWC" class="text-sm text-neutral-400 dark:text-neutral-500">—</span>
        <span
          v-else
          :class="[
            'font-mono text-sm',
            row.original.gapFromSWC > 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400',
          ]"
        >
          {{ formatGap(row.original.gapFromSWC) }}
        </span>
      </template>

      <template #percentOfSWC-cell="{ row }">
        <div v-if="row.original.isSWC" class="flex items-center">
          <UBadge color="amber" variant="soft" size="sm">基準</UBadge>
        </div>
        <div v-else class="flex items-center gap-2">
          <span
            :class="[
              'font-mono text-xs',
              row.original.percentOfSWC > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400',
            ]"
          >
            {{ formatPercent(row.original.percentOfSWC) }}
          </span>
          <div class="w-14 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="[row.original.percentOfSWC > 0 ? 'bg-rose-500' : 'bg-emerald-500']"
              :style="{ width: `${Math.max(0, Math.min(100 + row.original.percentOfSWC, 100))}%` }"
            />
          </div>
        </div>
      </template>

      <template #year-cell="{ row }">
        <span class="text-sm text-neutral-500 dark:text-neutral-400">{{ row.original.year }}</span>
      </template>

      <template #isActive-cell="{ row }">
        <span v-if="row.original.isActive" class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          熱映中
        </span>
        <span v-else class="text-sm text-neutral-400 dark:text-neutral-500">已下檔</span>
      </template>
    </UTable>
  </UCard>
</template>
