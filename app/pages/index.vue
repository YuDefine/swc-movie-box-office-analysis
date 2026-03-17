<script setup lang="ts">
const { movieInfo, weeklyData, latestDaily, taiwanMovieRankings } = useBoxOfficeData();

const colorMode = useColorMode();

function toggleColorMode() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

const pageTitle = computed(() => `${movieInfo.value.title} - 台灣票房分析`);
const pageDescription = computed(() => {
  const revenue = getLatestCumulativeRevenue(weeklyData.value, latestDaily.value);
  const ranking = getCurrentRanking(weeklyData.value, latestDaily.value, taiwanMovieRankings.value);
  return `追蹤《${movieInfo.value.title}》票房表現，目前累計票房 ${(revenue / 100_000_000).toFixed(2)} 億，台灣國產電影排行第 ${ranking} 名。每週更新票房趨勢、戲院數據等分析資訊。`;
});

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogImage: "/og-image.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterImage: "/og-image.jpg",
});

useSchemaOrg([
  defineWebPage({
    name: "陽光女子合唱團 - 台灣票房分析",
    description: "追蹤台灣電影《陽光女子合唱團》票房數據即時分析",
  }),
  defineWebSite({
    name: "陽光女子合唱團票房分析",
    description: "追蹤台灣電影《陽光女子合唱團》票房數據即時分析",
  }),
  defineOrganization({
    name: "Yudefine 域定資訊工作室",
    logo: "/android-chrome-512x512.png",
  }),
]);

// Scroll reveals
const { target: achieveRef, isRevealed: achieveRevealed, isHydrated: achieveHydrated } = useScrollReveal();
const { target: trendRef, isRevealed: trendRevealed, isHydrated: trendHydrated } = useScrollReveal();
const { target: rankRef, isRevealed: rankRevealed, isHydrated: rankHydrated } = useScrollReveal();
const { target: analysisRef, isRevealed: analysisRevealed, isHydrated: analysisHydrated } = useScrollReveal();

const heroEntered = ref(false);
onMounted(() => {
  heroEntered.value = true;
});
</script>

