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

[DE](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Ihr guter Serverassistent wird dazu beitragen, dass Ihr Server lebendiger aussieht. Sie kann viele Dinge tun, zu denen Sie detaillierte Informationen zu den verschiedenen Befehlen finden können, indem Sie `/help` Sie können Shioru von[hier aus einladen, Ihrem Server beizutreten](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

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

## Verbessern Sie die Übersetzung

Sie können uns helfen, eine vorhandene Sprache oder eine Sprache zu übersetzen, die derzeit nicht unter [Crowdin](https://crowdin.com/project/shioru-bot)verfügbar ist.

## Voraussetzungen

- [Node.js](https://nodejs.org/) v18.0.0 oder höher
- [Firebase](https://firebase.google.com/) v9.0.0 oder höher
- [Git](https://git-scm.com/downloads)

## Kurzanleitung zur Einrichtung

### Loslegen

- Gehen Sie zu [Discord Developer Portal](https://discord.com/developers/applications)
- Klicken Sie auf **„Neue Anwendung“** , geben Sie Ihrem Bot einen Namen und akzeptieren Sie die Richtlinienregeln von Discord.
- Gehen Sie zu Seite **„Bot“** und aktivieren Sie alle Optionen in Abschnitt **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Laden Sie Ihren Bot zum Server ein, indem Sie auf Seite **gehen. OAuth2 > URL-Generator** Wählen Sie `Bot` und `Anwendungen. Befehle` Wählen Sie `Administrator` Kopieren Sie dann den Link und fügen Sie ihn in die Adresse Ihres Browsers ein. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Richten Sie einen Bot ein

- Starten Sie ein Terminal und führen Sie den folgenden Befehl aus.

```bash
Git-Klon https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
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
- Gehen Sie zum Terminal und führen Sie die Befehle `npm run dev` für die Entwicklung und `npm start` für die Produktion aus. > **Hinweis**: Im Entwicklungsmodus Einige Funktionen funktionieren möglicherweise nicht.

## Schnelle Fehlerbehebung

- Wenn Sie Paket **Natrium** nicht installieren können, installieren Sie stattdessen **libsodium-wrappers**.
```bat
npm deinstalliert Natrium
npm installiert libsodium-wrappers@latest --save
```
- Wenn Sie Ihre Musik nicht abspielen können oder die Musikwiedergabebefehle nicht funktionieren, installieren Sie [ffmpeg](https://ffmpeg.org/download.html) **(empfohlen)** oder installieren Sie das **ffmpeg-static** Paket und versuchen Sie es erneut.
```bat
npm install ffmpeg-static@latest --save
```

## Kredit

Vielen Dank an alle Originalschöpfer, die die Nutzung Ihrer wunderbaren Werke gestattet haben.

Avatar-Zeichnung von: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## habe ein Problem gefunden

Wenn Sie auf Probleme stoßen von Ihrem aktuellen Job Sie können uns dies über die Registerkarte [Problem](https://github.com/Maseshi/Shioru/issues) dieses Repositorys mitteilen.
