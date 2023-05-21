<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <h1>
    <strong>Šioru</strong>
  </h1>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru">
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru">
  <a title="Būsena" target="_blank" href="https://shioru.statuspage.io/">
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

[LT](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Jūsų geras serverio padėjėjas padės jūsų serveriui atrodyti gyvesniam. Ji gali padaryti daug dalykų, kuriuos galite rasti išsamią informaciją apie įvairias komandas, įvesdami `/help` Galite pakviesti Shioru prisijungti prie jūsų serverio iš[čia](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## funkcijos

- Veikia su [Discord.js](https://discord.js.org/) v14.
- Galiu pritaikyti įvairius norimus elementus
- Muziką galima leisti iš [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) ir [SoundCloud](https://soundcloud.com/) su automatiniu atkūrimu.
- Palaikykite kelias kalbas Palaikomas kalbas galite patikrinti šios saugyklos[kalbos faile](https://github.com/Maseshi/shioru/blob/main/source/languages).
- Pakopų sistema (lygis ir patirtis)
- Serverio pranešimų tinkinimo palaikymas
- Galite kalbėti įvesdami `@Shioru` , o po to pranešimo, su kuriuo norite susisiekti.
- Galima naudoti programos komandą (/).

ir daug kitų įdomių funkcijų...

## Tobulinti vertimą

Galite padėti mums išversti esamą kalbą arba kalbą, kurios šiuo metu nėra [Crowdin](https://crowdin.com/project/shioru-bot).

## Būtinos sąlygos

- [Node.js](https://nodejs.org/) v18.0.0 arba naujesnė versija
- [Firebase](https://firebase.google.com/) v9.0.0 arba naujesnė versija
- [Git](https://git-scm.com/downloads)

## Greitos sąrankos vadovas

### Pradėti

- Eikite į [Discord kūrėjų portalą](https://discord.com/developers/applications)
- Spustelėkite **„Nauja programa“** , pavadinkite savo robotą ir sutikite su „Discord“ politikos taisyklėmis.
- Eikite į **puslapį „Bot“** ir įjunkite visas parinktis **skyriuje „Privilegijuoto šliuzo tikslas** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Pakvieskite savo robotą į serverį eidami į puslapį **OAuth2 > URL generatorius** pasirinkite `bot` ir `Applications.commands` pasirinkite `Administratorius` tada nukopijuokite nuorodą ir įklijuokite ją į savo naršyklės adresą. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Nustatykite robotą

- Paleiskite terminalą ir paleiskite šią komandą.

```bash
git klonas https://github.com/Maseshi/Shioru.git
cd Shioru
npm įdiegti --save
```

- Kai kuriuos duomenis galite keisti **config** adresu `./source/config.js`

### Nustatykite „Firebase“.

- Eikite į https://firebase.google.com/ ir pradėkite nustatyti projektą.
- Pridėkite naują projektą ir atlikite nurodytus veiksmus.
- Pridėkite pirmąją programą naudodami **svetainės** Pavadinkite programą pasirinktinai **„Taip pat nustatykite šios programos „Firebase Hosting“** ir užregistruokite programą. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- „Firebase“ suteiks informacijos apie konfigūraciją. Taikykite šias reikšmes failui `.env.example`
- Eikite į **sukurti > [realaus laiko duomenų bazę](https://console.firebase.google.com/u/0/project/_/database/data)** norėdami sukurti saugojimo duomenų bazę.

### vystytis

- Pervardykite failą `.env.example` į `.env` ir įterpkite visas reikalingas reikšmes.
- Eikite į terminalą ir paleiskite komandas `npm paleisti dev` kūrimui ir `npm start` gamybai > ****pastaba : Kai įjungtas kūrimo režimas Kai kurios funkcijos gali neveikti.

## Greitas trikčių šalinimas

- Jei negalite įdiegti paketo **sodium** , vietoj to įdiekite **libsodium-wrappers**.
```bat
npm pašalinti natrio
npm įdiegti libsodium-wrappers@latest --save
```
- Jei negalite leisti muzikos arba muzikos atkūrimo komandos neveikia, įdiekite [ffmpeg](https://ffmpeg.org/download.html) **(rekomenduojama)** arba įdiekite paketą **ffmpeg-static** ir bandykite dar kartą.
```bat
npm įdiegti ffmpeg-static@latest --save
```

## kreditas

Dėkojame visiems originaliems kūrėjams už leidimą naudoti šiuos nuostabius jūsų kūrinius.

Avataro piešinys: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## rado problemą

Jei susidursite su problemomis iš dabartinio darbo Galite mums pranešti per šios saugyklos skirtuką [](https://github.com/Maseshi/Shioru/issues) leidimas.
