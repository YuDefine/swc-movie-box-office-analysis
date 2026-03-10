# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

台灣電影《陽光女子合唱團》票房分析儀表板，使用 Nuxt 4 + Vue 3 + TypeScript 構建，部署於 Cloudflare Pages。整合 Nuxt Studio 提供視覺化內容編輯。

## 常用指令

```bash
# 安裝依賴
pnpm install

# 開發伺服器 (localhost:3000)
pnpm dev

# 生產構建
pnpm build

# 預覽生產版本
pnpm preview

# 靜態生成
pnpm generate
```

## 技術棧

- **框架:** Nuxt 4.3 + Vue 3.5
- **UI:** @nuxt/ui 4.4 (主題色: amber)
- **圖表:** nuxt-charts 2.1
- **內容管理:** @nuxt/content 3 + nuxt-studio
- **字體:** Huninn (粉圓體，Google Fonts)
- **部署:** Cloudflare Pages (nitro preset)
- **Linter:** oxlint

## 專案架構

```
content/                         # Nuxt Content YAML 資料（可透過 Nuxt Studio 編輯）
├── movie-info.yaml              # 電影基本資訊
├── weekly-data.yaml             # 週票房數據陣列
├── latest-daily.yaml            # 即時單日票房快報
├── targets.yaml                 # 目標數據（海角七號）
├── rankings-taiwan.yaml         # 台灣國產電影排行
└── rankings-overall.yaml        # 台灣所有電影排行（含外片）
content.config.ts                # Nuxt Content 集合定義與 schema
app/
├── pages/index.vue              # 主頁面（儀表板）
├── components/                  # 14 個 Vue 組件
├── composables/
│   ├── useBoxOfficeData.ts      # 從 Content 載入票房數據的 composable
│   └── useChartTicks.ts         # 圖表 x 軸刻度計算
├── utils/box-office.ts          # 純函數工具（格式化、計算）
├── types/index.ts               # TypeScript 類型定義
└── assets/css/main.css          # Tailwind + 自訂樣式
```

## 資料架構

票房數據存放在 `content/` 目錄的 YAML 檔案中，透過 `@nuxt/content` 集合管理：

- **movie-info.yaml** - 電影基本資訊（標題、上映日期等）
- **weekly-data.yaml** - 每週票房數據（最常更新）
- **latest-daily.yaml** - 單日票房快報（每日更新）
- **targets.yaml** - 對標目標（海角七號票房/人次）
- **rankings-*.yaml** - 排行榜數據

工具函數在 `app/utils/box-office.ts`，皆為純函數（接受資料作為參數），由 Nuxt 自動匯入。

組件透過 `useBoxOfficeData()` composable 取得資料，所有資料皆為響應式 (computed/ref)。

## 開發注意事項

- 使用 `~` 別名指向 `app/` 目錄
- 支援深色模式（自動切換）
- 所有 UI 文字使用繁體中文
- 數據更新時修改 `content/` 目錄中對應的 YAML 檔案
- Nuxt Studio 設定在 `nuxt.config.ts` 的 `studio` 區塊
