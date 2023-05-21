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
  <a title="Topp.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[NO](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Din gode serverassistent vil hjelpe serveren din til å se mer livlig ut. Hun kan gjøre mange ting som du kan finne detaljert informasjon om forskjellige kommandoer ved å skrive `/help` Du kan invitere Shioru til å bli med på serveren din fra[her](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Egenskaper

- Fungerer på [Discord.js](https://discord.js.org/) v14.
- Kunne tilpasse en rekke ønskede elementer
- Musikk kan spilles fra [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) og [SoundCloud](https://soundcloud.com/) med automatisk avspilling.
- Støtte flere språk Du kan sjekke de støttede språkene fra[språk](https://github.com/Maseshi/shioru/blob/main/source/languages)-filer i dette depotet.
- Tier system (nivå og erfaring)
- Støtte for tilpasning av servervarsling
- Du kan snakke ved å skrive `@Shioru` etterfulgt av meldingen du vil kommunisere.
- Programkommandoen (/) kan brukes.

og mange andre interessante funksjoner...

## Forbedre Oversett

Du kan hjelpe oss med å oversette et eksisterende språk eller et språk som for øyeblikket ikke er tilgjengelig på [Crowdin](https://crowdin.com/project/shioru-bot).

## Forutsetninger

- [Node.js](https://nodejs.org/) v18.0.0 eller nyere
- [Firebase](https://firebase.google.com/) v9.0.0 eller nyere
- [Git](https://git-scm.com/downloads)

## Hurtigoppsettguide

### Kom i gang

- Gå til [Discord Developer Portal](https://discord.com/developers/applications)
- Klikk **"Ny applikasjon"** og navngi boten din og godta Discord-policyreglene.
- Gå til side **"Bot"** og aktiver alle alternativene i seksjon **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Inviter boten din til serveren ved å gå til side **OAuth2 > URL Generator** velg `bot` og `applications.commands` velg `Administrator` og kopier koblingen og lim den inn i nettleserens adresse. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Sett opp en bot

- Start en terminal og kjør følgende kommando.

```bash
git klone https://github.com/Maseshi/Shioru.git
cd Shioru
npm installer --lagre
```

- Du kan endre noen data i **config** på `./source/config.js`

### Konfigurer Firebase

- Gå til https://firebase.google.com/ og begynn å sette opp prosjektet.
- Legg til et nytt prosjekt og følg trinnene.
- Legg til din første applikasjon med **Nettsted** Gi appen et navn valgfritt **"Konfigurer også Firebase Hosting for denne appen"** og registrer appen. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase vil gi deg informasjon om konfigurasjonen. Bruk disse verdiene på fil `.env.example`
- Gå til **opprette > [sanntidsdatabase](https://console.firebase.google.com/u/0/project/_/database/data)** for å opprette en lagringsdatabase.

### utvikle

- Gi nytt navn til filen `.env.example` til `.env` og sett inn alle nødvendige verdier.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Rask feilsøking

- Hvis du ikke kan installere pakke **sodium** , installer **libsodium-wrappers** i stedet.
```bat
npm avinstaller natrium
npm installer libsodium-wrappers@latest --save
```
- Hvis du ikke kan spille musikk eller musikkavspillingskommandoer ikke fungerer, installer [ffmpeg](https://ffmpeg.org/download.html) **(anbefalt)** eller installer **ffmpeg-static** -pakken og prøv igjen.
```bat
npm installer ffmpeg-static@latest --save
```

## kreditt

Takk til alle originale skapere for å tillate bruken av disse fantastiske verkene dine.

Avatartegning av: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## funnet et problem

Hvis du støter på problemer fra ditt nåværende arbeid Du kan gi oss beskjed gjennom [utgave](https://github.com/Maseshi/Shioru/issues) fanen i dette depotet.
