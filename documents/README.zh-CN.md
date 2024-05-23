<center>
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/apple-icon.png" width="100" style="border-radius: 100%;" alt="Shioru" />
  <strong>
    <h1>Shioru</h1>
    <p>เลขาส่วนตัวใน Discord ที่จะช่วยทำให้กิลด์ของคุณน่าอยู่ยิ่งขึ้น</p>
  </strong>
  <a href="https://shiorus.web.app/invite">เชิญชวน</a>
  |
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">เปลี่ยนภาษา</a>
  |
  <a href="https://shioru.statuspage.io/">สถานะ</a>
  |
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">ปรับปรุงการแปลภาษา</a>
  |
  <a href="https://top.gg/bot/704706906505347183">ให้คะแนน</a>
  <br />
  <img src="https://img.shields.io/badge/discord.js-14-blue?logo=discord&logoColor=white" alt="Discord.js version 14" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru?logo=github" alt="Last commit" />
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json&query=status.indicator&logo=google-cloud&logoColor=white&label=status&link=https%3A%2F%2Fshioru.statuspage.io%2F" alt="Status" />
  <a title="Crowdin" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" alt="Crowdin" />
  </a>
  <a title="CodeFactor" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" alt="Top.gg" />
  </a>
</center>

เลขาส่วนตัวที่ดีที่สุดของคุณจะช่วยให้กิลด์ของคุณดูมีชีวิตชีวามากขึ้น เธอสามารถทำสิ่งต่าง ๆ ได้หลายอย่างซึ่งคุณสามารถดูรายละเอียดข้อมูลของคำสั่งทั้งหมด ได้ง่าย ๆ โดยพิมพ์ `/help`

## ✨ คุณสมบัติเด่น

