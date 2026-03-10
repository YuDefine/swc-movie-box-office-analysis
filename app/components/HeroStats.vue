<script setup lang="ts">
const { weeklyData, movieInfo, latestDaily, taiwanMovieRankings } = useBoxOfficeData();

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("zh-TW").format(value);
}

const stats = computed(() => {
  const revenue = getLatestCumulativeRevenue(weeklyData.value, latestDaily.value);
  const tickets = getLatestCumulativeTickets(weeklyData.value, latestDaily.value);
  const ranking = getCurrentRanking(weeklyData.value, latestDaily.value, taiwanMovieRankings.value);

  return [
    {
      label: "累計票房",
      value: formatCurrency(revenue),
      icon: "i-lucide-banknote",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      highlight: true,
    },
    {
      label: "累計觀影人次",
      value: `${formatNumber(tickets)} 人`,
      icon: "i-lucide-users",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "票房排名",
      value: `第 ${ranking} 名`,
      icon: "i-lucide-trophy",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "上映日期",
      value: movieInfo.value.releaseDate.replace(/-/g, "/"),
      icon: "i-lucide-calendar",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
  ];
});
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <UCard
      v-for="stat in stats"
      :key="stat.label"
      :class="[
        'transition-all duration-200 hover:shadow-lg cursor-default',
        stat.highlight && 'ring-2 ring-amber-500/20 dark:ring-amber-400/20',
      ]"
    >
      <div class="flex items-center gap-4">
        <div :class="['flex-shrink-0 p-3 rounded-xl', stat.bgColor]">
          <UIcon :name="stat.icon" :class="['text-xl', stat.color]" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {{ stat.label }}
          </p>
          <p
            :class="[
              'text-xl font-bold truncate',
              stat.highlight
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-neutral-900 dark:text-neutral-100',
            ]"
          >
            {{ stat.value }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
