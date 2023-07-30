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
  <a title="Κατάσταση" target="_blank" href="https://shioru.statuspage.io/">
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

[EL](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Χαρακτηριστικά

- Λειτουργεί σε [Discord.js](https://discord.js.org/) v14.
- Δυνατότητα προσαρμογής μιας ποικιλίας επιθυμητών αντικειμένων
- Μπορεί να αναπαραχθεί μουσική από [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) και [SoundCloud](https://soundcloud.com/) με αυτόματη αναπαραγωγή.
- Υποστήριξη πολλαπλών γλωσσών Μπορείτε να ελέγξετε τις υποστηριζόμενες γλώσσες από αρχεία[γλώσσας](https://github.com/Maseshi/shioru/blob/main/source/languages)αυτού του αποθετηρίου.
- Σύστημα βαθμίδων (επίπεδο και εμπειρία)
- Υποστήριξη για προσαρμογή ειδοποιήσεων διακομιστή
- Μπορείτε να μιλήσετε πληκτρολογώντας `@Shioru` ακολουθούμενο από το μήνυμα που θέλετε να επικοινωνήσετε.
- Μπορεί να χρησιμοποιηθεί η εντολή εφαρμογής (/).

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Βελτιώστε τη Μετάφραση

και πολλά άλλα ενδιαφέροντα χαρακτηριστικά...

## Προαπαιτούμενα

- [Node.js](https://nodejs.org/) v18.0.0 ή νεότερη έκδοση
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า **(รวมอยู่ใน Node.js)**
- [Build Tools](https://visualstudio.microsoft.com/downloads/?q=build+tools) 2019 หรือมากกว่า **(รวมอยู่ใน Node.js)**
- [Firebase](https://firebase.google.com/) v9.0.0 ή νεότερη έκδοση
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Οδηγός γρήγορης εγκατάστασης

### Ξεκίνα

- Μεταβείτε στο [Discord Developer Portal](https://discord.com/developers/applications)
- Κάντε κλικ στο **"Νέα εφαρμογή"** και ονομάστε το bot σας και αποδεχτείτε τους κανόνες της πολιτικής Discord.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Ρυθμίστε ένα bot

- Εκκινήστε ένα τερματικό και εκτελέστε την ακόλουθη εντολή.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install libtool autoconf automake g++
```

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- Μπορείτε να τροποποιήσετε ορισμένα δεδομένα σε **config** at `./source/config.js`

### Ρυθμίστε το Firebase

- Μεταβείτε στη διεύθυνση https://firebase.google.com/ και ξεκινήστε τη ρύθμιση του έργου.
- Προσθέστε ένα νέο έργο και ακολουθήστε τα βήματα.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- ไปที่ **สร้าง > [ฐานข้อมูลเรียลไทม์](https://console.firebase.google.com/u/0/project/_/database/data)** เพื่อสร้างฐานข้อมูลสำหรับจัดเก็บข้อมูล

### αναπτύσσω

- Μετονομάστε το αρχείο `.env.example` σε `.env` και εισαγάγετε όλες τις απαραίτητες τιμές.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Γρήγορη αντιμετώπιση προβλημάτων

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Εάν δεν μπορείτε να εγκαταστήσετε το πακέτο **sodium** , εγκαταστήστε **libsodium-wrappers**.
```bat
npm εγκατάσταση ffmpeg-static@latest --save
```
- Εάν δεν μπορείτε να αναπαράγετε τη μουσική σας ή οι εντολές αναπαραγωγής μουσικής δεν λειτουργούν, εγκαταστήστε το [ffmpeg](https://ffmpeg.org/download.html) **(συνιστάται)** ή εγκαταστήστε το πακέτο **ffmpeg-static** και δοκιμάστε ξανά.
```bat
npm εγκατάσταση ffmpeg-static@latest --save
```

## πίστωση

Μπορείτε να μας βοηθήσετε να μεταφράσουμε μια υπάρχουσα γλώσσα ή μια γλώσσα που δεν είναι προς το παρόν διαθέσιμη στο [Crowdin](https://crowdin.com/project/shioru-bot).

Ευχαριστούμε όλους τους πρωτότυπους δημιουργούς που επέτρεψαν τη χρήση αυτών των υπέροχων έργων σας.

## βρήκε πρόβλημα

Σχέδιο Avatar από: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)
