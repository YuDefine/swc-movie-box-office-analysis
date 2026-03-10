// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: ["@nuxtjs/seo", "@nuxt/ui", "nuxt-charts", "@nuxt/content", "nuxt-studio"],

  site: {
    url: "https://swc.yudefine.com.tw",
    name: "陽光女子合唱團票房分析",
    description:
      "追蹤台灣電影《陽光女子合唱團》票房數據，查看每週票房趨勢、累計票房、國產電影排行榜等即時分析資訊。",
    defaultLocale: "zh-TW",
  },

  robots: {
    blockAiBots: true,
  },

  sitemap: {
    zeroRuntime: true,
  },

  ogImage: {
    enabled: false,
  },

  css: ["~/assets/css/main.css"],

  fonts: {
    providers: {
      fontshare: false,
    },
    families: [
      {
        name: "Huninn",
        provider: "google",
      },
    ],
  },

  studio: {
    enabled: true,
    repository: {
      provider: "github",
      owner: "YuDefine",
      repo: "swc-movie-box-office-analysis",
      branch: "main",
    },
  },

  nitro: {
    preset: "cloudflare-pages",
  },
});
