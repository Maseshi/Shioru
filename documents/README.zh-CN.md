<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/apple-icon.png" width="100" style="border-radius: 100%;" />
  <strong>
    <h1>Shioru</h2>
    <p>เลขาส่วนตัวใน Discord ที่จะช่วยทำให้กิลด์ของคุณน่าอยู่ยิ่งขึ้น</p>
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

เลขาส่วนตัวที่ดีที่สุดของคุณจะช่วยให้กิลด์ของคุณดูมีชีวิตชีวามากขึ้น เธอสามารถทำสิ่งต่าง ๆ ได้หลายอย่างซึ่งคุณสามารถดูรายละเอียดข้อมูลของคำสั่งทั้งหมด ได้ง่าย ๆ โดยพิมพ์ `/help`

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
- จำลองระบบฐานข้อมูลสำหรับทดสอบ
- รองรับการทำงานบน Shard

和许多其他有趣的功能......

## 先决条件

- [Node.js](https://nodejs.org/) v20.6.0 หรือมากกว่า
- [Python](https://www.python.org/downloads/) v3.8.0 หรือมากกว่า
- [Java](https://www.oracle.com/java/technologies/downloads/) v11.0.0 หรือมากกว่า
- [Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) หรือ[ติดตั้งด้วยตัวเอง](#1-ติดตั้ง-build-tools)
- [Firebase Tools](https://firebase.google.com/docs/cli)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## การติดตั้ง

### 1. 1. 1. ติดตั้ง **Build Tools**

ทำการติดตั้ง **Build tools** โดยรันคำสั่งดังต่อไปนี้ตามระบบปฏิบัติการของคุณ

- สำหรับระบบปฏิบัติการ Linux และ MacOS

```sh
sudo apt update
sudo apt install build-essential
```

- สำหรับระบบปฏิบัติการ Windows

```sh
npm install --global --production --add-python-to-path windows-build-tools
```

> **💡 ทริป**: คุณสามารถข้ามขั้นตอนนี้ผ่านตัวติดตั้ง Node.js ดังภาพต่อไปนี้ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

### 2. 2. 2. โคลนบอทและติดตั้งส่วนประกอบ

- 启动终端并运行以下命令。
  ```bat
  git clone https://github.com/Maseshi/Shioru.git
  cd Shioru
  npm install
  ```
- 将文件 `.env.example` 重命名为 `.env` 并插入所有必要的值。

  > **💡 หมายเหตุ:** คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ [./source/configs/data.js](../source/configs/data.js)

### 3. 3. 3. ตั้งค่าบอทและเชิญเข้าร่วม

- 转到 [Discord 开发人员门户](https://discord.com/developers/applications)
- 单击 **“新应用程序”** 并为您的机器人命名并接受 Discord 策略规则。
- 转到第 **页“Bot”** 并启用 **节“特权网关意图** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในแถบที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### 4. 4. 4. ตั้งค่าฐานข้อมูล

- 转到 https://firebase.google.com/ 并开始设置项目。
- 添加一个新项目并按照步骤操作。
- 添加您的第一个应用程序 **网站** 可选地命名您的应用程序 **“同时为此应用程序设置 Firebase 托管”** 并注册该应用程序。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env`
- 转到 **create > [realtime database](https://console.firebase.google.com/u/0/project/_/database/data)** 创建存储数据库。

## 🪛 การพัฒนา

- เปิดเทอร์มินัลแล้วรัน `npm run emulators` เพื่อจำลองระบบฐานข้อมูลใน**โหมดพัฒนา**
- เปิดเทอร์มินัลหน้าใหม่แล้วรันคำสั่ง `npm run dev` > **💡 หมายเหตุ:** เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## ☕ จำลอง

ทดสอบการใช้งานจริงด้วยการทำงานที่คล้ายกับการใช้งานจริง โดยระบบจะคำนวณการแยกเศษของการทำงานตามจำนวนของกิลด์โดยอัตโนมัติ

- เปิดเทอร์มินัลแล้วรัน `npm run emulators` เพื่อจำลองระบบฐานข้อมูลใน**โหมดจำลอง**
- เปิดเทอร์มินัลหน้าใหม่แล้วรันคำสั่ง `npm run serve` > **💡 หมายเหตุ:** คุณจะเข้าสู่โหมดการพัฒนาโดยอัตโนมัติเนื่องจากเป็นการจำลองการใช้งานจริง ทำให้คุณสมบัติบางอย่างอาจไม่ทำงาน

## 🍵 ใช้งานจริง

สำหรับการใช้งานจริงสามารถใช้คำสั่งหรือชุดคำสั่งที่เตรียมไว้ได้ตามปกติ ดังนี้:

- บน Linux หรือ MacOS

  ```sh
  # with command file (recommend)

  sh start.sh || sudo sh start.sh

  # or with call command

  npm start
  ```

- บน Windows

  ```bat
  @REM with command file (recommend)

  ./start.bat

  @REM or with call command

  npm start
  ```

### 🐳 ทำงานบน Docker

การดำเนินการนี้จำเป็นต้องมี [Docker](https://www.docker.com/products/docker-desktop/)

- ใช้คำสั่ง `npm run docker:build` แล้วรอให้ทำงานเสร็จทั้งหมด
- จากนั้นเปิดโปรแกรม Docker แล้วสั่งรันพร้อมกับใส่ข้อมูลสภาพแวดล้อมที่จำเป็น (env) หรือใช้คำสั่ง `npm run docker:run` แล้วรอจนบอททำงาน > **💡 หมายเหตุ:** คุณสามารถตรวจสอบการทำงานได้โดยใช้คำสั่ง `docker ps -a`

## แก้ไขปัญหาอย่างรวดเร็ว

### `gyp ERR! gyp ERR! gyp ERR! stack Error: not found: make`

ปัญหานี้อาจเกิดจาก **Build Tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขปัญหานี้ให้ดูที่ส่วน[การติดตั้ง Build Tools](#1-ติดตั้ง-build-tools)

### `@firebase/firestore: Firestore (10.6.0): GrpcConnection RPC 'Write' stream 0x58a118ce error. Code: 14 Message: 14 UNAVAILABLE: No connection established. Last error: connect ECONNREFUSED 127.0.0.1:8080 Code: 14 Message: 14 UNAVAILABLE: No connection established. Last error: connect ECONNREFUSED 127.0.0.1:8080 Code: 14 Message: 14 UNAVAILABLE: No connection established. Last error: connect ECONNREFUSED 127.0.0.1:8080`

เป็นไปได้ว่าคุณยังไม่ได้จำลองระบบฐานข้อมูลบนเครื่องในโหมดทดสอบ โดยคุณสามารถแก้ปัญหานี้ได้โดยปิดบอทแล้วรันคำสั่งดังนี้ในอีกหน้าหนึ่ง

```bat
npm run emulators
```

## ปรับปรุงการแปลภาษา

您可以帮助我们翻译一种现有语言或一种当前在 [Crowdin](https://crowdin.com/project/shioru-bot)不可用的语言。

## 发现问题

หากคุณพบปัญหาใดๆ จากการทำงานปัจจุบันของคุณ คุณสามารถแจ้งให้เราทราบได้ผ่านแท็บ [issues](https://github.com/Maseshi/Shioru/issues) ของพื้นที่เก็บนี้ได้
