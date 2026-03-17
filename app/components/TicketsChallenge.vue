<script setup lang="ts">
const { weeklyData, latestDaily, targetTickets } = useBoxOfficeData();

const ticketsGap = computed(() =>
  getTicketsGapToFirst(weeklyData.value, latestDaily.value, targetTickets.value),
);
const ticketsProgress = computed(() =>
  getTicketsProgressPercentage(weeklyData.value, latestDaily.value, targetTickets.value),
);
const currentTickets = computed(() =>
  getLatestCumulativeTickets(weeklyData.value, latestDaily.value),
);
const isAchieved = computed(() => ticketsGap.value <= 0);

function formatWan(value: number): string {
  return (Math.floor(value / 1_000) / 10).toFixed(1);
}
</script>

<template>
  <UCard class="chart-card overflow-hidden">
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0 relative">
        <ProgressCircle
          :value="Math.min(Math.round(ticketsProgress), 100)"
          :size="72"
          :stroke-width="6"
          text-size="0.85rem"
        />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-3">
          <h3 class="font-bold text-neutral-800 dark:text-neutral-200">觀影人次奪冠</h3>
          <UBadge v-if="isAchieved" color="success" variant="soft" size="sm">已達成</UBadge>
          <UBadge v-else color="warning" variant="soft" size="sm">挑戰中</UBadge>
        </div>
        <div class="space-y-2">
          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="text-lg font-bold" :class="isAchieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-violet-600 dark:text-violet-400'">
              {{ formatWan(currentTickets) }} 萬人
            </span>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">陽光女子合唱團</span>
          </div>
          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="text-base text-neutral-600 dark:text-neutral-300">{{ formatWan(targetTickets) }} 萬人</span>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">海角七號</span>
          </div>
        </div>
        <p v-if="isAchieved" class="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <UIcon name="i-lucide-check-circle-2" class="inline-block mr-1 align-text-bottom" />
          目標達成 · 超越 {{ formatWan(Math.abs(ticketsGap)) }} 萬人
        </p>
        <p v-else class="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          還需 {{ formatWan(ticketsGap) }} 萬人次
        </p>
      </div>
    </div>
  </UCard>
</template>
