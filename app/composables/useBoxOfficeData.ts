import type { WeeklyBoxOffice, MovieRanking, DailySnapshot } from "~/types";

export function useBoxOfficeData() {
  const { data: movieInfoRaw } = useAsyncData("movie-info", () =>
    queryCollection("movieInfo").first(),
  );

  const { data: weeklyDataRaw } = useAsyncData("weekly-data", () =>
    queryCollection("weeklyData").first(),
  );

  const { data: latestDailyRaw } = useAsyncData("latest-daily", () =>
    queryCollection("latestDaily").first(),
  );

  const { data: targetsRaw } = useAsyncData("targets", () =>
    queryCollection("targets").first(),
  );

  const { data: taiwanRankingsRaw } = useAsyncData("rankings-taiwan", () =>
    queryCollection("rankingsTaiwan").first(),
  );

  const { data: overallRankingsRaw } = useAsyncData("rankings-overall", () =>
    queryCollection("rankingsOverall").first(),
  );

  const movieInfo = computed(() => movieInfoRaw.value ?? {
    title: "",
    englishTitle: "",
    releaseDate: "",
    rating: "",
    runtime: "",
    distributor: "",
    lastUpdated: "",
    dataQuality: { lastUpdated: "", dataSource: "", totalWeeks: 0, missingData: [], anomalies: [] },
  });

  const weeklyData = computed<WeeklyBoxOffice[]>(() => weeklyDataRaw.value?.weeks ?? []);

  const latestDaily = computed<DailySnapshot | null>(() => {
    const d = latestDailyRaw.value;
    return d?.date ? (d as unknown as DailySnapshot) : null;
  });

  const targetRevenue = computed(() => targetsRaw.value?.revenue ?? 534_351_817);
  const targetTickets = computed(() => targetsRaw.value?.tickets ?? 2_330_000);

  const taiwanMovieRankings = computed<MovieRanking[]>(
    () => (taiwanRankingsRaw.value?.rankings ?? []) as MovieRanking[],
  );

  const overallMovieRankings = computed<MovieRanking[]>(
    () => (overallRankingsRaw.value?.rankings ?? []) as MovieRanking[],
  );

  return {
    movieInfo,
    weeklyData,
    latestDaily,
    targetRevenue,
    targetTickets,
    taiwanMovieRankings,
    overallMovieRankings,
  };
}
