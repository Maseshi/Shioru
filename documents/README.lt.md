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
  <a title="Būsena" target="_blank" href="https://shioru.statuspage.io/">
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

[LT](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## funkcijos

- Veikia su [Discord.js](https://discord.js.org/) v14.
- Galiu pritaikyti įvairius norimus elementus
- Muziką galima leisti iš [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) ir [SoundCloud](https://soundcloud.com/) su automatiniu atkūrimu.
- Palaikykite kelias kalbas Palaikomas kalbas galite patikrinti šios saugyklos[kalbos faile](https://github.com/Maseshi/shioru/blob/main/source/languages).
- Pakopų sistema (lygis ir patirtis)
- Serverio pranešimų tinkinimo palaikymas
- Galite kalbėti įvesdami `@Shioru` , o po to pranešimo, su kuriuo norite susisiekti.
- Galima naudoti programos komandą (/).

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Tobulinti vertimą

ir daug kitų įdomių funkcijų...

## Būtinos sąlygos

- [Node.js](https://nodejs.org/) v18.0.0 arba naujesnė versija
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า **(รวมอยู่ใน Node.js)**
- [Build Tools](https://visualstudio.microsoft.com/downloads/?q=build+tools) 2019 หรือมากกว่า **(รวมอยู่ใน Node.js)**
- [Firebase](https://firebase.google.com/) v9.0.0 arba naujesnė versija
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Greitos sąrankos vadovas

### Pradėti

- Eikite į [Discord kūrėjų portalą](https://discord.com/developers/applications)
- Spustelėkite **„Nauja programa“** , pavadinkite savo robotą ir sutikite su „Discord“ politikos taisyklėmis.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Nustatykite robotą

- Paleiskite terminalą ir paleiskite šią komandą.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install libtool autoconf automake g++
```

```bat
git klonas https://github.com/Maseshi/Shioru.git
cd Shioru
npm įdiegti --save
```

- Kai kuriuos duomenis galite keisti **config** adresu `./source/config.js`

### Nustatykite „Firebase“.

- Eikite į https://firebase.google.com/ ir pradėkite nustatyti projektą.
- Pridėkite naują projektą ir atlikite nurodytus veiksmus.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- Eikite į **sukurti > [realaus laiko duomenų bazę](https://console.firebase.google.com/u/0/project/_/database/data)** norėdami sukurti saugojimo duomenų bazę.

### vystytis

- Pervardykite failą `.env.example` į `.env` ir įterpkite visas reikalingas reikšmes.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Greitas trikčių šalinimas

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Jei negalite įdiegti paketo **sodium** , vietoj to įdiekite **libsodium-wrappers**.
```bat
npm įdiegti ffmpeg-static@latest --save
```
- Jei negalite leisti muzikos arba muzikos atkūrimo komandos neveikia, įdiekite [ffmpeg](https://ffmpeg.org/download.html) **(rekomenduojama)** arba įdiekite paketą **ffmpeg-static** ir bandykite dar kartą.
```bat
npm įdiegti ffmpeg-static@latest --save
```

## kreditas

Galite padėti mums išversti esamą kalbą arba kalbą, kurios šiuo metu nėra [Crowdin](https://crowdin.com/project/shioru-bot).

Dėkojame visiems originaliems kūrėjams už leidimą naudoti šiuos nuostabius jūsų kūrinius.

## rado problemą

Avataro piešinys: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)
