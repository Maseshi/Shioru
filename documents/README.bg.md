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
  <a title="Статус" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Топ.гг" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[BG](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Характеристика

- Работи на [Discord.js](https://discord.js.org/) v14.
- Възможност за персонализиране на различни желани елементи
- Музиката може да се възпроизвежда от [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) и [SoundCloud](https://soundcloud.com/) с автоматично възпроизвеждане.
- Поддръжка на множество езици Можете да проверите поддържаните езици от[езикови](https://github.com/Maseshi/shioru/blob/main/source/languages)файлове на това хранилище.
- Система на нива (ниво и опит)
- Поддръжка за персонализиране на известията на сървъра
- Можете да говорите, като напишете `@Shioru` , последвано от съобщението, което искате да комуникирате.
- Може да се използва командата на приложението (/).

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Подобрете Преводач

и много други интересни функции...

## Предпоставки

- [Node.js](https://nodejs.org/) v18.0.0 или по-нова версия
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า **(รวมอยู่ใน Node.js)**
- [Build Tools](https://visualstudio.microsoft.com/downloads/?q=build+tools) 2019 หรือมากกว่า **(รวมอยู่ใน Node.js)**
- [Firebase](https://firebase.google.com/) v9.0.0 или по-нова версия
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Ръководство за бързо инсталиране

### Първи стъпки

- Отидете на [Портал за разработчици на Discord](https://discord.com/developers/applications)
- Щракнете върху **„Ново приложение“** и дайте име на своя бот и приемете правилата на правилата на Discord.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Настройте бот

- Стартирайте терминал и изпълнете следната команда.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install libtool autoconf automake g++
```

```bat
git клонинг https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- Можете да промените някои данни в **config** в `./source/config.js`

### Настройте Firebase

- Отидете на https://firebase.google.com/ и започнете да настройвате проекта.
- Добавете нов проект и следвайте стъпките.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- Отидете на **създаване > [база данни в реално време](https://console.firebase.google.com/u/0/project/_/database/data)** , за да създадете база данни за съхранение.

### развиват се

- Преименувайте файла `.env.example` на `.env` и вмъкнете всички необходими стойности.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Бързо отстраняване на неизправности

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Ако не можете да инсталирате пакет **sodium** , вместо това инсталирайте **libsodium-wrappers**.
```bat
npm инсталирайте ffmpeg-static@latest --save
```
- Ако не можете да възпроизвеждате музиката си или командите за възпроизвеждане на музика не работят, инсталирайте [ffmpeg](https://ffmpeg.org/download.html) **(препоръчително)** или инсталирайте пакета **ffmpeg-static** и опитайте отново.
```bat
npm инсталирайте ffmpeg-static@latest --save
```

## кредит

Можете да ни помогнете да преведем съществуващ език или език, който в момента не е наличен в [Crowdin](https://crowdin.com/project/shioru-bot).

Благодарим на всички оригинални творци, че позволиха използването на тези ваши прекрасни произведения.

## намери проблем

Рисунка на аватар от: [夏月 まりな (НАЦУКИ МАРИНА)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)
