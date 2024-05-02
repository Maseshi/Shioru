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
  <a title="Állapot" target="_blank" href="https://shioru.statuspage.io/">
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

[HU](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## Jellemzők

- [Discord.js](https://discord.js.org/) v14-en működik.
- Képes testreszabni a különféle kívánt elemeket
- Zene lejátszható [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) és [SoundCloud](https://soundcloud.com/) készülékekről automatikus lejátszással.
- Több nyelv támogatása A támogatott nyelveket a tárhely[nyelv](https://github.com/Maseshi/shioru/blob/main/source/languages)fájljából ellenőrizheti.
- Szintrendszer (szint és tapasztalat)
- Támogatás a szerver értesítések testreszabásához
- Beszélhet úgy, hogy beírja `@Shioru` számot, majd a kommunikálni kívánt üzenetet.
- Az alkalmazásparancs (/) használható.

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Előfeltételek

- [Node.js](https://nodejs.org/) v18.0.0 vagy újabb
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Gyors telepítési útmutató

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- Lépjen a [Discord fejlesztői portálra](https://discord.com/developers/applications)
- Kattintson **„Új alkalmazás”** lehetőségre, nevezze el a botját, és fogadja el a Discord szabályzat szabályait.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Állíts be egy botot

เนื่องจากเราใช้ [sodium](https://www.npmjs.com/package/sodium) ในการเข้ารหัสและถอดรหัส เราจึงจำเป็นต้องติดตั้งส่วนประกอบเพิ่มเติมต่อไปนี้:

```bat
@REM บน Windows
npm install -g windows-build-tools
```

```sh
# บน MacOS (Darwin)
brew install libtool autoconf automake
```

```sh
# บน Linux
sudo apt-get install libtool-bin
```

- Indítson el egy terminált, és futtassa a következő parancsot.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- Néhány adatot módosíthat a **config** -ben a `./source/config.js`címen.

### A Firebase beállítása

- Nyissa meg a https://firebase.google.com/ oldalt, és kezdje el a projekt beállítását.
- Adjon hozzá egy új projektet, és kövesse a lépéseket.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- Menjen a **létrehozása > [valós idejű adatbázis létrehozásához](https://console.firebase.google.com/u/0/project/_/database/data)** tároló adatbázis létrehozásához.

### fejleszteni

- Nevezze át a fájlt `.env.example` re `.env` ra, és írja be az összes szükséges értéket.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## Gyors hibaelhárítás

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Ha nem tudja telepíteni **sodium** csomagot, telepítsen helyette **libsodium-wrappers**.

```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```

- Ha nem tudja lejátszani a zenét, vagy a zenelejátszási parancsok nem működnek, telepítse [ffmpeg](https://ffmpeg.org/download.html) **(ajánlott)** vagy a **ffmpeg-static** csomagot, és próbálkozzon újra.

```bat
npm install ffmpeg-static@latest --save
```

## A Fordítás javítása

és még sok más érdekes funkció...

## hitel

Segíthet nekünk lefordítani egy meglévő vagy egy olyan nyelvet, amely jelenleg nem érhető el [Crowdin](https://crowdin.com/project/shioru-bot)webhelyen.

Köszönet minden eredeti alkotónak, hogy lehetővé tették e csodálatos műveid felhasználását.

## problémát talált

Ha bármilyen problémába ütközik jelenlegi munkahelyétől Értesíthet minket a tárház [probléma](https://github.com/Maseshi/Shioru/issues) lapján.