<template>
  <div class="min-h-screen bg-stone-50 dark:bg-neutral-950">
    <!-- Global actions -->
    <div class="fixed top-4 right-4 z-50 flex items-center gap-1">
      <UButton
        to="https://github.com/YuDefine/swc-movie-box-office-analysis"
        target="_blank"
        variant="ghost"
        color="neutral"
        size="lg"
        icon="i-simple-icons-github"
        aria-label="GitHub"
      />
      <UButton
        variant="ghost"
        color="neutral"
        size="lg"
        :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
        @click="toggleColorMode"
      />
    </div>

    <!-- ══════════════════════════════════════ -->
    <!--                 HERO                  -->
    <!-- ══════════════════════════════════════ -->
    <div class="relative overflow-hidden">
      <!-- Ambient glow -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px] bg-amber-400/[0.12] dark:bg-amber-500/[0.06]"
      />
      <div
        class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
      />

      <UContainer
        class="relative pt-14 pb-12 lg:pt-20 lg:pb-16"
        :class="heroEntered ? 'animate-hero-entrance' : 'opacity-0'"
      >
        <div class="text-center mb-10 lg:mb-14">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6"
          >
            <span>☀️</span>
            <span>台灣國片票房冠軍</span>
          </div>

          <h1 class="text-5xl lg:text-7xl font-bold mb-4 tracking-tight leading-tight">
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 dark:from-amber-300 dark:via-orange-400 dark:to-amber-300"
            >{{ movieInfo.title }}</span>
          </h1>
          <p class="text-neutral-500 dark:text-neutral-400 text-lg">
            台灣票房數據分析儀表板
          </p>
        </div>

        <!-- Hero Stats strip -->
        <HeroStats class="mb-10" />

        <!-- CTA -->
        <div class="text-center">
          <UButton
            to="https://today.line.me/tw/v3/movie/1Dnwjm3/1"
            target="_blank"
            size="xl"
            icon="i-heroicons-ticket"
            class="font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
          >
            立即購票
          </UButton>
        </div>
      </UContainer>
    </div>

    <!-- ══════════════════════════════════════ -->
    <!--             MAIN CONTENT              -->
    <!-- ══════════════════════════════════════ -->
    <UContainer class="pb-16">

      <!-- ─── 奪冠里程碑 ─── -->
      <section
        ref="achieveRef"
        class="py-12 lg:py-16"
        :class="[
          achieveHydrated && !achieveRevealed ? 'reveal-hidden' : '',
          achieveHydrated && achieveRevealed ? 'reveal-visible' : '',
        ]"
      >
        <div class="flex items-center gap-2.5 mb-8">
          <div class="h-2 w-2 rounded-full bg-amber-500" />
          <h2 class="text-xl font-bold text-neutral-800 dark:text-neutral-200">奪冠里程碑</h2>
        </div>
        <div class="grid gap-5 lg:grid-cols-2">
          <RevenueAchievement />
          <TicketsChallenge />
        </div>
      </section>

      <!-- Subtle section divider -->
      <div class="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />

      <!-- ─── 票房趨勢 ─── -->
      <section
        ref="trendRef"
        class="py-12 lg:py-16"
        :class="[
          trendHydrated && !trendRevealed ? 'reveal-hidden' : '',
          trendHydrated && trendRevealed ? 'reveal-visible' : '',
        ]"
      >
        <div class="flex items-center gap-2.5 mb-8">
          <div class="h-2 w-2 rounded-full bg-amber-500" />
          <h2 class="text-xl font-bold text-neutral-800 dark:text-neutral-200">票房趨勢</h2>
        </div>
        <!-- Featured chart: full width -->
        <CumulativeChart class="mb-5" />
        <div class="grid gap-5 lg:grid-cols-2">
          <WeeklyChart />
          <CumulativeTicketsChart />
        </div>
      </section>

      <div class="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />

      <!-- ─── 票房排行 ─── -->
      <section
        ref="rankRef"
        class="py-12 lg:py-16"
        :class="[
          rankHydrated && !rankRevealed ? 'reveal-hidden' : '',
          rankHydrated && rankRevealed ? 'reveal-visible' : '',
        ]"
      >
        <div class="flex items-center gap-2.5 mb-8">
          <div class="h-2 w-2 rounded-full bg-emerald-500" />
          <h2 class="text-xl font-bold text-neutral-800 dark:text-neutral-200">票房排行</h2>
        </div>
        <RankingTable />
      </section>

      <div class="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />

      <!-- ─── 進階分析 ─── -->
      <section
        ref="analysisRef"
        class="py-12 lg:py-16"
        :class="[
          analysisHydrated && !analysisRevealed ? 'reveal-hidden' : '',
          analysisHydrated && analysisRevealed ? 'reveal-visible' : '',
        ]"
      >
        <div class="flex items-center gap-2.5 mb-8">
          <div class="h-2 w-2 rounded-full bg-violet-500" />
          <h2 class="text-xl font-bold text-neutral-800 dark:text-neutral-200">進階分析</h2>
        </div>
        <div class="grid gap-5 lg:grid-cols-2">
          <TicketRevenueChart />
          <WeeklyChangeRateChart />
          <GrowthTheaterChart />
          <DecayRateChart />
          <TicketPriceChart />
        </div>
      </section>
    </UContainer>

    <!-- ══════════════════════════════════════ -->
    <!--               FOOTER                  -->
    <!-- ══════════════════════════════════════ -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800">
      <UContainer class="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span>
            資料來源：<a
              href="https://boxofficetw.tfai.org.tw/search/32701"
              target="_blank"
              class="text-amber-600 dark:text-amber-400 hover:underline"
            >國家影視聽中心票房資訊系統</a>
          </span>
          <span class="hidden sm:inline text-neutral-300 dark:text-neutral-700">·</span>
          <span>最後更新：{{ movieInfo.lastUpdated }}</span>
        </div>
        <span>Created by Yudefine 域定資訊工作室</span>
      </UContainer>
    </footer>
  </div>
</template>
