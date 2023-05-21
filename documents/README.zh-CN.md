<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <h1>
    <strong>汐留</strong>
  </h1>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru">
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru">
  <a title="地位" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="人群" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="代码因子" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="代码因子" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[中文](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

您的好服务器助手将帮助您的服务器看起来更生动。她可以做很多事情，您可以通过键入 `/help` 您可以从[here](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## 特征

- 适用于 [Discord.js](https://discord.js.org/) v14。
- 能够定制各种想要的物品
- 可以从 [YouTube](https://www.youtube.com/)、 [Spotify](https://www.spotify.com/) 和 [SoundCloud](https://soundcloud.com/) 自动播放音乐。
- 支持多种语言可以在本仓库的[语言文件](https://github.com/Maseshi/shioru/blob/main/source/languages)中查看支持的语言。
- 等级制度（水平和经验）
- 支持服务器通知自定义
- 您可以通过键入 `@Shioru` 以及您想要交流的消息来进行交谈。
- 可以使用应用程序命令 (/)。

和许多其他有趣的功能......

## 改进翻译

您可以帮助我们翻译一种现有语言或一种当前在 [Crowdin](https://crowdin.com/project/shioru-bot)不可用的语言。

## 先决条件

- [Node.js](https://nodejs.org/) v18.0.0 或更高版本
- [Firebase](https://firebase.google.com/) v9.0.0 或更高版本
- [混帐](https://git-scm.com/downloads)

## 快速设置指南

### 开始吧

- 转到 [Discord 开发人员门户](https://discord.com/developers/applications)
- 单击 **“新应用程序”** 并为您的机器人命名并接受 Discord 策略规则。
- 转到第 **页“Bot”** 并启用 **节“特权网关意图** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- 通过转到页面 **OAuth2 > URL Generator** 选择 `bot` 和 `applications.commands` 选择 `Administrator` 将您的机器人邀请到服务器，然后复制链接并将其粘贴到浏览器的地址中。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### 设置一个机器人

- 启动终端并运行以下命令。

```bash
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- 可以修改 **config** at `./source/config.js`中的一些数据

### 设置火力地堡

- 转到 https://firebase.google.com/ 并开始设置项目。
- 添加一个新项目并按照步骤操作。
- 添加您的第一个应用程序 **网站** 可选地命名您的应用程序 **“同时为此应用程序设置 Firebase 托管”** 并注册该应用程序。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase 将为您提供有关配置的信息。将这些值应用到文件 ``
- 转到 **create > [realtime database](https://console.firebase.google.com/u/0/project/_/database/data)** 创建存储数据库。

### 发展

- 将文件 `.env.example` 重命名为 `.env` 并插入所有必要的值。
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## 快速故障排除

- 如果您无法安装 package **sodium** ，请安装 **libsodium-wrappers**。
```bat
npm 卸载钠
npm 安装 libsodium-wrappers@latest --save
```
- 如果您无法播放音乐或音乐播放命令不起作用，请安装 [ffmpeg](https://ffmpeg.org/download.html) **(推荐)** 或安装 **ffmpeg-static** 包并重试。
```bat
npm 安装 ffmpeg-static@latest --save
```

## 信用

感谢所有原创者允许使用您的这些精彩作品。

头像绘制者： [夏月まりな（NATSUKI MARINA）](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## 发现问题

如果您遇到任何问题从你现在的工作您可以通过此存储库的 [issue](https://github.com/Maseshi/Shioru/issues) 选项卡让我们知道。
