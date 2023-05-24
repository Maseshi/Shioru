<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <h1>
    <strong>Shioru</strong>
  </h1>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru">
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru">
  <a title="Status" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[EN](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

您的好服務器助手將幫助您的服務器看起來更生動。 她可以做很多事情，您可以通過鍵入 `/help` 您可以從[here](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## คุณสมบัติเด่น

- 適用於 [Discord.js](https://discord.js.org/) v14。
- 能夠定制各種想要的物品
- 可以從 [YouTube](https://www.youtube.com/)、 [Spotify](https://www.spotify.com/) 和 [SoundCloud](https://soundcloud.com/) 自動播放音樂。
- 支持多種語言您可以從該存儲庫的[語言](https://github.com/Maseshi/shioru/blob/main/source/languages)文件中檢查支持的語言。
- 等級制度（水平和經驗）
- 支持服務器通知自定義
- 您可以通過鍵入 `@Shioru` 以及您想要交流的消息來進行交談。
- 可以使用應用程序命令 (/)。

和許多其他有趣的功能......

## 改進翻譯

您可以幫助我們翻譯一種現有語言或一種當前在 [Crowdin](https://crowdin.com/project/shioru-bot)不可用的語言。

## ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v18.0.0 或更高版本
- [Firebase](https://firebase.google.com/) v9.0.0 或更高版本
- [Git](https://git-scm.com/downloads)

## 快速設置指南

### 開始吧

- 轉到 [Discord 開發人員門戶](https://discord.com/developers/applications)
- 單擊 **“新應用程序”** 並命名您的機器人並接受 Discord 策略規則。
- 轉到第 **頁“Bot”** 並啟用第 **節“特權網關意圖** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- 通過轉到頁面 **OAuth2 > URL Generator** 選擇 `bot` 和 `applications.commands` 選擇 `Administrator` 將您的機器人邀請到服務器，然後復制鏈接並將其粘貼到瀏覽器的地址中。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### ตั้งค่าบอท

- 啟動終端並運行以下命令。

```bash
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- 可以修改 **config** at `./source/config.js`中的一些數據

### Firebase 將為您提供有關配置的信息。

- 轉到 https://firebase.google.com/ 並開始設置項目。
- เพิ่มโครงการใหม่และทำตามขั้นตอนต่างๆ
- 添加您的第一個應用程序 **網站** 可選地命名您的應用程序 **“同時為此應用程序設置 Firebase 託管”** 並註冊該應用程序。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- 轉到 **create > [realtime database](https://console.firebase.google.com/u/0/project/_/database/data)** 創建存儲數據庫。

### 發展

- 將文件 `.env.example` 重命名為 `.env` 並插入所有必要的值。
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## 快速故障排除

- 如果您無法安裝 package **sodium** ，請安裝 **libsodium-wrappers**。
```bat
npm 卸載鈉
npm 安裝 libsodium-wrappers@latest --save
```
- 如果您無法播放音樂或音樂播放命令不起作用，請安裝 [ffmpeg](https://ffmpeg.org/download.html) **(推薦)** 或安裝 **ffmpeg-static** 包並重試。
```bat
npm install ffmpeg-static@latest --save
```

## 信用

感謝所有原創者允許使用您的這些精彩作品。

頭像繪製者： [夏月まりな（NATSUKI MARINA）](https://www.pixiv.net/en/users/482462)/[お著替え中](https://www.pixiv.net/en/artworks/76075098)

## 發現問題

如果您遇到任何問題從你現在的工作您可以通過此存儲庫的 [issue](https://github.com/Maseshi/Shioru/issues) 選項卡讓我們知道。
