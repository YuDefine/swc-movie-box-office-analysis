<script setup lang="ts">
const { weeklyData, movieInfo, latestDaily, taiwanMovieRankings } = useBoxOfficeData();

const rawRevenue = computed(() => getLatestCumulativeRevenue(weeklyData.value, latestDaily.value));
const rawTickets = computed(() => getLatestCumulativeTickets(weeklyData.value, latestDaily.value));
const ranking = computed(() => getCurrentRanking(weeklyData.value, latestDaily.value, taiwanMovieRankings.value));
const weeksSinceRelease = computed(() => {
  const release = new Date(movieInfo.value.releaseDate);
  const now = new Date();
  const diffMs = now.getTime() - release.getTime();
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
});

// Animated counters
const animRevenue = ref(0);
const animTickets = ref(0);
const hasAnimated = ref(false);

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function animateValue(from: number, to: number, duration: number, cb: (v: number) => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cb(to);
    return;
  }
  const start = performance.now();
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1);
    cb(Math.round(from + (to - from) * easeOutCubic(t)));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const isHydrated = ref(false);

onMounted(() => {
  isHydrated.value = true;
  if (!hasAnimated.value) {
    hasAnimated.value = true;
    animateValue(0, rawRevenue.value, 800, (v) => { animRevenue.value = v; });
    animateValue(0, rawTickets.value, 800, (v) => { animTickets.value = v; });
  }
});

watch(rawRevenue, (v) => { if (hasAnimated.value) animRevenue.value = v; });
watch(rawTickets, (v) => { if (hasAnimated.value) animTickets.value = v; });

const displayRevenue = computed(() => {
  const v = hasAnimated.value ? animRevenue.value : rawRevenue.value;
  return (v / 100_000_000).toFixed(2);
});

const displayTickets = computed(() => {
  const v = hasAnimated.value ? animTickets.value : rawTickets.value;
  return Math.floor(v / 10_000);
});

const stats = computed(() => [
  { value: `${displayRevenue.value} 億`, label: "累計票房", color: "text-amber-600 dark:text-amber-400" },
  { value: `${displayTickets.value} 萬人`, label: "累計觀影人次", color: "text-neutral-900 dark:text-neutral-100" },
  { value: `第 ${ranking.value} 名`, label: "國片排名", color: "text-neutral-900 dark:text-neutral-100" },
  { value: `第 ${weeksSinceRelease.value} 週`, label: `${movieInfo.value.releaseDate.replace(/-/g, "/")} 上映`, color: "text-neutral-900 dark:text-neutral-100" },
]);
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div
      class="grid grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm glow-sm"
    >
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="px-5 py-5 lg:py-6 text-center"
        :class="[
          isHydrated ? `reveal-visible stagger-${i + 1}` : '',
          i < stats.length - 1 ? 'border-r border-neutral-200/40 dark:border-neutral-800/40' : '',
          i < 2 ? 'border-b lg:border-b-0 border-neutral-200/40 dark:border-neutral-800/40' : '',
        ]"
      >
        <p class="text-2xl lg:text-3xl font-bold tracking-tight mb-0.5" :class="stat.color">
          {{ stat.value }}
        </p>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 tracking-wide">
          {{ stat.label }}
        </p>
      </div>
    </div>
  </div>
</template>
