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

[DA](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Funktioner

- Virker på [Discord.js](https://discord.js.org/) v14.
- I stand til at tilpasse en række ønskede emner
- Musik kan afspilles fra [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) og [SoundCloud](https://soundcloud.com/) med automatisk afspilning.
- Understøtter flere sprog Du kan kontrollere de understøttede sprog fra[sprog](https://github.com/Maseshi/shioru/blob/main/source/languages)-filer i dette lager.
- Tier system (niveau og erfaring)
- Understøttelse af tilpasning af servermeddelelser
- Du kan tale ved at skrive `@Shioru` efterfulgt af den besked, du vil kommunikere.
- Applikationskommandoen (/) kan bruges.

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Forbedre Oversæt

og mange andre interessante funktioner...

## Forudsætninger

- [Node.js](https://nodejs.org/) v18.0.0 eller nyere
- [Firebase](https://firebase.google.com/) v9.0.0 eller nyere
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Hurtig installationsvejledning

### Kom igang

- Gå til [Discord Developer Portal](https://discord.com/developers/applications)
- Klik på **"Ny applikation"** og navngiv din bot og accepter Discord-politikreglerne.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Opsæt en bot

- Start en terminal og kør følgende kommando.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install autoconf automake g++ libtool build-essential
```

```bat
git klon https://github.com/Maseshi/Shioru.git
cd Shioru
npm installer -- gem
```

- Du kan ændre nogle data i **config** på `./source/config.js`

### Konfigurer Firebase

- Gå til https://firebase.google.com/ og start opsætningen af projektet.
- Tilføj et nyt projekt og følg trinene.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- Gå til **opret > [realtidsdatabase](https://console.firebase.google.com/u/0/project/_/database/data)** for at oprette en lagerdatabase.

### udvikle

- Omdøb filen `.env.eksempel` til `.env` og indsæt alle de nødvendige værdier.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Hurtig fejlfinding

- Hvis du ikke kan installere pakke **sodium** , installer **libsodium-wrappers** i stedet for.
```bat
npm installer ffmpeg-static@latest --save
```
- Hvis du ikke kan afspille din musik, eller musikafspilningskommandoer ikke virker, skal du installere [ffmpeg](https://ffmpeg.org/download.html) **(anbefalet)** eller installere **ffmpeg-static** -pakken og prøve igen.
```bat
npm installer ffmpeg-static@latest --save
```

## kredit

Du kan hjælpe os med at oversætte et eksisterende sprog eller et sprog, der i øjeblikket ikke er tilgængeligt hos [Crowdin](https://crowdin.com/project/shioru-bot).

Tak til alle originale skabere for at tillade brugen af disse vidunderlige værker.

## fundet et problem

Avatar tegning af: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)
