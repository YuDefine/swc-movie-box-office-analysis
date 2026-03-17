<script setup lang="ts">
const { targetRevenue } = useBoxOfficeData();

const crownRevenue = 547_804_000;

function formatYi(value: number): string {
  return (value / 100_000_000).toFixed(2);
}
</script>

<template>
  <UCard class="chart-card overflow-hidden">
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20">
        <UIcon name="i-lucide-trophy" class="text-2xl text-amber-600 dark:text-amber-400" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-3">
          <h3 class="font-bold text-neutral-800 dark:text-neutral-200">票房奪冠</h3>
          <UBadge color="success" variant="soft" size="sm">已達成</UBadge>
        </div>
        <div class="space-y-2">
          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="text-lg font-bold text-amber-600 dark:text-amber-400">{{ formatYi(crownRevenue) }} 億</span>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">陽光女子合唱團</span>
          </div>
          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="text-base text-neutral-600 dark:text-neutral-300">{{ formatYi(targetRevenue) }} 億</span>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">海角七號</span>
          </div>
        </div>
        <p class="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <UIcon name="i-lucide-check-circle-2" class="inline-block mr-1 align-text-bottom" />
          2026/2/14 達成 · 超越 {{ formatYi(crownRevenue - targetRevenue) }} 億
        </p>
      </div>
    </div>
  </UCard>
</template>
