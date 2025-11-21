# GitHub Pages 部署指南

## 完成的設定

已為您的專案完成以下設定：

### 1. 套件安裝
- ✅ 已安裝 `gh-pages` 套件

### 2. package.json 設定
- ✅ 新增 `homepage` 欄位：`https://chenjianying0211.github.io/modern-accounting`
- ✅ 新增部署腳本：`predeploy` 和 `deploy`

### 3. GitHub Actions 工作流程
- ✅ 建立 `.github/workflows/deploy.yml`
- ✅ 自動建置和部署設定

### 4. 客戶端路由支援
- ✅ 建立 `public/404.html` 處理路由重新導向
- ✅ 修改 `public/index.html` 新增路由處理腳本

### 5. 程式碼品質修復
- ✅ 修復所有 ESLint 錯誤和警告
- ✅ 移除未使用的變數和導入
- ✅ 修復 React Hook 依賴項問題
- ✅ 修復 Unicode BOM 問題

## 部署步驟

### 方法一：GitHub Actions 自動部署（推薦）

1. **將程式碼推送到 GitHub：**
   ```bash
   git add .
   git commit -m "設定 GitHub Pages 部署"
   git push origin main
   ```

2. **在 GitHub 上啟用 Pages：**
   - 前往您的 GitHub 儲存庫
   - 點擊 Settings 標籤
   - 滾動到 Pages 區段
   - 在 Source 下拉選單中選擇 "GitHub Actions"
   - GitHub Actions 會自動觸發建置和部署

3. **等待部署完成：**
   - 查看 Actions 標籤確認部署狀態
   - 部署完成後，網站將可在 `https://chenjianying0211.github.io/modern-accounting` 存取

### 方法二：手動部署

如果您想要手動部署，可以使用以下指令：

```bash
npm run deploy
```

## 重要提醒

1. **確保儲存庫名稱正確：**
   - 如果您的儲存庫名稱不是 `modern-accounting`，請更新 `package.json` 中的 `homepage` 欄位

2. **檢查分支名稱：**
   - GitHub Actions 工作流程設定為監聽 `main` 分支
   - 如果您使用 `master` 或其他分支，請修改 `.github/workflows/deploy.yml`

3. **首次部署時間：**
   - 第一次部署可能需要幾分鐘時間
   - 後續更新通常會更快

## 故障排除

如果遇到問題：

1. **檢查 GitHub Actions 日誌：**
   - 前往 GitHub 儲存庫的 Actions 標籤
   - 查看失敗的工作流程詳細信息

2. **確認 Pages 設定：**
   - 在儲存庫 Settings > Pages 確認來源設定為 "GitHub Actions"

3. **檢查路徑問題：**
   - 如果頁面無法載入，可能是路徑設定問題
   - 檢查瀏覽器開發者工具的控制台錯誤

## 網站網址

部署完成後，您的網站將在以下網址可用：
https://chenjianying0211.github.io/modern-accounting

---

**注意：** 您的應用目前使用模擬的認證系統。在正式環境中，您需要整合真實的後端 API。