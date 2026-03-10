# ☀️ 陽光女子合唱團 票房分析儀表板

> 追蹤台灣電影《陽光女子合唱團》票房表現的即時數據視覺化分析平台

🔗 **網站：[swc.yudefine.com.tw](https://swc.yudefine.com.tw)**

## 功能特色

- 📊 **週票房趨勢追蹤** — 每週更新票房數據與戲院數變化
- 🏆 **國產電影票房排行** — 與歷年國產電影票房即時對比
- 📈 **累計票房曲線** — 票房與觀影人次雙軸分析
- 🎯 **奪冠進度追蹤** — 超越《海角七號》的里程碑進度
- 📉 **進階分析圖表** — 衰退率、票價趨勢、週變化率等多維度分析
- 🌙 **深色模式** — 自動跟隨系統偏好

## 截圖預覽

<table>
  <tr>
    <th>亮色模式</th>
    <th>深色模式</th>
  </tr>
  <tr>
    <td><img src="public/screenshots/light.png" alt="亮色模式" width="400" /></td>
    <td><img src="public/screenshots/dark.png" alt="深色模式" width="400" /></td>
  </tr>
</table>

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/) |
| UI | [@nuxt/ui v4](https://ui.nuxt.com/) |
| 圖表 | [nuxt-charts](https://nuxtcharts.com/) |
| 內容管理 | [@nuxt/content v3](https://content.nuxt.com/) + [Nuxt Studio](https://nuxt.studio/) |
| SEO | [@nuxtjs/seo](https://nuxtseo.com/) |
| 字體 | [Huninn 粉圓體](https://fonts.google.com/specimen/Huninn) (Google Fonts) |
| Linter | [oxlint](https://oxc.rs/) |
| 部署 | [Cloudflare Pages](https://pages.cloudflare.com/) |

## 專案架構

```
content/                         # Nuxt Content YAML 數據檔案
├── movie-info.yaml              # 電影基本資訊
├── weekly-data.yaml             # 週票房數據（最常更新）
├── latest-daily.yaml            # 單日票房快報
├── targets.yaml                 # 目標票房（海角七號）
├── rankings-taiwan.yaml         # 台灣國產電影排行
└── rankings-overall.yaml        # 台灣整體電影排行
content.config.ts                # Content Collection schema 定義
app/
├── pages/index.vue              # 主頁面（儀表板）
├── components/                  # 12 個 Vue 組件（圖表、排行、進度等）
├── composables/
│   ├── useBoxOfficeData.ts      # 統一資料載入 composable
│   └── useChartTicks.ts         # 圖表刻度響應式計算
├── utils/box-office.ts          # 純函數工具（票價、衰退率等）
├── types/index.ts               # TypeScript 類型定義
└── assets/css/main.css          # Tailwind + 自訂樣式
```

## 開發

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器 (localhost:3000)
pnpm dev

# 建置生產版本
pnpm build

# 預覽生產版本
pnpm preview

# 靜態生成
pnpm generate

# Lint 檢查
pnpm lint
```

## 資料更新

票房數據位於 `content/` 目錄下的 YAML 檔案，可透過以下方式更新：

- **Nuxt Studio**：前往 `https://swc.yudefine.com.tw/_studio` 使用視覺化編輯器直接修改
- **手動編輯**：修改 `content/weekly-data.yaml`（每週票房）或 `content/latest-daily.yaml`（單日快報）

資料來源：[國家影視聽中心票房資訊系統](https://boxofficetw.tfai.org.tw/search/32701)

## 授權

MIT License

---

由 [Yudefine 域定資訊工作室](https://yudefine.com) 製作
