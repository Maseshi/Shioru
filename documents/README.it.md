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
  <a title="Stato" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="Codice Fattore" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="Codice Fattore" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

Il tuo buon assistente del server aiuterà il tuo server a sembrare più vivace. Può fare molte cose di cui puoi trovare informazioni dettagliate su diversi comandi digitando `/help` Puoi invitare Shioru a unirsi al tuo server da[qui](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Caratteristiche

- Funziona su [Discord.js](https://discord.js.org/) v14.
- In grado di personalizzare una varietà di elementi desiderati
- La musica può essere riprodotta da [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) e [SoundCloud](https://soundcloud.com/) con riproduzione automatica.
- รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์ภาษา](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json)ของที่เก็บนี้
- Sistema a livelli (livello ed esperienza)
- Supporto per la personalizzazione delle notifiche del server
- Puoi parlare digitando `@Shioru` seguito dal messaggio che vuoi comunicare.
- È possibile utilizzare il comando dell'applicazione (/).

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## ปรับปรุงการแปล

คุณสามารถช่วยเราแปลภาษาที่มีอยู่หรือภาษาที่ยังไม่พร้อมใช้งานในขณะนี้ได้ที่ [Crowdin](https://crowdin.com/project/shioru).

## Prerequisiti

- [Node.js](https://nodejs.org/) v18.0.0 o versione successiva
- [Firebase](https://firebase.google.com/) v9.0.0 o superiore
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Guida rapida all'installazione

### Iniziare

- Vai a [Portale per sviluppatori Discord](https://discord.com/developers/applications)
- Fai clic su **"Nuova applicazione"** e dai un nome al tuo bot e accetta le regole della politica di Discord.
- Vai alla pagina **"Bot"** e abilita tutte le opzioni nella sezione **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Invita il tuo bot sul server andando alla pagina **OAuth2 > URL Generator** seleziona `bot` e `application.commands` seleziona `Administrator` quindi copia il link e incollalo nell'indirizzo del tuo browser. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Imposta un bot

- Avvia un terminale ed esegui il seguente comando.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install autoconf automake g++ libtool build-essential
```

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ `./source/configs/data.js`

### Configura Firebase

- Vai su https://firebase.google.com/ e inizia a configurare il progetto.
- Aggiungi un nuovo progetto e segui i passaggi.
- Aggiungi la tua prima applicazione con **Sito web** Assegna un nome facoltativo alla tua app **"Imposta anche Firebase Hosting per questa app"** e registra l'app. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase ti fornirà informazioni sulla configurazione. Applica questi valori al file `.env.example`
- Vai a **crea > [database in tempo reale](https://console.firebase.google.com/u/0/project/_/database/data)** per creare un database di archiviazione.

### sviluppare

- Rinominare il file `.env.example` in `.env` e inserire tutti i valori necessari.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Risoluzione rapida dei problemi

- Se non puoi installare il pacchetto **sodium** , installa invece **libsodium-wrappers**.
```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```
- หากคุณไม่สามารถเล่นเพลงหรือคำสั่งเล่นเพลงไม่ทำงาน ให้ติดตั้ง [FFmpeg](https://ffmpeg.org/download.html) **(แนะนำ)** หรือติดตั้งแพ็คเกจ **ffmpeg-static** แล้วลองใหม่อีกครั้ง
```bat
npm install ffmpeg-static@latest --save
```

## credito

Grazie a tutti i creatori originali per aver permesso l'uso di queste tue meravigliose opere.

Disegno avatar di: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## trovato un problema

In caso di problemi dal tuo lavoro attuale Puoi farcelo sapere tramite la scheda [issue](https://github.com/Maseshi/Shioru/issues) di questo repository.
