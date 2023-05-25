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
  <a title="Gužva" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[HR](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Značajke

- Radi na [Discord.js](https://discord.js.org/) v14.
- Mogućnost prilagođavanja raznih željenih stavki
- Glazba se može reproducirati s [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) i [SoundCloud](https://soundcloud.com/) s automatskom reprodukcijom.
- Podržava više jezika Podržane jezike možete provjeriti u datotekama[jezika](https://github.com/Maseshi/shioru/blob/main/source/languages)ovog repozitorija.
- Tier sustav (razina i iskustvo)
- Podrška za prilagodbu obavijesti poslužitelja
- Možete razgovarati upisivanjem `@Shioru` nakon čega slijedi poruka koju želite komunicirati.
- Može se koristiti naredba aplikacije (/).

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Poboljšajte Prevoditelj

i mnoge druge zanimljive karakteristike...

## Preduvjeti

- [Node.js](https://nodejs.org/) v18.0.0 ili noviji
- [Firebase](https://firebase.google.com/) v9.0.0 ili noviji
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Vodič za brzo postavljanje

### Započnite

- Idite na [Discord Developer Portal](https://discord.com/developers/applications)
- Kliknite **"Nova aplikacija"** i imenujte svog bota te prihvatite pravila pravila Discorda.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Postavite bota

- Pokrenite terminal i pokrenite sljedeću naredbu.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install autoconf automake g++ libtool build-essential
```

```bat
git klon https://github.com/Maseshi/Shioru.git
cd Shioru
npm instalacija --spremi
```

- Možete izmijeniti neke podatke u **config** na `./source/config.js`

### Postavite Firebase

- Idite na https://firebase.google.com/ i počnite postavljati projekt.
- Dodajte novi projekt i slijedite korake.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- Idite na **stvoriti > [bazu podataka u stvarnom vremenu](https://console.firebase.google.com/u/0/project/_/database/data)** za stvaranje baze podataka za pohranu.

### razviti

- Preimenujte datoteku `.env.example` u `.env` i umetnite sve potrebne vrijednosti.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Brzo rješavanje problema

- Ako ne možete instalirati paket **sodium** , umjesto toga instalirajte **libsodium-wrappers**.
```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```
- Ako ne možete reproducirati svoju glazbu ili naredbe za reprodukciju glazbe ne rade, instalirajte [ffmpeg](https://ffmpeg.org/download.html) **(preporučeno)** ili instalirajte **ffmpeg-static** paket i pokušajte ponovno.
```bat
npm instaliraj ffmpeg-static@najnovije --spremi
```

## Kreditna

Možete nam pomoći prevesti postojeći jezik ili jezik koji trenutno nije dostupan na [Crowdin](https://crowdin.com/project/shioru-bot).

Hvala svim izvornim stvarateljima što su dopustili korištenje ovih vaših prekrasnih djela.

## pronašao problem

Crtanje avatara: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)
