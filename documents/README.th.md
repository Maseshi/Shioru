<div align="center">
    <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
    <h1>
        <strong>Shioru</strong>
    </h1>
    <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white&style=for-the-badge" />
    <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github&style=for-the-badge" />
    <img src="https://img.shields.io/github/v/release/Maseshi/Shioru?logo=java&style=for-the-badge">
    <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github&style=for-the-badge" />
    <img src="https://img.shields.io/github/workflow/status/Maseshi/Shioru/CodeQL?label=test&logo=circleci&style=for-the-badge" />
    <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru?style=for-the-badge">
    <a href="https://stats.uptimerobot.com/gXGx1iqxop">
        <img src="https://img.shields.io/uptimerobot/ratio/7/m789124615-03e67c33f3ffeade6f2b8d05?logo=google-cloud&logoColor=white&style=for-the-badge" />
    </a>
</div>

[EN](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

ผู้ช่วยเซิร์ฟเวอร์ที่ดีของคุณจะช่วยให้เซิร์ฟเวอร์ของคุณดูมีชีวิตชีวามากขึ้น เธอสามารถทำได้หลายอย่างซึ่งคุณสามารถดูรายละเอียดข้อมูลของคำสั่งต่างๆ ได้โดยพิมพ์ `Shelp` หรือ `/help` คุณสามารถเชิญ Shioru เข้าร่วมเซิร์ฟเวอร์ของคุณได้จาก[ที่นี่](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## คุณสมบัติเด่น

- ทำงานบน [Discord.js](https://discord.js.org/) v14
- สามารถปรับแต่งสิ่งที่ต้องการได้หลากหลายรายการ
- สามารถเล่นเพลงได้ทั้งจาก [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) และ [SoundCloud](https://soundcloud.com/) พร้อมทั้งมีระบบเล่นเพลงต่อโดยอัตโนมัติ
- รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์ภาษา](https://github.com/Maseshi/shioru/blob/main/source/languages)ของที่เก็บนี้
- ระบบระดับชั้น (เลเวลและค่าประสบการณ์)
- รองรับการปรับแต่งการแจ้งเตือนของเซิร์ฟเวอร์
- สามารถพูดคุยได้โดยการพิมพ์ `@Shioru` ตามด้วยข้อความที่ต้องการสื่อสาร
- สามารถใช้งานคำสั่งแอปพลิเคชั่น (/) ได้

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v16.9.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/) v9.0.0 หรือมากกว่า
- [Git](https://git-scm.com/downloads)

## คู่มือการตั้งค่าด่วน

### เริ่มต้นใช้งาน

- เปิดใช้งานเทอร์มินัลแล้วรันคำสั่งต่อไปนี้

```bash
git clone https://github.com/Maseshi/Shioru.git
cd shioru
npm install
```

- คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ `./source/config.js` 

### ตั้งค่า Firebase

- ไปที่ https://firebase.google.com/ และเริ่มตั้งค่าโครงการ
- เพิ่มโครงการใหม่และทำตามขั้นตอนต่างๆ
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป
![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- ไปที่ **สร้าง > [ฐานข้อมูลเรียลไทม์](https://console.firebase.google.com/u/0/project/_/database/data)** เพื่อสร้างฐานข้อมูลสำหรับจัดเก็บข้อมูล

### พัฒนา

- ทำการเปลี่ยนชื่อไฟล์ `.env.example` เป็น `.env` แล้วใส่ค่าที่จำเป็นทั้งหมด
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง
    > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## การแก้ไขปัญหาอย่างรวดเร็ว

- หากคุณไม่สามารถติดตั้งแพ็คเกจ **โซเดียม** ได้ ให้ติดตั้ง **libsodium-wrappers** แทน

## เครดิต

ขอขอบคุณผู้สร้างจากต้นทางทุกท่านที่อนุญาตให้สามารถใช้งานผลงานอันยอดเยี่ยมเหล่านี้ของท่านได้

ภาพวาดประจำตัวโดย: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## พบปัญหา

หากคุณพบปัญหาใดๆ จากการทำงานปัจจุบันของคุณ คุณสามารถแจ้งให้เราทราบได้ผ่านแท็บ [issue](https://github.com/Maseshi/Shioru/issues) ของพื้นที่เก็บนี้ได้
