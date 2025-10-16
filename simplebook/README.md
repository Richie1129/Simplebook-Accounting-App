# SimpleBook - 個人記帳本 Web 應用程式

一個現代化、輕量級的個人記帳 Web 應用程式，使用 React、TypeScript 和 IndexedDB 建構。SimpleBook 透過直覺的介面、強大的分析功能以及離線優先的設計，幫助您追蹤收入與支出。

## 功能特色

### 核心功能
- **交易管理** - 新增、編輯和刪除收入/支出交易記錄
- **快速新增** - 快速輸入常用支出項目
- **類別管理** - 使用可自訂的類別來組織交易記錄
- **進階篩選** - 依類型、類別、日期範圍和描述進行搜尋和篩選
- **資料匯出** - 將交易記錄匯出為 CSV 格式，便於備份和分析

### 分析與洞察
- **儀表板總覽** - 即時顯示收入、支出和結餘摘要
- **預算追蹤** - 設定每月預算並提供視覺化警示
- **趨勢分析** - 6 個月收入/支出趨勢視覺化
- **類別分布** - 圓餅圖顯示各類別支出分布
- **月份比較** - 柱狀圖比較最近 6 個月的數據

### 使用體驗
- **深色模式** - 完整的深色模式支援，可自動偵測系統偏好設定
- **離線優先** - 所有資料使用 IndexedDB 儲存在本機
- **響應式設計** - 在桌面和行動裝置上都能流暢運作
- **效能優化** - 程式碼分割和延遲載入，提供快速載入速度
- **範例資料** - 產生示範資料以供測試和探索

## 技術架構

- **前端框架**: React 19.1.1
- **程式語言**: TypeScript 5.9.3
- **建置工具**: Vite 7.1.7
- **狀態管理**: Zustand 5.0.8
- **資料庫**: Dexie.js 4.2.1 (IndexedDB 封裝)
- **圖表**: Recharts 3.2.1
- **樣式**: Tailwind CSS 3.4
- **日期處理**: date-fns 4.1.0
- **測試**: Vitest 3.2.4 + React Testing Library 16.3.0

## 開始使用

### 前置需求
- Node.js 18+ 和 npm

### 安裝步驟

1. 複製專案：
```bash
git clone <repository-url>
cd 個人記帳本WebApp/simplebook
```

2. 安裝相依套件：
```bash
npm install
```

3. 啟動開發伺服器：
```bash
npm run dev
```

4. 開啟瀏覽器並前往 `http://localhost:5173`

## 可用指令

- `npm run dev` - 啟動開發伺服器（支援熱模組替換）
- `npm run build` - 建置正式版本（TypeScript 編譯 + Vite 建置）
- `npm run preview` - 在本機預覽正式版建置
- `npm run lint` - 執行 ESLint 檢查程式碼品質
- `npm run format` - 使用 Prettier 格式化程式碼
- `npm run type-check` - 執行 TypeScript 型別檢查（不產生檔案）
- `npm test` - 以監看模式執行測試
- `npm run test:ui` - 使用互動式 UI 執行測試
- `npm run test:coverage` - 產生測試覆蓋率報告

## 專案結構

```
simplebook/
├── src/
│   ├── components/          # React 元件
│   │   ├── Categories/      # 類別管理元件
│   │   ├── common/          # 可重複使用的 UI 元件（Button、Modal、Toast 等）
│   │   ├── Dashboard/       # 儀表板和分析元件
│   │   ├── Layout/          # 應用程式版面配置和導覽
│   │   ├── Settings/        # 設定元件（主題、預算）
│   │   ├── TransactionForm/ # 交易表單和快速新增
│   │   └── TransactionList/ # 交易清單和篩選
│   ├── db/                  # 資料庫架構和初始化
│   ├── hooks/               # 自訂 React hooks
│   ├── services/            # 商業邏輯和資料服務
│   ├── store/               # Zustand 狀態管理
│   ├── styles/              # 全域 CSS 和 Tailwind 設定
│   ├── types/               # TypeScript 型別定義
│   ├── utils/               # 工具函式
│   ├── App.tsx              # 主應用程式元件
│   └── main.tsx             # 應用程式進入點
├── public/                  # 靜態資源
└── tests/                   # 測試檔案
```

## 主要功能說明

### 離線優先架構
所有資料都儲存在本機的 IndexedDB 中，確保應用程式在沒有網路連線的情況下也能運作。不需要伺服器或後端 - 您的財務資料完全保存在您的裝置上。

### 效能優化
- **程式碼分割**：元件採用延遲載入以減少初始套件大小
- **動態匯入**：重量級服務（匯出、範例資料）僅在需要時載入
- **高效渲染**：使用 React 的 Suspense 和延遲載入進行優化

### 深色模式
應用程式支援淺色和深色主題：
- 首次造訪時自動偵測系統偏好設定
- 在設定中提供手動切換選項
- 偏好設定儲存在 localStorage
- 流暢的主題轉換效果

### 預算管理
設定每月預算並接收視覺化警示：
- 達到預算的 80% 時顯示警告（黃色）
- 達到預算的 100% 時顯示危險（紅色）
- 在儀表板上即時追蹤預算

### 資料匯出
將您的交易記錄匯出為 CSV 格式，用於：
- 備份和歸檔
- 匯入試算表應用程式
- 外部分析和報表

## 瀏覽器支援

SimpleBook 可在所有支援以下功能的現代瀏覽器中運作：
- ES2020+ JavaScript 功能
- IndexedDB API
- CSS Grid 和 Flexbox

建議使用的瀏覽器：
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 資料隱私

您所有的財務資料都儲存在瀏覽器的 IndexedDB 本機資料庫中。不會將任何資料傳送到伺服器或第三方。若要備份資料，請使用 CSV 匯出功能。

## 開發指南

### 程式碼風格
- 遵循 TypeScript 5.3+ 慣例
- 使用函式元件搭配 hooks
- 元件優先使用具名匯出
- 保持元件小巧且專注單一功能
- 使用 Zustand 進行全域狀態管理

### 測試
- 為服務和工具函式撰寫單元測試
- 使用 React Testing Library 進行元件測試
- 維持測試覆蓋率在 80% 以上

### 程式碼格式化
在提交之前執行 `npm run format` 以確保程式碼風格一致。

## 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 此專案
2. 建立功能分支（`git checkout -b feature/amazing-feature`）
3. 提交您的變更（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 開啟 Pull Request

## 授權條款

本專案為開源專案，採用 MIT 授權條款。

## 致謝

使用現代化網頁技術和最佳實踐建構，提供快速、可靠且注重隱私的個人記帳解決方案。
