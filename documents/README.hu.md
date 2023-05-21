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
  <a title="Állapot" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[HU](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

A jó szerverasszisztens segít a szerverének élénkebb kinézetében. Sok mindent megtehet, amelyekről részletes információkat találhat a különböző parancsokról `/help` Meghívhatja Shiorut, hogy csatlakozzon a szerveréhez[innen](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Jellemzők

- [Discord.js](https://discord.js.org/) v14-en működik.
- Képes testreszabni a különféle kívánt elemeket
- Zene lejátszható [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) és [SoundCloud](https://soundcloud.com/) készülékekről automatikus lejátszással.
- Több nyelv támogatása A támogatott nyelveket a tárhely[nyelv](https://github.com/Maseshi/shioru/blob/main/source/languages)fájljából ellenőrizheti.
- Szintrendszer (szint és tapasztalat)
- Támogatás a szerver értesítések testreszabásához
- Beszélhet úgy, hogy beírja `@Shioru` számot, majd a kommunikálni kívánt üzenetet.
- Az alkalmazásparancs (/) használható.

és még sok más érdekes funkció...

## A Fordítás javítása

Segíthet nekünk lefordítani egy meglévő vagy egy olyan nyelvet, amely jelenleg nem érhető el [Crowdin](https://crowdin.com/project/shioru-bot)webhelyen.

## Előfeltételek

- [Node.js](https://nodejs.org/) v18.0.0 vagy újabb
- [Firebase](https://firebase.google.com/) v9.0.0 vagy újabb
- [Git](https://git-scm.com/downloads)

## Gyors telepítési útmutató

### Fogj neki

- Lépjen a [Discord fejlesztői portálra](https://discord.com/developers/applications)
- Kattintson **„Új alkalmazás”** lehetőségre, nevezze el a botját, és fogadja el a Discord szabályzat szabályait.
- Lépjen a **"Bot"** oldalra, és engedélyezze az összes opciót **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Hívja meg a botját a szerverre **oldalra lépve OAuth2 > URL-generátor** válassza ki `bot` és `Applications-t.commands` válassza a `Adminisztrátor` lehetőséget, majd másolja ki a hivatkozást és illessze be böngészője címébe. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Állíts be egy botot

- Indítson el egy terminált, és futtassa a következő parancsot.

```bash
git klón https://github.com/Maseshi/Shioru.git
cd Shioru
npm telepítés -- mentés
```

- Néhány adatot módosíthat a **config** -ben a `./source/config.js`címen.

### A Firebase beállítása

- Nyissa meg a https://firebase.google.com/ oldalt, és kezdje el a projekt beállítását.
- Adjon hozzá egy új projektet, és kövesse a lépéseket.
- Adja hozzá első alkalmazását **Webhellyel** Nevezze el az alkalmazást opcionálisan **„A Firebase Hosting beállítása ehhez az alkalmazáshoz is”** , és regisztrálja az alkalmazást. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- A Firebase tájékoztatást nyújt a konfigurációról. Alkalmazza ezeket az értékeket `.env.example`fájlra
- Menjen a **létrehozása > [valós idejű adatbázis létrehozásához](https://console.firebase.google.com/u/0/project/_/database/data)** tároló adatbázis létrehozásához.

### fejleszteni

- Nevezze át a fájlt `.env.example` re `.env` ra, és írja be az összes szükséges értéket.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Gyors hibaelhárítás

- Ha nem tudja telepíteni **sodium** csomagot, telepítsen helyette **libsodium-wrappers**.
```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```
- Ha nem tudja lejátszani a zenét, vagy a zenelejátszási parancsok nem működnek, telepítse [ffmpeg](https://ffmpeg.org/download.html) **(ajánlott)** vagy a **ffmpeg-static** csomagot, és próbálkozzon újra.
```bat
npm install ffmpeg-static@latest --save
```

## hitel

Köszönet minden eredeti alkotónak, hogy lehetővé tették e csodálatos műveid felhasználását.

[rajza: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)お着替え中](https://www.pixiv.net/en/artworks/76075098)

## problémát talált

Ha bármilyen problémába ütközik jelenlegi munkahelyétől Értesíthet minket a tárház [probléma](https://github.com/Maseshi/Shioru/issues) lapján.
