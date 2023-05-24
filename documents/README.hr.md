<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <h1>
    <strong>Shioru</strong>
  </h1>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru">
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru">
  <a title="Status" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Gužva" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[HR](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

ผู้ช่วยเซิร์ฟเวอร์ที่ดีของคุณจะช่วยให้เซิร์ฟเวอร์ของคุณดูมีชีวิตชีวามากขึ้น เธอสามารถทำได้หลายอย่างซึ่งคุณสามารถดูรายละเอียดข้อมูลของคำสั่งต่างๆ ได้โดยพิมพ์ `/help` คุณสามารถเชิญ Shioru เข้าร่วมเซิร์ฟเวอร์ของคุณได้จาก[ที่นี่](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Značajke

- Radi na [Discord.js](https://discord.js.org/) v14.
- Mogućnost prilagođavanja raznih željenih stavki
- Glazba se može reproducirati s [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) i [SoundCloud](https://soundcloud.com/) s automatskom reprodukcijom.
- Podržava više jezika Podržane jezike možete provjeriti u datotekama[jezika](https://github.com/Maseshi/shioru/blob/main/source/languages)ovog repozitorija.
- Tier sustav (razina i iskustvo)
- Podrška za prilagodbu obavijesti poslužitelja
- Možete razgovarati upisivanjem `@Shioru` nakon čega slijedi poruka koju želite komunicirati.
- Može se koristiti naredba aplikacije (/).

i mnoge druge zanimljive karakteristike...

## Poboljšajte Prevoditelj

Možete nam pomoći prevesti postojeći jezik ili jezik koji trenutno nije dostupan na [Crowdin](https://crowdin.com/project/shioru-bot).

## Preduvjeti

- [Node.js](https://nodejs.org/) v18.0.0 ili noviji
- [Firebase](https://firebase.google.com/) v9.0.0 ili noviji
- [Git](https://git-scm.com/downloads)

## Vodič za brzo postavljanje

### Započnite

- Idite na [Discord Developer Portal](https://discord.com/developers/applications)
- Kliknite **"Nova aplikacija"** i imenujte svog bota te prihvatite pravila pravila Discorda.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Postavite bota

- Pokrenite terminal i pokrenite sljedeću naredbu.

```bash
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

Hvala svim izvornim stvarateljima što su dopustili korištenje ovih vaših prekrasnih djela.

Crtanje avatara: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## pronašao problem

Ako naiđete na bilo kakve probleme iz vašeg trenutnog posla Možete nas obavijestiti putem kartice [problem](https://github.com/Maseshi/Shioru/issues) ovog repozitorija.
