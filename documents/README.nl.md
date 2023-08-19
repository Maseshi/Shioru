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

[เปลี่ยนภาษา](https://github.com/Maseshi/Shioru/tree/main/documents)

Uw goede serverassistent zal ervoor zorgen dat uw server er levendiger uitziet. Ze kan veel dingen doen waarvan je gedetailleerde informatie over verschillende commando's kunt vinden door `/help` te typen.Je kunt Shioru uitnodigen om lid te worden van je server vanaf[hier](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## Functies

- Werkt op [Discord.js](https://discord.js.org/) v14.
- In staat om een verscheidenheid aan gewenste items aan te passen
- Muziek kan worden afgespeeld van [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) en [SoundCloud](https://soundcloud.com/) met automatische weergave.
- Ondersteuning voor meerdere talen U kunt de ondersteunde talen controleren vanuit[taal](https://github.com/Maseshi/shioru/blob/main/source/languages)bestanden van deze repository.
- Tier systeem (niveau en ervaring)
- Ondersteuning voor aanpassing van servermeldingen
- U kunt praten door `@Shioru` te typen, gevolgd door het bericht dat u wilt communiceren.
- Het toepassingscommando (/) kan worden gebruikt.

en vele andere interessante functies...

## ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v18.0.0 of hoger
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Handleiding voor snelle installatie

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- Ga naar [Discord Developer Portal](https://discord.com/developers/applications)
- Klik op **"Nieuwe toepassing"** en geef uw bot een naam en accepteer de Discord-beleidsregels.
- Ga naar pagina **"Bot"** en schakel alle opties in sectie **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Nodig uw bot uit voor de server door naar pagina **OAuth2 > URL Generator** te gaan selecteer `bot` en `applications.commands` selecteer `Beheerder` kopieer de link en plak deze in het adres van uw browser. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### ตั้งค่าบอท

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

- Start een terminal en voer de volgende opdracht uit.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- U kunt enkele gegevens wijzigen in **config** op `./source/config.js`

### Stel Firebase in

- Ga naar https://firebase.google.com/ en begin met het opzetten van het project.
- Voeg een nieuw project toe en volg de stappen.
- Voeg uw eerste applicatie toe met **Website** Noem uw app optioneel **"Stel ook Firebase Hosting in voor deze app"** en registreer de app. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase geeft u informatie over de configuratie. Pas deze waarden toe op bestand `.env.example`
- Ga naar **maak > [realtime database](https://console.firebase.google.com/u/0/project/_/database/data)** om een opslagdatabase aan te maken.

### ontwikkelen

- Hernoem het bestand `.env.example` naar `.env` en voer alle benodigde waarden in.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## Snelle probleemoplossing

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Als u pakket **sodium** niet kunt installeren, installeer dan in plaats daarvan **libsodium-wrappers**.
```bat
npm natrium verwijderen
npm installeren libsodium-wrappers@latest --save
```
- Als je je muziek niet kunt afspelen of als de afspeelopdrachten voor muziek niet werken, installeer dan [ffmpeg](https://ffmpeg.org/download.html) **(aanbevolen)** of installeer het **ffmpeg-static** pakket en probeer het opnieuw.
```bat
npm install ffmpeg-static@latest --save
```

## Verbeter vertalen

U kunt ons helpen een bestaande taal te vertalen of een taal die momenteel niet beschikbaar is bij [Crowdin](https://crowdin.com/project/shioru-bot).

## credit

Bedankt aan alle oorspronkelijke makers voor het toestaan van het gebruik van deze prachtige werken van jou.

Avatartekening door: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## een probleem gevonden

Als u problemen ondervindt van je huidige werk U kunt ons dit laten weten via het tabblad [nummer](https://github.com/Maseshi/Shioru/issues) van deze repository.
