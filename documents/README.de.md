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

Ihr guter Serverassistent wird dazu beitragen, dass Ihr Server lebendiger aussieht. Sie kann viele Dinge tun, zu denen Sie detaillierte Informationen zu den verschiedenen Befehlen finden können, indem Sie `/help` Sie können Shioru von[hier aus einladen, Ihrem Server beizutreten](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## Merkmale

- Funktioniert auf [Discord.js](https://discord.js.org/) v14.
- Kann eine Vielzahl gewünschter Artikel individuell anpassen
- Musik kann von [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) und [SoundCloud](https://soundcloud.com/) mit automatischer Wiedergabe abgespielt werden.
- Unterstützt mehrere Sprachen Sie können die unterstützten Sprachen in[Sprachdatei](https://github.com/Maseshi/shioru/blob/main/source/languages)dieses Repositorys überprüfen.
- Stufensystem (Niveau und Erfahrung)
- Unterstützung für die Anpassung der Serverbenachrichtigung
- Sie können sprechen, indem Sie `@Shioru` eingeben, gefolgt von der Nachricht, die Sie übermitteln möchten.
- Der Anwendungsbefehl (/) kann verwendet werden.

und viele weitere interessante Features...

## Voraussetzungen

- [Node.js](https://nodejs.org/) v18.0.0 oder höher
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Kurzanleitung zur Einrichtung

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- Gehen Sie zu [Discord Developer Portal](https://discord.com/developers/applications)
- Klicken Sie auf **„Neue Anwendung“** , geben Sie Ihrem Bot einen Namen und akzeptieren Sie die Richtlinienregeln von Discord.
- Gehen Sie zu Seite **„Bot“** und aktivieren Sie alle Optionen in Abschnitt **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Laden Sie Ihren Bot zum Server ein, indem Sie auf Seite **gehen. OAuth2 > URL-Generator** Wählen Sie `Bot` und `Anwendungen. Befehle` Wählen Sie `Administrator` Kopieren Sie dann den Link und fügen Sie ihn in die Adresse Ihres Browsers ein. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Richten Sie einen Bot ein

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

- Starten Sie ein Terminal und führen Sie den folgenden Befehl aus.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- Sie können einige Daten in **config** unter `./source/config.js`ändern

### Richten Sie Firebase ein

- Gehen Sie zu https://firebase.google.com/ und beginnen Sie mit der Einrichtung des Projekts.
- Fügen Sie ein neues Projekt hinzu und befolgen Sie die Schritte.
- Fügen Sie Ihre erste Anwendung mit **Website hinzu.** Benennen Sie Ihre App optional. **„Richten Sie auch Firebase Hosting für diese App ein“** und registrieren Sie die App. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase stellt Ihnen Informationen zur Konfiguration zur Verfügung. Wenden Sie diese Werte auf Datei `.env.example`an
- Gehen Sie zu **erstellen > [Echtzeitdatenbank](https://console.firebase.google.com/u/0/project/_/database/data)** , um eine Speicherdatenbank zu erstellen.

### entwickeln

- Benennen Sie die Datei `.env.example` in `.env` um und fügen Sie alle erforderlichen Werte ein.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## Schnelle Fehlerbehebung

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Wenn Sie Paket **Natrium** nicht installieren können, installieren Sie stattdessen **libsodium-wrappers**.
```bat
Git-Klon https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```
- Wenn Sie Ihre Musik nicht abspielen können oder die Musikwiedergabebefehle nicht funktionieren, installieren Sie [ffmpeg](https://ffmpeg.org/download.html) **(empfohlen)** oder installieren Sie das **ffmpeg-static** Paket und versuchen Sie es erneut.
```bat
npm install ffmpeg-static@latest --save
```

## Verbessern Sie die Übersetzung

Sie können uns helfen, eine vorhandene Sprache oder eine Sprache zu übersetzen, die derzeit nicht unter [Crowdin](https://crowdin.com/project/shioru-bot)verfügbar ist.

## Kredit

Vielen Dank an alle Originalschöpfer, die die Nutzung Ihrer wunderbaren Werke gestattet haben.

Avatar-Zeichnung von: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## habe ein Problem gefunden

Wenn Sie auf Probleme stoßen von Ihrem aktuellen Job Sie können uns dies über die Registerkarte [Problem](https://github.com/Maseshi/Shioru/issues) dieses Repositorys mitteilen.
