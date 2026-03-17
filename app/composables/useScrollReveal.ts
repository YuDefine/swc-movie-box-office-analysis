/**
 * 滾動揭示 composable — IntersectionObserver 觸發一次性動畫
 * SSR 安全：伺服器端元素完全可見，hydration 後才套用隱藏狀態
 */
export function useScrollReveal() {
  const target = ref<HTMLElement | null>(null);
  const isRevealed = ref(false);
  const isHydrated = ref(false);

  onMounted(() => {
    isHydrated.value = true;

    if (!target.value) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isRevealed.value = true;
            observer.disconnect();
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-50px",
      },
    );

    observer.observe(target.value);

    onUnmounted(() => observer.disconnect());
  });

  return { target, isRevealed, isHydrated };
}
