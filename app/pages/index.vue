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
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-neutral-100 via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950"
  >
    <!-- Top Right Actions -->
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

    <UContainer class="py-10 lg:py-12">
      <!-- Hero Header -->
      <header class="mb-10 text-center relative pt-2 lg:pt-0">
        <div
          class="absolute inset-0 -z-10 mx-auto w-full max-w-2xl h-32 bg-amber-500/10 dark:bg-amber-500/5 blur-3xl rounded-full"
        />
        <h1 class="text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
          <span class="mr-2">☀️</span>
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 dark:from-amber-400 dark:via-amber-300 dark:to-orange-400"
            >{{ movieInfo.title }}</span
          >
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400 text-lg mb-6">台灣票房數據分析儀表板</p>
        <UButton
          to="https://today.line.me/tw/v3/movie/1Dnwjm3/1"
          target="_blank"
          size="lg"
          icon="i-heroicons-ticket"
          class="font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
        >
          立即購票
        </UButton>
      </header>

      <HeroStats class="mb-12" />

      <!-- 奪冠進度 -->
      <section class="mb-14">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="h-9 w-1.5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full shadow-sm"
          />
          <h2 class="text-xl font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">
            奪冠進度
          </h2>
        </div>
        <div class="space-y-6">
          <RevenueAchievement />
          <TicketsChallenge />
        </div>
        <p class="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          *票房與觀影人次皆已超越《海角七號》，雙料奪冠！
        </p>
      </section>

      <!-- 排行榜 -->
      <section class="mb-14">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="h-9 w-1.5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full shadow-sm"
          />
          <h2 class="text-2xl font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">
            票房排行
          </h2>
        </div>
        <RankingTable />
      </section>

      <!-- 基礎圖表 -->
      <section class="mb-14">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="h-9 w-1.5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full shadow-sm"
          />
          <h2 class="text-xl font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">
            票房趨勢
          </h2>
        </div>
        <div class="grid gap-6 lg:grid-cols-2">
          <WeeklyChart />
          <CumulativeChart />
        </div>
      </section>

      <!-- 複合式分析圖表 -->
      <section class="mb-14">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="h-9 w-1.5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full shadow-sm"
          />
          <h2 class="text-xl font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">
            進階分析
          </h2>
        </div>

        <div class="grid gap-6 lg:grid-cols-2 mb-6">
          <TicketRevenueChart />
          <CumulativeTicketsChart />
        </div>

        <div class="grid gap-6 lg:grid-cols-2 mb-6">
          <WeeklyChangeRateChart />
          <GrowthTheaterChart />
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <TicketPriceChart />
          <DecayRateChart />
        </div>
      </section>

      <footer
        class="pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500 dark:text-neutral-400"
      >
        <p>
          資料來源：<a
            href="https://boxofficetw.tfai.org.tw/search/32701"
            target="_blank"
            class="text-amber-600 dark:text-amber-400 hover:underline transition-colors"
            >國家影視聽中心票房資訊系統</a
          >
        </p>
        <p class="mt-2">最後更新：{{ movieInfo.lastUpdated }}</p>
        <p class="mt-2">Created by Yudefine 域定資訊工作室</p>
      </footer>
    </UContainer>
  </div>
</template>
