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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("zh-TW").format(value);
}
</script>

<template>
  <UCard class="overflow-hidden">
    <div class="flex flex-col lg:flex-row gap-8 items-center">
      <!-- Progress Circle Section -->
      <div class="flex-shrink-0 relative">
        <div
          class="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-500/10 dark:to-purple-500/10 rounded-full blur-2xl scale-150"
        />
        <ProgressCircle
          :value="Math.min(Math.round(ticketsProgress), 100)"
          :size="180"
          :stroke-width="14"
          text-size="1.75rem"
        />
      </div>

      <!-- Info Section -->
      <div class="flex-1 space-y-6 w-full">
        <!-- Target Info -->
        <div
          class="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200/50 dark:border-violet-700/30"
        >
          <div class="flex-shrink-0 p-2.5 rounded-lg bg-violet-500/10">
            <UIcon name="i-lucide-users" class="text-2xl text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">目標：觀影人次奪冠《海角七號》</p>
            <p class="text-xl font-bold text-violet-700 dark:text-violet-300">
              {{ formatNumber(targetTickets) }} 人次
            </p>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div
            class="p-5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200/50 dark:border-violet-700/30 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-lucide-trending-up" class="text-violet-600 dark:text-violet-400" />
              <p class="text-sm font-medium text-violet-700 dark:text-violet-300">目前人次</p>
            </div>
            <p class="text-2xl font-bold text-violet-700 dark:text-violet-300">
              {{ formatNumber(currentTickets) }} 人次
            </p>
          </div>

          <div
            :class="[
              'p-5 rounded-xl border transition-transform duration-200 hover:scale-[1.02]',
              isAchieved
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-700/30'
                : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200/50 dark:border-rose-700/30',
            ]"
          >
            <div class="flex items-center gap-2 mb-2">
              <UIcon
                :name="isAchieved ? 'i-lucide-check-circle' : 'i-lucide-arrow-up-circle'"
                :class="
                  isAchieved
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                "
              />
              <p
                :class="[
                  'text-sm font-medium',
                  isAchieved
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-rose-700 dark:text-rose-300',
                ]"
              >
                {{ isAchieved ? "已達成" : "還需要" }}
              </p>
            </div>
            <p
              :class="[
                'text-2xl font-bold',
                isAchieved
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-rose-700 dark:text-rose-300',
              ]"
            >
              {{ isAchieved ? "目標達成!" : `${formatNumber(ticketsGap)} 人次` }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
