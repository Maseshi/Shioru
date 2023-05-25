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

[SV](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Funktioner

- Fungerar på [Discord.js](https://discord.js.org/) v14.
- Kan skräddarsy en mängd önskade föremål
- Musik kan spelas från [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) och [SoundCloud](https://soundcloud.com/) med automatisk uppspelning.
- Stöd för flera språk Du kan kontrollera vilka språk som stöds i[språkfilen](https://github.com/Maseshi/shioru/blob/main/source/languages)i detta förråd.
- Tiersystem (nivå och erfarenhet)
- Stöd för anpassning av serveraviseringar
- Du kan prata genom att skriva `@Shioru` följt av meddelandet du vill kommunicera.
- Programkommandot (/) kan användas.

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Förbättra Översätt

och många andra intressanta funktioner...

## Förutsättningar

- [Node.js](https://nodejs.org/) v18.0.0 eller senare
- [Firebase](https://firebase.google.com/) v9.0.0 eller senare
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Snabbguide

### Komma igång

- Gå till [Discord Developer Portal](https://discord.com/developers/applications)
- Klicka på **"Ny applikation"** och namnge din bot och acceptera reglerna för Discord-policyn.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Skapa en bot

- Starta en terminal och kör följande kommando.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install autoconf automake g++ libtool build-essential
```

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- Du kan ändra vissa data i **config** vid `./source/config.js`

### Konfigurera Firebase

- Gå till https://firebase.google.com/ och börja konfigurera projektet.
- Lägg till ett nytt projekt och följ stegen.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- Gå till **skapa > [realtidsdatabas](https://console.firebase.google.com/u/0/project/_/database/data)** för att skapa en lagringsdatabas.

### utveckla

- Byt namn på filen `.env.example` till `.env` och infoga alla nödvändiga värden.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Snabb felsökning

- Om du inte kan installera paket **sodium** , installera **libsodium-wrappers** istället.
```bat
npm installera ffmpeg-static@latest --save
```
- Om du inte kan spela din musik eller om kommandon för musikuppspelning inte fungerar, installera [ffmpeg](https://ffmpeg.org/download.html) **(rekommenderas)** eller installera paketet **ffmpeg-static** och försök igen.
```bat
npm install ffmpeg-static@latest --save
```

## kreditera

Du kan hjälpa oss att översätta ett befintligt språk eller ett språk som för närvarande inte är tillgängligt på [Crowdin](https://crowdin.com/project/shioru-bot).

Tack till alla originalskapare för att ni tillåter användningen av dessa underbara verk.

## hittade ett problem

Avatarteckning av: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)
