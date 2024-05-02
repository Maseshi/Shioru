<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <strong>
    <h1>Shioru</h2>
    <p>ผู้ช่วยภายในเซิร์ฟเวอร์ Discord จะช่วยทำให้เซิร์ฟเวอร์ของคุณน่าอยู่ขึ้น</p>
  </strong>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru" />
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru" />
  <a title="Status" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[เปลี่ยนภาษา](https://github.com/Maseshi/Shioru/tree/main/documents)

您的好服务器助手将帮助您的服务器看起来更生动。 她可以做很多事情，您可以通过键入 `/help` 您可以从[here](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

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

## 先决条件

- [Node.js](https://nodejs.org/) v18.0.0 或更高版本
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## 快速设置指南

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- 转到 [Discord 开发人员门户](https://discord.com/developers/applications)
- 单击 **“新应用程序”** 并为您的机器人命名并接受 Discord 策略规则。
- 转到第 **页“Bot”** 并启用 **节“特权网关意图** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- 通过转到页面 **OAuth2 > URL Generator** 选择 `bot` 和 `applications.commands` 选择 `Administrator` 将您的机器人邀请到服务器，然后复制链接并将其粘贴到浏览器的地址中。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### 设置一个机器人

เนื่องจากเราใช้ [sodium](https://www.npmjs.com/package/sodium) ในการเข้ารหัสและถอดรหัส เราจึงจำเป็นต้องติดตั้งส่วนประกอบเพิ่มเติมต่อไปนี้:

```bat
@REM บน Windows
npm install -g windows-build-tools
```

```sh
# บน MacOS (Darwin)
brew install libtool autoconf automake
```

```sh
# บน Linux
sudo apt-get install libtool-bin
```

- 启动终端并运行以下命令。

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- 可以修改 **config** at `./source/config.js`中的一些数据

### 设置火力地堡

- 转到 https://firebase.google.com/ 并开始设置项目。
- 添加一个新项目并按照步骤操作。
- 添加您的第一个应用程序 **网站** 可选地命名您的应用程序 **“同时为此应用程序设置 Firebase 托管”** 并注册该应用程序。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase 将为您提供有关配置的信息。 将这些值应用到文件 ``
- 转到 **create > [realtime database](https://console.firebase.google.com/u/0/project/_/database/data)** 创建存储数据库。

### 发展

- 将文件 `.env.example` 重命名为 `.env` 并插入所有必要的值。
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## 快速故障排除

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- 如果您无法安装 package **sodium** ，请安装 **libsodium-wrappers**。

```bat
npm 安装 ffmpeg-static@latest --save
```

- 如果您无法播放音乐或音乐播放命令不起作用，请安装 [ffmpeg](https://ffmpeg.org/download.html) **(推荐)** 或安装 **ffmpeg-static** 包并重试。

```bat
npm install ffmpeg-static@latest --save
```

## 改进翻译

您可以帮助我们翻译一种现有语言或一种当前在 [Crowdin](https://crowdin.com/project/shioru-bot)不可用的语言。

## 信用

感谢所有原创者允许使用您的这些精彩作品。

头像绘制者： [夏月まりな（NATSUKI MARINA）](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## 发现问题

如果您遇到任何问题从你现在的工作您可以通过此存储库的 [issue](https://github.com/Maseshi/Shioru/issues) 选项卡让我们知道。
