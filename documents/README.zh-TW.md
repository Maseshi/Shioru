<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/apple-icon.png" width="100" style="border-radius: 100%;" />
  <strong>
    <h1>Shioru</h1>
    <p>เลขาส่วนตัวใน Discord ที่จะช่วยทำให้กิลด์ของคุณน่าอยู่ยิ่งขึ้น</p>
  </strong>
  <img src="https://img.shields.io/badge/discord.js-14-blue?logo=discord&logoColor=white
  " />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru?logo=github
  " />
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json&query=status.indicator&logo=google-cloud&logoColor=white&label=status&link=https%3A%2F%2Fshioru.statuspage.io%2F
  " />
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
  <a href="https://shiorus.web.app/invite">
    <img src="https://img.shields.io/badge/Invite_Bot-_?style=for-the-badge&logo=discord&logoColor=white&color=blue
    " />
  </a>
</div>

## ✨ คุณสมบัติเด่น

- 適用於 [Discord.js](https://discord.js.org/) v14。
- 能夠定制各種想要的物品
- 可以從 [YouTube](https://www.youtube.com/)、 [Spotify](https://www.spotify.com/) 和 [SoundCloud](https://soundcloud.com/) 自動播放音樂。
- 支持多種語言您可以從該存儲庫的[語言](https://github.com/Maseshi/shioru/blob/main/source/languages)文件中檢查支持的語言。
- 等級制度（水平和經驗）
- 支持服務器通知自定義
- 您可以通過鍵入 `@Shioru` 以及您想要交流的消息來進行交談。
- 可以使用應用程序命令 (/)。
- จำลองระบบฐานข้อมูลสำหรับทดสอบ
- รองรับการทำงานบน Shard

和許多其他有趣的功能......

## 🧩 ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v20.6.0 หรือมากกว่า
- [Python](https://www.python.org/downloads/) v3.8.0 หรือมากกว่า
- [Java](https://www.oracle.com/java/technologies/downloads/) v11.0.0 หรือมากกว่า
- [Firebase Tools](https://firebase.google.com/docs/cli)
- [Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## ⌛ การติดตั้ง

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

> [!TIP] คุณสามารถข้ามขั้นตอนนี้โดยการติ๊กตัวเลือก **Automatically install the necessary tools.** ผ่านตัวติดตั้ง Node.js ดังภาพต่อไปนี้
>
> ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

### 2. 2. 2. โคลนบอทและติดตั้งส่วนประกอบ

- 啟動終端並運行以下命令。
  ```bat
  git clone https://github.com/Maseshi/Shioru.git
  cd Shioru
  npm install
  ```
- 將文件 `.env.example` 重命名為 `.env` 並插入所有必要的值。

> [!NOTE] คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ [./source/configs/data.js](../source/configs/data.js)

### 3. 3. 3. ตั้งค่าบอทและเชิญเข้าร่วม

- 轉到 [Discord 開發人員門戶](https://discord.com/developers/applications)
- 單擊 **“新應用程序”** 並命名您的機器人並接受 Discord 策略規則。
- 轉到第 **頁“Bot”** 並啟用第 **節“特權網關意圖** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในแถบที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### 4. 4. 4. ตั้งค่าฐานข้อมูล

- 轉到 https://firebase.google.com/ 並開始設置項目。
- เพิ่มโครงการใหม่และทำตามขั้นตอนต่างๆ
- 添加您的第一個應用程序 **網站** 可選地命名您的應用程序 **“同時為此應用程序設置 Firebase 託管”** 並註冊該應用程序。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env`
- 轉到 **create > [realtime database](https://console.firebase.google.com/u/0/project/_/database/data)** 創建存儲數據庫。

## 🪛 การพัฒนา

- เปิดเทอร์มินัลแล้วรัน `npm run emulators` เพื่อจำลองระบบฐานข้อมูลใน**โหมดพัฒนา**
- เปิดเทอร์มินัลหน้าใหม่แล้วรันคำสั่ง `npm run dev`

> [!NOTE] เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## ☕ จำลอง

ทดสอบการใช้งานจริงด้วยการทำงานที่คล้ายกับการใช้งานจริง โดยระบบจะคำนวณการแยกเศษของการทำงานตามจำนวนของกิลด์โดยอัตโนมัติ

- เปิดเทอร์มินัลแล้วรัน `npm run emulators` เพื่อจำลองระบบฐานข้อมูลใน**โหมดจำลอง**
- เปิดเทอร์มินัลหน้าใหม่แล้วรันคำสั่ง `npm run serve`

> [!NOTE] คุณจะเข้าสู่โหมดการพัฒนาโดยอัตโนมัติเนื่องจากเป็นการจำลองการใช้งานจริง ทำให้คุณสมบัติบางอย่างอาจไม่ทำงาน

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
- จากนั้นเปิดโปรแกรม Docker แล้วสั่งรันพร้อมกับใส่ข้อมูลสภาพแวดล้อมที่จำเป็น (env) หรือใช้คำสั่ง `npm run docker:run` แล้วรอจนบอททำงาน

> [!TIP] คุณสามารถตรวจสอบการทำงานได้โดยใช้คำสั่ง `docker ps -a`

## ⚡ แก้ไขปัญหาอย่างรวดเร็ว

- `gyp ERR! gyp ERR! gyp ERR! stack Error: not found: make`

  ปัญหานี้อาจเกิดจาก **Build Tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขปัญหานี้ให้ดูที่ส่วน[การติดตั้ง Build Tools](#1-ติดตั้ง-build-tools)

- `GrpcConnection RPC 'Write' stream 0x58a118ce error. Code: 14 Message: 14 UNAVAILABLE: No connection established. Last error: connect ECONNREFUSED 127.0.0.1:8080`

  เป็นไปได้ว่าคุณยังไม่ได้จำลองระบบฐานข้อมูลบนเครื่องในโหมดทดสอบ โดยคุณสามารถแก้ปัญหานี้ได้โดยปิดบอทแล้วรันคำสั่งดังนี้ในอีกหน้าหนึ่ง

  ```bat
  npm run emulators
  ```

## 🌐 ปรับปรุงการแปลภาษา

您可以幫助我們翻譯一種現有語言或一種當前在 [Crowdin](https://crowdin.com/project/shioru-bot)不可用的語言。

## ⚠️ พบปัญหา

หากคุณพบปัญหาใดๆ จากการทำงานปัจจุบันของคุณ คุณสามารถแจ้งให้เราทราบได้ผ่านแท็บ [issues](https://github.com/Maseshi/Shioru/issues) ของพื้นที่เก็บนี้ได้
