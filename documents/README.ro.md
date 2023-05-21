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
  <a title="stare" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Sus.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[EN](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Asistentul dvs. bun de server va ajuta serverul dvs. să arate mai animat. Ea poate face multe lucruri pe care le puteți găsi informații detaliate despre diferite comenzi tastând `/help` Puteți invita Shioru să se alăture serverului dvs. de la[aici](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Caracteristici

- Funcționează pe [Discord.js](https://discord.js.org/) v14.
- Capabil să personalizeze o varietate de articole dorite
- Muzica poate fi redată de pe [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) și [SoundCloud](https://soundcloud.com/) cu redare automată.
- Suportă mai multe limbi Puteți verifica limbile acceptate din fișierele[limbă](https://github.com/Maseshi/shioru/blob/main/source/languages)din acest depozit.
- Sistemul de niveluri (nivel și experiență)
- Suport pentru personalizarea notificărilor serverului
- Puteți vorbi tastând `@Shioru` urmat de mesajul pe care doriți să-l comunicați.
- Comanda aplicației (/) poate fi utilizată.

și multe alte caracteristici interesante...

## Îmbunătățiți Traducerea

Ne puteți ajuta să traducem o limbă existentă sau o limbă care nu este disponibilă în prezent la [Crowdin](https://crowdin.com/project/shioru-bot).

## Cerințe preliminare

- [Node.js](https://nodejs.org/) v18.0.0 sau mai mare
- [Firebase](https://firebase.google.com/) v9.0.0 sau o versiune ulterioară
- [Git](https://git-scm.com/downloads)

## Ghid de instalare rapidă

### Incepe

- Accesați [Discord Developer Portal](https://discord.com/developers/applications)
- Faceți clic pe **„Aplicație nouă”** și denumiți botul dvs. și acceptați regulile politicii Discord.
- Accesați pagina **„Bot”** și activați toate opțiunile din secțiunea **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Invitați-vă botul pe server accesând pagina **OAuth2 > URL Generator** selectați `bot` și `aplicații.comenzi` selectați `Administrator` apoi copiați linkul și inserați-l în adresa browserului dvs. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Configurați un bot

- Lansați un terminal și executați următoarea comandă.

```bash
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- Puteți modifica unele date în **config** la `./source/config.js`

### Configurați Firebase

- Accesați https://firebase.google.com/ și începeți configurarea proiectului.
- Adăugați un proiect nou și urmați pașii.
- Adăugați prima aplicație cu **Site web** Numiți aplicația opțional **„Configurați și găzduirea Firebase pentru această aplicație”** și înregistrați aplicația. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase vă va oferi informații despre configurație. Aplicați aceste valori la fișierul `.env.exemplu`
- Accesați **creați > [bază de date în timp real](https://console.firebase.google.com/u/0/project/_/database/data)** pentru a crea o bază de date de stocare.

### dezvolta

- Redenumiți fișierul `.env.example` la `.env` și introduceți toate valorile necesare.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Depanare rapidă

- Dacă nu puteți instala pachetul **sodium** , instalați în schimb **libsodium-wrappers**.
```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```
- Dacă nu puteți reda muzica sau comenzile de redare a muzicii nu funcționează, instalați [ffmpeg](https://ffmpeg.org/download.html) **(recomandat)** sau instalați pachetul **ffmpeg-static** și încercați din nou.
```bat
npm install ffmpeg-static@latest --save
```

## credit

Mulțumim tuturor creatorilor originali pentru că ați permis utilizarea acestor lucrări minunate ale voastre.

Desen avatar de: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## a gasit o problema

Dacă întâmpinați probleme din munca ta curentă Ne puteți anunța prin fila [numărul](https://github.com/Maseshi/Shioru/issues) a acestui depozit.
