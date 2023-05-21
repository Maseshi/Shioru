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
  <a title="Tłum" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[PL](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [T](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Twój dobry asystent serwera sprawi, że Twój serwer będzie wyglądał bardziej żywo. Potrafi robić wiele rzeczy, a szczegółowe informacje o różnych komendach można znaleźć, wpisując `/help` Możesz zaprosić Shioru do dołączenia do twojego serwera z[tutaj](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Cechy

- Działa na [Discord.js](https://discord.js.org/) v14.
- Możliwość dostosowania różnych pożądanych elementów
- Muzykę można odtwarzać z [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) i [SoundCloud](https://soundcloud.com/) z automatycznym odtwarzaniem.
- Obsługa wielu języków Możesz sprawdzić obsługiwane języki z[plików językowych](https://github.com/Maseshi/shioru/blob/main/source/languages)tego repozytorium.
- System poziomów (poziom i doświadczenie)
- Obsługa dostosowywania powiadomień serwera
- Możesz rozmawiać, wpisując `@Shioru` , a następnie wiadomość, którą chcesz przekazać.
- Można użyć polecenia aplikacji (/).

i wiele innych ciekawych funkcji...

## Popraw tłumaczenie

Możesz pomóc nam przetłumaczyć istniejący język lub język, który nie jest obecnie dostępny w [Crowdin](https://crowdin.com/project/shioru-bot).

## Wymagania wstępne

- [Node.js](https://nodejs.org/) w wersji 18.0.0 lub nowszej
- [Firebase](https://firebase.google.com/) w wersji 9.0.0 lub nowszej
- [Git](https://git-scm.com/downloads)

## Podręcznik szybkiej obsługi

### Zaczynaj

- Idź do [Portal deweloperów Discord](https://discord.com/developers/applications)
- Kliknij **„Nowa aplikacja”** i nadaj swojemu botowi nazwę oraz zaakceptuj zasady polityki Discord.
- Przejdź do strony **„Bot”** i włącz wszystkie opcje w sekcji **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Zaproś swojego bota na serwer wchodząc na stronę **OAuth2 > Generator URL** wybierz `bot` i `application.commands` wybierz `Administrator` następnie skopiuj link i wklej go w adres swojej przeglądarki. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Skonfiguruj bota

- Uruchom terminal i uruchom następujące polecenie.

```bash
git klon https://github.com/Maseshi/Shioru.git
cd Shioru
npm zainstaluj --save
```

- Możesz zmodyfikować niektóre dane w **config** w `./source/config.js`

### Skonfiguruj Firebase

- Przejdź do https://firebase.google.com/ i rozpocznij konfigurowanie projektu.
- Dodaj nowy projekt i postępuj zgodnie z instrukcjami.
- Dodaj swoją pierwszą aplikację za pomocą **Witryna** Opcjonalnie nazwij swoją aplikację **„Skonfiguruj także Hosting Firebase dla tej aplikacji”** i zarejestruj aplikację. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase dostarczy Ci informacji o konfiguracji. Zastosuj te wartości do pliku `.env.example`
- Przejdź do **utwórz > [bazę danych czasu rzeczywistego](https://console.firebase.google.com/u/0/project/_/database/data)** , aby utworzyć bazę danych magazynu.

### rozwijać

- Zmień nazwę pliku `.env.example` na `.env` i wstaw wszystkie niezbędne wartości.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Szybkie rozwiązywanie problemów

- Jeśli nie możesz zainstalować pakietu **sodu** , zamiast tego zainstaluj **pakiety libsodium-wrappers**.
```bat
npm odinstaluj sód
npm zainstaluj libsodium-wrappers@latest --save
```
- Jeśli nie możesz odtwarzać muzyki lub polecenia odtwarzania muzyki nie działają, zainstaluj [ffmpeg](https://ffmpeg.org/download.html) **(zalecane)** lub zainstaluj pakiet **ffmpeg-static** i spróbuj ponownie.
```bat
npm install ffmpeg-static@latest --save
```

## kredyt

Dziękuję wszystkim oryginalnym twórcom za umożliwienie korzystania z tych wspaniałych dzieł.

Rysunek awatara autorstwa: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## znalazł problem

Jeśli napotkasz jakiekolwiek problemy z Twojej obecnej pracy Możesz nas o tym powiadomić za pomocą zakładki [problem](https://github.com/Maseshi/Shioru/issues) tego repozytorium.
