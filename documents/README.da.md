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

[DA](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Din gode serverassistent vil hjælpe din server til at se mere livlig ud. Hun kan gøre mange ting, som du kan finde detaljeret information om forskellige kommandoer ved at skrive `/help` Du kan invitere Shioru til at deltage i din server fra[her](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Funktioner

- Virker på [Discord.js](https://discord.js.org/) v14.
- I stand til at tilpasse en række ønskede emner
- Musik kan afspilles fra [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) og [SoundCloud](https://soundcloud.com/) med automatisk afspilning.
- Understøtter flere sprog Du kan kontrollere de understøttede sprog fra[sprog](https://github.com/Maseshi/shioru/blob/main/source/languages)-filer i dette lager.
- Tier system (niveau og erfaring)
- Understøttelse af tilpasning af servermeddelelser
- Du kan tale ved at skrive `@Shioru` efterfulgt af den besked, du vil kommunikere.
- Applikationskommandoen (/) kan bruges.

og mange andre interessante funktioner...

## Forbedre Oversæt

Du kan hjælpe os med at oversætte et eksisterende sprog eller et sprog, der i øjeblikket ikke er tilgængeligt hos [Crowdin](https://crowdin.com/project/shioru-bot).

## Forudsætninger

- [Node.js](https://nodejs.org/) v18.0.0 eller nyere
- [Firebase](https://firebase.google.com/) v9.0.0 eller nyere
- [Git](https://git-scm.com/downloads)

## Hurtig installationsvejledning

### Kom igang

- Gå til [Discord Developer Portal](https://discord.com/developers/applications)
- Klik på **"Ny applikation"** og navngiv din bot og accepter Discord-politikreglerne.
- Gå til side **"Bot"** og aktiver alle muligheder i afsnit **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Inviter din bot til serveren ved at gå til side **OAuth2 > URL Generator** vælg `bot` og `applications.commands` vælg `Administrator` og kopier derefter linket og indsæt det i din browsers adresse. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Opsæt en bot

- Start en terminal og kør følgende kommando.

```bash
git klon https://github.com/Maseshi/Shioru.git
cd Shioru
npm installer -- gem
```

- Du kan ændre nogle data i **config** på `./source/config.js`

### Konfigurer Firebase

- Gå til https://firebase.google.com/ og start opsætningen af projektet.
- Tilføj et nyt projekt og følg trinene.
- Tilføj din første applikation med **Website** Navngiv din app valgfrit **"Konfigurer også Firebase Hosting for denne app"** og registrer appen. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase vil give dig oplysninger om konfigurationen. Anvend disse værdier på fil `.env.example`
- Gå til **opret > [realtidsdatabase](https://console.firebase.google.com/u/0/project/_/database/data)** for at oprette en lagerdatabase.

### udvikle

- Omdøb filen `.env.eksempel` til `.env` og indsæt alle de nødvendige værdier.
- Gå til terminalen og kør kommandoerne `npm kør dev` for udvikling og `npm start` for produktion > **Note**: Når i udviklingstilstand Nogle funktioner virker muligvis ikke.

## Hurtig fejlfinding

- Hvis du ikke kan installere pakke **sodium** , installer **libsodium-wrappers** i stedet for.
```bat
npm afinstaller natrium
npm installer libsodium-wrappers@latest --save
```
- Hvis du ikke kan afspille din musik, eller musikafspilningskommandoer ikke virker, skal du installere [ffmpeg](https://ffmpeg.org/download.html) **(anbefalet)** eller installere **ffmpeg-static** -pakken og prøve igen.
```bat
npm installer ffmpeg-static@latest --save
```

## kredit

Tak til alle originale skabere for at tillade brugen af disse vidunderlige værker.

Avatar tegning af: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## fundet et problem

Hvis du støder på problemer fra dit nuværende arbejde Du kan fortælle os det via fanen [udgave](https://github.com/Maseshi/Shioru/issues) i dette lager.
