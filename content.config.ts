import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    movieInfo: defineCollection({
      type: "data",
      source: "movie-info.yaml",
      schema: z.object({
        title: z.string(),
        englishTitle: z.string(),
        releaseDate: z.string(),
        rating: z.string(),
        runtime: z.string(),
        distributor: z.string(),
        lastUpdated: z.string(),
        dataQuality: z.object({
          lastUpdated: z.string(),
          dataSource: z.string(),
          totalWeeks: z.number(),
          missingData: z.array(z.string()),
          anomalies: z.array(
            z.object({
              week: z.number(),
              field: z.string(),
              note: z.string(),
            }),
          ),
        }),
      }),
    }),

    weeklyData: defineCollection({
      type: "data",
      source: "weekly-data.yaml",
      schema: z.object({
        weeks: z.array(
          z.object({
            week: z.number(),
            dateRange: z.string(),
            revenue: z.number(),
            tickets: z.number(),
            cumulativeRevenue: z.number(),
            cumulativeTickets: z.number(),
            changeRate: z.number().nullable(),
            theaters: z.number(),
          }),
        ),
      }),
    }),

    latestDaily: defineCollection({
      type: "data",
      source: "latest-daily.yaml",
      schema: z.object({
        date: z.string().optional(),
        dayOfWeek: z.string().optional(),
        dailyRevenue: z.number().optional(),
        cumulativeRevenue: z.number().optional(),
        cumulativeTickets: z.number().optional(),
        updatedAt: z.string().optional(),
        isEstimate: z.boolean().optional(),
        note: z.string().optional(),
      }),
    }),

    targets: defineCollection({
      type: "data",
      source: "targets.yaml",
      schema: z.object({
        revenue: z.number(),
        tickets: z.number(),
      }),
    }),

    rankingsTaiwan: defineCollection({
      type: "data",
      source: "rankings-taiwan.yaml",
      schema: z.object({
        rankings: z.array(
          z.object({
            rank: z.number(),
            title: z.string(),
            revenue: z.number(),
            tickets: z.number().optional(),
            year: z.number(),
            rating: z.string().optional(),
            isActive: z.boolean(),
            includesRerelease: z.boolean().optional(),
          }),
        ),
      }),
    }),

    rankingsOverall: defineCollection({
      type: "data",
      source: "rankings-overall.yaml",
      schema: z.object({
        rankings: z.array(
          z.object({
            rank: z.number(),
            title: z.string(),
            revenue: z.number(),
            tickets: z.number().optional(),
            year: z.number(),
            rating: z.string().optional(),
            isActive: z.boolean(),
            includesRerelease: z.boolean().optional(),
          }),
        ),
      }),
    }),
  },
});
