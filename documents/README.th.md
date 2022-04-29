<div align="center">
    <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.ico" width="100" />
    <h1>
        <strong>Shioru</strong>
    </h1>
    <img src="https://img.shields.io/badge/discord.js-v13-7354F6?logo=discord&logoColor=white&style=flat-square" />
    <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github&style=flat-square" />
    <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github&style=flat-square" />
    <img src="https://img.shields.io/github/workflow/status/Maseshi/Shioru/CodeQL?label=test&logo=circleci&style=flat-square" />
    <a href="https://stats.uptimerobot.com/gXGx1iqxop">
        <img src="https://img.shields.io/uptimerobot/ratio/7/m789124615-03e67c33f3ffeade6f2b8d05?logo=google-cloud&logoColor=white&style=flat-square" />
    </a>
</div>

ผู้ช่วยเซิร์ฟเวอร์ที่ดีของคุณจะช่วยให้เซิร์ฟเวอร์ของคุณดูมีชีวิตชีวามากขึ้น เธอสามารถทำได้หลายอย่างซึ่งคุณสามารถดูรายละเอียดข้อมูลของคำสั่งต่างๆ ได้โดยพิมพ์ `Shelp` หรือ `/help`

คุณสามารถเชิญ Shioru เข้าร่วมเซิร์ฟเวอร์ของคุณได้จาก[ที่นี่](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot)

## ภาษาของข้อมูล

- [English](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md)
- [ไทย](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md)

## ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v16.9.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [Git](https://git-scm.com/downloads)

## เริ่มต้นใช้งาน

- เปิดใช้งานเทอร์มินัลแล้วรันคำสั่งต่อไปนี้

```
git clone https://github.com/Maseshi/Shioru.git
cd shioru
npm install
```

- ทำการเปลี่ยนชื่อไฟล์ `.env.example` เป็น `.env` แล้วใส่ค่าที่จำเป็นทั้งหมด
- คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ `./source/config/data.js` 
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง
    > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## คุณสมบัติเด่น

- ทำงานบน [Discord.js](https://discord.js.org/) v13
- สามารถปรับแต่งสิ่งที่ต้องการได้หลากหลายรายการ
- สามารถเล่นเพลงได้ทั้งจาก [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) และ [SoundCloud](https://soundcloud.com/) พร้อมทั้งมีระบบเล่นเพลงต่อโดยอัตโนมัติ
- รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์รหัสภาษา](https://github.com/Maseshi/shioru/blob/main/source/config/languages.json)ของที่เก็บนี้
- ระบบระดับชั้น (เลเวลและค่าประสบการณ์)
- รองรับการปรับแต่งการแจ้งเตือนของเซิร์ฟเวอร์
- สามารถพูดคุยได้โดยการพิมพ์ `@Shioru` ตามด้วยข้อความที่ต้องการสื่อสาร
- สามารถใช้งานคำสั่งแอปพลิเคชั่น (/) ได้

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## เอกสาร

ขณะนี้ยังไม่มีเอกสารบนเว็บไซต์ที่พร้อมใช้งานในขณะนี้ แต่จะกลับมาอีกครั้งเมื่อพร้อมแล้ว

## ชอบผลงาน

ชอบผลงานของเราใช่ไหม ซื้อกาแฟของเราสิ!

<a href="https://www.buymeacoffee.com/maseshi" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="150px" />
</a>

## เครดิต

ขอขอบคุณผู้สร้างจากต้นทางทุกท่านที่อนุญาตให้สามารถใช้งานผลงานอันยอดเยี่ยมเหล่านี้ของท่านได้

ภาพวาดประจำตัวโดย: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[三つ編みあかねちゃん](https://www.pixiv.net/en/artworks/78387684)

## พบปัญหา

หากคุณพบปัญหาใดๆ จากการทำงานปัจจุบันของคุณ คุณสามารถแจ้งให้เราทราบได้ผ่านแท็บ [issue](https://github.com/Maseshi/Shioru/issues) ของพื้นที่เก็บนี้ได้
