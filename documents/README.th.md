<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/apple-icon.png" width="100" alt="Shioru" /><strong>
    <h1>Shioru</h1>
    <p>เลขาส่วนตัวใน Discord ที่จะช่วยทำให้กิลด์ของคุณน่าอยู่ยิ่งขึ้น</p>
  </strong>
  <p><a title="Discord.js v14" href="https://discord.js.org/">
      <img src="https://img.shields.io/badge/discord.js-14-blue?logo=discord&logoColor=white&style=for-the-badge" alt="Discord.js v14" />
    </a>
    <a title="Last commit" href="https://github.com/Maseshi/Shioru/commits/">
      <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru?logo=github&style=for-the-badge" alt="Last commit" />
    </a>
    <a title="Status" href="https://shioru.statuspage.io/">
      <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json&query=status.indicator&logo=google-cloud&logoColor=white&label=status&style=for-the-badge" alt="Status" />
    </a>
    <br />
    <a title="Crowdin" href="https://crowdin.com/project/shioru">
      <img src="https://badges.crowdin.net/shioru/localized.svg" alt="Crowdin" />
    </a>
    <a title="CodeFactor" href="https://www.codefactor.io/repository/github/maseshi/shioru">
      <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
    </a>
    <a title="Top.gg" href="https://top.gg/bot/704706906505347183">
      <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" alt="Top.gg" />
    </a>
  </p>
  <p><a href="https://shiorus.web.app/invite">Add App</a>
    ·
    <a href="https://github.com/Maseshi/Shioru/tree/main/documents">Switch Languages</a>
    ·
    <a href="https://shioru.statuspage.io/">Status</a>
    ·
    <a href="https://crowdin.com/project/shioru">Improve Translation</a>
    ·
    <a href="https://top.gg/bot/704706906505347183">Rate It</a>
  </p>
</div>

เลขาส่วนตัวที่ดีที่สุดของคุณจะช่วยให้กิลด์ของคุณดูมีชีวิตชีวามากขึ้น เธอสามารถทำสิ่งต่าง ๆ ได้หลายอย่างซึ่งคุณสามารถดูรายละเอียดข้อมูลของคำสั่งทั้งหมด ได้ง่าย ๆ โดยพิมพ์ `/help`

## ✨ คุณสมบัติเด่น

- [x] ทำงานบน [Discord.js](https://discord.js.org/) v14
- [x] อ่านง่าย ใช้งานง่ายและประสิทธิภาพสูง
- [x] สามารถปรับแต่งสิ่งที่ต้องการได้หลากหลายรายการ
- [x] มีคำสั่งทั้งหมดรวมถึงคำสั่งย่อยที่พร้อมใช้งานมากกว่า 100+ คำสั่ง
- [x] สามารถเล่นเพลงได้ทั้งจาก [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/), [SoundCloud](https://soundcloud.com/) และอีก [900+ เว็บไซต์](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)พร้อมทั้งมีระบบเล่นเพลงต่อโดยอัตโนมัติ
- [x] รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์ภาษา](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json)ของที่เก็บนี้
- [x] ระบบระดับชั้น (เลเวลและค่าประสบการณ์)
- [x] รองรับการปรับแต่งการแจ้งเตือนของเซิร์ฟเวอร์
- [x] สามารถพูดคุยได้โดยการพิมพ์ `@Shioru` ตามด้วยข้อความที่ต้องการสื่อสาร
- [x] รองรับการทำงานบน Shard หรือรองรับการทำงานในหลากหลายกิลด์
- [x] สามารถใช้งานคำสั่งแอปพลิเคชั่น (/) ได้
- [x] จำลองระบบฐานข้อมูลสำหรับทดสอบ

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## 🧩 ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v22.12.0 หรือสูงกว่า
- [Firebase Tools](https://firebase.google.com/docs/cli) (ต้องการ [Java](https://www.oracle.com/java/technologies/downloads/) v11.0.0 หรือสูงกว่า)
- [Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) (ต้องการ [Python](https://www.python.org/downloads/) v3.8.0 หรือสูงกว่า)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## ⌛ การติดตั้ง

### 1. โคลนบอทและติดตั้งส่วนประกอบ

- เปิดใช้งานเทอร์มินัลแล้วรันคำสั่งต่อไปนี้
  ```bat
  git clone https://github.com/Maseshi/Shioru.git
  cd Shioru
  npm install
  ```
- ทำการเปลี่ยนชื่อไฟล์ `.env.example` เป็น `.env` แล้วใส่ค่าที่จำเป็นทั้งหมด

> [!NOTE]
>
> คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ [./source/configs/data.js](../source/configs/data.js)

### 2. ตั้งค่าบอทและเชิญเข้าร่วม

- ไปที่ [Discord Developer Portal](https://discord.com/developers/applications)
- คลิก **"New Application"** แล้วตั้งชื่อบอทของคุณและยอมรับกฎนโยบายของ Discord
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในแถบที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### 3. ตั้งค่าฐานข้อมูล

- ไปที่ https://firebase.google.com/ และเริ่มตั้งค่าโครงการ
- เพิ่มโครงการใหม่และทำตามขั้นตอนต่างๆ
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env`
- ไปที่ **สร้าง > [ฐานข้อมูลเรียลไทม์](https://console.firebase.google.com/u/0/project/_/database/data)** เพื่อสร้างฐานข้อมูลสำหรับจัดเก็บข้อมูล

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

> [!NOTE]
>
> คุณจะเข้าสู่โหมดการพัฒนาโดยอัตโนมัติเนื่องจากเป็นการจำลองการใช้งานจริง ข้อมูลทั้งหมดจะไม่ได้รับการบันทึก

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

- คัดลอก `.env.example` เป็น `.env` แล้วแทนที่ค่าตัวอย่างด้วยค่าคอนฟิกของคุณ
- สร้างอิมเมจและเริ่มบอทด้วย `npm run docker:up`
- ติดตาม log ด้วย `npm run docker:logs`
- หยุดและลบ container ด้วย `npm run docker:down`

ค่าเริ่มต้นของ health endpoint คือ `http://127.0.0.1:3000/health` หากต้องการเปลี่ยนพอร์ตฝั่ง host ให้ตั้งค่า `SHIORU_PORT` ใน `.env`

[เรียนรู้เพิ่มเติมเกี่ยวกับคำสั่ง Docker](https://docs.docker.com/reference/)

## 🌐 ปรับปรุงการแปลภาษา

คุณสามารถช่วยเราแปลภาษาที่มีอยู่หรือภาษาที่ยังไม่พร้อมใช้งานในขณะนี้ได้ที่ [Crowdin](https://crowdin.com/project/shioru).

## ⚠️ พบปัญหา

หากคุณพบปัญหาใดๆ จากการทำงานปัจจุบันของคุณ คุณสามารถแจ้งให้เราทราบได้ผ่านแท็บ [issues](https://github.com/Maseshi/Shioru/issues) ของพื้นที่เก็บนี้ได้
