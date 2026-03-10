import { useBreakpoints } from "@vueuse/core";
import type { MaybeRef } from "vue";

/**
 * 根據螢幕寬度計算合適的圖表 x 軸刻度
 * 確保在手機上不會重疊，同時保證頭尾日期顯示
 */
export function useChartTicks(dataLength: MaybeRef<number>) {
  const breakpoints = useBreakpoints({
    sm: 640,
    md: 768,
    lg: 1024,
  });

  const isMobile = breakpoints.smaller("sm");
  const isTablet = breakpoints.between("sm", "md");

  // 根據螢幕尺寸決定最大刻度數（包含頭尾）
  const maxTicks = computed(() => {
    const len = toValue(dataLength);
    if (isMobile.value) {
      return Math.min(3, len);
    } else if (isTablet.value) {
      return Math.min(5, len);
    } else {
      return Math.min(9, len);
    }
  });

  // 計算明確的刻度索引，確保頭尾一定包含
  const xExplicitTicks = computed(() => {
    const len = toValue(dataLength);
    const tickCount = maxTicks.value;
    if (len <= 1) return [0];
    if (tickCount >= len) {
      return Array.from({ length: len }, (_, i) => i);
    }

    const ticks: number[] = [0];
    const innerCount = tickCount - 2;

    if (innerCount > 0) {
      const step = (len - 1) / (tickCount - 1);
      for (let i = 1; i <= innerCount; i++) {
        ticks.push(Math.round(step * i));
      }
    }

    ticks.push(len - 1);

    // 去重並排序
    return [...new Set(ticks)].sort((a, b) => a - b);
  });

  // 計算實際的刻度數量
  const xNumTicks = computed(() => xExplicitTicks.value.length);

  return {
    xNumTicks,
    xExplicitTicks,
    isMobile,
    isTablet,
  };
}