[ / ] ทำงานบน [Discord.js](https://discord.js.org/) v14 \
[ / ] อ่านง่าย ใช้งานง่ายและประสิทธิภาพสูง \
[ / ] สามารถปรับแต่งสิ่งที่ต้องการได้หลากหลายรายการ \
[ / ] มีคำสั่งทั้งหมดรวมถึงคำสั่งย่อยที่พร้อมใช้งานมากกว่า 100+ คำสั่ง \
[ / ] สามารถเล่นเพลงได้ทั้งจาก [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/), [SoundCloud](https://soundcloud.com/) และอีก [900+ เว็บไซต์](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)พร้อมทั้งมีระบบเล่นเพลงต่อโดยอัตโนมัติ \
[ / ] รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์ภาษา](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json)ของที่เก็บนี้ \
[ / ] ระบบระดับชั้น (เลเวลและค่าประสบการณ์) \
[ / ] รองรับการปรับแต่งการแจ้งเตือนของเซิร์ฟเวอร์ \
[ / ] สามารถพูดคุยได้โดยการพิมพ์ `@Shioru` ตามด้วยข้อความที่ต้องการสื่อสาร \
[ / ] รองรับการทำงานบน Shard หรือรองรับการทำงานในหลากหลายกิลด์ \
[ / ] สามารถใช้งานคำสั่งแอปพลิเคชั่น (/) ได้ \
[ / ] จำลองระบบฐานข้อมูลสำหรับทดสอบ

和许多其他有趣的功能......

## 🧩 ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v20.6.0 หรือสูงกว่า
- [Firebase Tools](https://firebase.google.com/docs/cli) (ต้องการ [Java](https://www.oracle.com/java/technologies/downloads/) v11.0.0 หรือสูงกว่า)
- [Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) (ต้องการ [Python](https://www.python.org/downloads/) v3.8.0 หรือสูงกว่า)
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

- 启动终端并运行以下命令。
  ```bat
  git clone https://github.com/Maseshi/Shioru.git
  cd Shioru
  npm install
  ```
- 将文件 `.env.example` 重命名为 `.env` 并插入所有必要的值。

> [!NOTE] คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ [./source/configs/data.js](../source/configs/data.js)

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

## 🔥 เริ่มต้นใช้งาน

มีหลากหลายทางเลือกให้เปิดใช้งานได้ หากคุณใช้ [Visual Studio Code](https://code.visualstudio.com/) คุณสามารถเลือกวิธีการทำงานได้ทันทีผ่านแท็บ Run and Debug (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>) ส่วนการทำงานอื่น ๆ ให้ดูที่ Tasks (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> และ <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> พิมพ์ `>Tasks: Run Task`)

### 🪛 พัฒนา

- เปิดเทอร์มินัลแล้วรันคำสั่ง `npm run dev`

### ☕ จำลอง

ทดสอบการใช้งานจริงด้วยการทำงานที่คล้ายกับการใช้งานจริง โดยระบบจะคำนวณการแยกเศษของการทำงานตามจำนวนของกิลด์โดยอัตโนมัติ

- เปิดเทอร์มินัลแล้วเพิ่มตัวแปรสภาพแวดล้อมทั้งหมดที่จำเป็น
  - สำหรับ Windows ใช้คำสั่ง `set variable=example`
  - สำหรับ Linux หรือ MacOS ใช้คำสั่ง `export variable=example`
- รันคำสั่ง `npm run serve`

> [!NOTE] คุณจะเข้าสู่โหมดการพัฒนาโดยอัตโนมัติเนื่องจากเป็นการจำลองการใช้งานจริง ข้อมูลทั้งหมดจะไม่ได้รับการบันทึก

### 🍵 ใช้งานจริง

สำหรับการใช้งานจริงสามารถใช้คำสั่งหรือชุดคำสั่งที่เตรียมไว้ได้ตามปกติ ดังนี้:

- บน Linux หรือ MacOS

  ```sh
  sh start.sh || sudo sh start.sh

  # or

  npm start
  ```

- บน Windows

  ```bat
  ./start.bat

  @REM or

  npm start
  ```

### 🐳 ทำงานบน Docker

การดำเนินการนี้จำเป็นต้องมี [Docker](https://www.docker.com/products/docker-desktop/)

- เปิดเทอร์มินัลแล้วเพิ่มตัวแปรสภาพแวดล้อมทั้งหมดที่จำเป็น
  - สำหรับ Windows ใช้คำสั่ง `set variable=example`
  - สำหรับ Linux หรือ MacOS ใช้คำสั่ง `export variable=example`
- ทำการสร้างอิมเมจโดยใช้คำสั่ง `npm run docker:build` หรือ `npm run docker:build:serve` สำหรับโหมดจำลองแล้วรอจนกว่าจะเสร็จสิ้นกระบวนการ
- หลังจากสร้างอิมเมจสำเร็จแล้วให้รันโดยใช้คำสั่ง `npm run docker:run` หรือ `npm run docker:build:serve` สำหรับโหมดจำลอง

[เรียนรู้เพิ่มเติมเกี่ยวกับคำสั่ง Docker](https://docs.docker.com/reference/)

## ⚡ แก้ไขปัญหาอย่างรวดเร็ว

- `gyp ERR! gyp ERR! gyp ERR! stack Error: not found: make`

  ปัญหานี้อาจเกิดจาก **Build Tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขปัญหานี้ให้ดูที่ส่วน[การติดตั้ง Build Tools](#1-ติดตั้ง-build-tools)

## 🌐 ปรับปรุงการแปลภาษา

您可以帮助我们翻译一种现有语言或一种当前在 [Crowdin](https://crowdin.com/project/shioru-bot)不可用的语言。

## ⚠️ พบปัญหา

หากคุณพบปัญหาใดๆ จากการทำงานปัจจุบันของคุณ คุณสามารถแจ้งให้เราทราบได้ผ่านแท็บ [issues](https://github.com/Maseshi/Shioru/issues) ของพื้นที่เก็บนี้ได้
