<script setup lang="ts">
import { targetRevenue } from "~/data/box-office";

const crownRevenue = 547_804_000;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
</script>

<template>
  <UCard class="overflow-hidden">
    <div
      class="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-300/50 dark:border-amber-600/50"
    >
      <div class="flex-shrink-0 p-4 rounded-xl bg-amber-500/20">
        <UIcon name="i-lucide-trophy" class="text-4xl text-amber-600 dark:text-amber-400" />
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-lucide-check-circle-2" class="text-lg text-amber-600 dark:text-amber-400" />
          <p class="text-sm font-bold text-amber-700 dark:text-amber-300">票房已奪冠 · 2026/2/14 達成</p>
        </div>
        <div class="divide-y divide-amber-300/30 dark:divide-amber-600/30">
          <!-- 陽光女子合唱團 -->
          <div class="flex flex-wrap items-center gap-2 pb-2">
            <span class="text-lg font-bold text-amber-900 dark:text-amber-100">《陽光女子合唱團》</span>
            <span class="font-bold text-amber-800 dark:text-amber-200">{{ formatCurrency(crownRevenue) }}</span>
            <span class="text-xs text-amber-700 dark:text-amber-300 hidden sm:inline">&middot;</span>
            <span class="text-xs text-amber-700 dark:text-amber-300">2025 年發行</span>
            <span class="px-1.5 py-0.5 rounded text-xs bg-amber-500/20 text-amber-800 dark:text-amber-200">輔12級</span>
          </div>
          <!-- 海角七號 -->
          <div class="flex flex-wrap items-center gap-2 pt-2">
            <span class="text-base text-amber-800 dark:text-amber-200">《海角七號》</span>
            <span class="text-sm text-amber-700 dark:text-amber-300">{{ formatCurrency(targetRevenue) }}</span>
            <span class="text-xs text-amber-700/70 dark:text-amber-300/70 hidden sm:inline">&middot;</span>
            <span class="text-xs text-amber-700/70 dark:text-amber-300/70">2008 年發行</span>
            <span class="px-1.5 py-0.5 rounded text-xs bg-amber-400/15 text-amber-700 dark:text-amber-300">普遍級</span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
