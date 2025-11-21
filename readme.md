# 現代化會計管理系統

一個基於 React + TypeScript + Material-UI 的現代化會計發票管理系統，具備 OCR 發票辨識、角色權限控制、資料儀表板等完整功能。

## ✨ 主要功能

### 🔐 用戶認證與權限管理
- JWT Token 身份驗證
- 三層角色權限系統（上傳者/會計師/管理員）
- 受保護路由與頁面權限控制
- 登入/註冊/登出功能

### 📊 智能儀表板
- 實時 KPI 數據展示
- 收入支出趨勢圖表
- 發票狀態統計
- 最近活動記錄

### 📄 發票管理系統
- 拖拽式文件上傳
- OCR 自動發票辨識
- 發票清單檢視與篩選
- 發票詳細資訊管理
- 批量操作功能

### 📈 報告分析模組
- 多維度財務報告
- 自訂時間範圍篩選
- 數據匯出（Excel/PDF）
- 圖表視覺化分析

### ⚙️ 系統設定
- 會計科目管理
- 分類設定
- 用戶權限配置

### 🎨 現代化 UI/UX
- Material-UI 設計系統
- 響應式佈局設計
- 深色/淺色主題支援
- 中文在地化介面

## 🚀 快速開始

### 系統需求
- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理器

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd modern-accounting-mui
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm start
   ```

4. **開啟瀏覽器**
   ```
   http://localhost:3000
   ```

## 🔑 測試帳號

系統提供三種不同權限的測試帳號：

### 管理員帳號 (Admin)
- **帳號**: `admin@example.com`
- **密碼**: `admin123`
- **權限**: 完整系統管理權限，可存取所有功能模組

### 會計師帳號 (Accountant)
- **帳號**: `accountant@example.com`
- **密碼**: `acc123`
- **權限**: 發票管理、報告檢視、部分設定功能

### 上傳者帳號 (Uploader)
- **帳號**: `uploader@example.com`
- **密碼**: `upload123`
- **權限**: 發票上傳、基本檢視功能

## 🛠️ 技術架構

### 前端技術棧
- **React 18** - 現代化前端框架
- **TypeScript** - 型別安全的 JavaScript
- **Material-UI (MUI) v5** - Google Material Design 組件庫
- **React Router v6** - 客戶端路由管理
- **Axios** - HTTP 請求處理
- **Day.js** - 日期時間處理
- **MUI X Charts** - 數據視覺化圖表
- **MUI X DataGrid** - 高性能數據表格
- **React Dropzone** - 文件拖拽上傳

### 開發工具
- **Create React App** - 快速專案建置
- **ESLint** - 程式碼品質檢查
- **Prettier** - 程式碼格式化
- **TypeScript Compiler** - 型別檢查

## 📁 專案結構

```
src/
├── components/           # 可重用組件
│   ├── Layout/          # 佈局組件
│   ├── Sidebar/         # 側邊欄導航
│   └── ProtectedRoute/  # 路由保護組件
├── contexts/            # React Context
│   └── AuthContext.tsx  # 認證狀態管理
├── pages/               # 頁面組件
│   ├── Login.tsx        # 登入頁面
│   ├── Register.tsx     # 註冊頁面
│   ├── Dashboard.tsx    # 儀表板
│   ├── Invoices/        # 發票管理頁面
│   ├── Reports.tsx      # 報告頁面
│   └── Settings/        # 設定頁面
├── services/            # API 服務層
├── types/               # TypeScript 型別定義
│   ├── auth.ts          # 認證相關型別
│   └── invoice.ts       # 發票相關型別
├── utils/               # 工具函數
│   ├── auth.ts          # 認證工具
│   └── api.ts           # API 工具
└── App.tsx              # 主應用程式組件
```

## 🔒 權限系統設計

### 角色定義
- **Uploader (上傳者)**: 基礎用戶，可上傳發票、檢視自己的數據
- **Accountant (會計師)**: 中級用戶，可管理所有發票、產生報告
- **Admin (管理員)**: 最高權限，可存取所有功能包含系統設定

### 權限矩陣
| 功能模組 | Uploader | Accountant | Admin |
|---------|----------|------------|-------|
| 儀表板 | ✅ | ✅ | ✅ |
| 發票上傳 | ✅ | ✅ | ✅ |
| 發票管理 | ✅ | ✅ | ✅ |
| 發票詳情 | ✅ | ✅ | ✅ |
| 報告檢視 | ❌ | ✅ | ✅ |
| 系統設定 | ❌ | ❌ | ✅ |

## 🚀 部署說明

### 建置生產版本
```bash
npm run build
```

### 測試建置結果
```bash
npm install -g serve
serve -s build
```

### 環境變數設定
創建 `.env` 文件並設定以下變數：
```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_JWT_SECRET=your_jwt_secret
```

## 🧪 測試

### 運行測試
```bash
npm test
```

### 測試覆蓋率
```bash
npm test -- --coverage
```

## 📋 開發指南

### 代碼風格
- 使用 TypeScript 嚴格模式
- 遵循 ESLint 規則
- 使用 Prettier 自動格式化
- 組件使用 PascalCase 命名
- 文件使用 camelCase 命名

### Git 提交規範
```
feat: 新功能
fix: 錯誤修復
docs: 文檔更新
style: 代碼風格調整
refactor: 代碼重構
test: 測試相關
chore: 建置工具或輔助工具的變動
```

## 🐛 問題回報

如果您發現任何問題或有功能建議，請：

1. 檢查是否已有相同問題的 Issue
2. 創建新的 Issue 並詳細描述問題
3. 提供重現步驟和環境資訊
4. 如果可能，請提供解決方案的建議

## 📄 授權條款

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 文件。

## 🤝 貢獻指南

歡迎貢獻代碼！請遵循以下流程：

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📞 聯絡資訊

- **專案維護者**: [Your Name]
- **Email**: [your.email@example.com]
- **專案首頁**: [Project Homepage]

---

## 🎯 開發路線圖

### v1.1 計劃功能
- [ ] 批量發票處理
- [ ] 更多圖表類型支援
- [ ] 行動端 PWA 支援
- [ ] 暗黑模式切換
- [ ] 多語言支援

### v1.2 計劃功能
- [ ] 即時通知系統
- [ ] 發票審核工作流
- [ ] 與外部會計軟體整合
- [ ] 進階報告客製化

---

*最後更新: 2025年11月10日*