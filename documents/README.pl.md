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

Twój dobry asystent serwera sprawi, że Twój serwer będzie wyglądał bardziej żywo. Potrafi robić wiele rzeczy, a szczegółowe informacje o różnych komendach można znaleźć, wpisując `/help` Możesz zaprosić Shioru do dołączenia do twojego serwera z[tutaj](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Cechy

- Działa na [Discord.js](https://discord.js.org/) v14.
- Możliwość dostosowania różnych pożądanych elementów
- Muzykę można odtwarzać z [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) i [SoundCloud](https://soundcloud.com/) z automatycznym odtwarzaniem.
- รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์ภาษา](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json)ของที่เก็บนี้
- System poziomów (poziom i doświadczenie)
- Obsługa dostosowywania powiadomień serwera
- Możesz rozmawiać, wpisując `@Shioru` , a następnie wiadomość, którą chcesz przekazać.
- Można użyć polecenia aplikacji (/).

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## ปรับปรุงการแปล

คุณสามารถช่วยเราแปลภาษาที่มีอยู่หรือภาษาที่ยังไม่พร้อมใช้งานในขณะนี้ได้ที่ [Crowdin](https://crowdin.com/project/shioru).

## Wymagania wstępne

- [Node.js](https://nodejs.org/) w wersji 18.0.0 lub nowszej
- [Firebase](https://firebase.google.com/) w wersji 9.0.0 lub nowszej
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Podręcznik szybkiej obsługi

### Zaczynaj

- Idź do [Portal deweloperów Discord](https://discord.com/developers/applications)
- Kliknij **„Nowa aplikacja”** i nadaj swojemu botowi nazwę oraz zaakceptuj zasady polityki Discord.
- Przejdź do strony **„Bot”** i włącz wszystkie opcje w sekcji **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Zaproś swojego bota na serwer wchodząc na stronę **OAuth2 > Generator URL** wybierz `bot` i `application.commands` wybierz `Administrator` następnie skopiuj link i wklej go w adres swojej przeglądarki. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Skonfiguruj bota

- Uruchom terminal i uruchom następujące polecenie.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install autoconf automake g++ libtool build-essential
```

```bat
git klon https://github.com/Maseshi/Shioru.git
cd Shioru
npm zainstaluj --save
```

- คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ `./source/configs/data.js`

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
- หากคุณไม่สามารถเล่นเพลงหรือคำสั่งเล่นเพลงไม่ทำงาน ให้ติดตั้ง [FFmpeg](https://ffmpeg.org/download.html) **(แนะนำ)** หรือติดตั้งแพ็คเกจ **ffmpeg-static** แล้วลองใหม่อีกครั้ง
```bat
npm install ffmpeg-static@latest --save
```

## kredyt

Dziękuję wszystkim oryginalnym twórcom za umożliwienie korzystania z tych wspaniałych dzieł.

Rysunek awatara autorstwa: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## znalazł problem

Jeśli napotkasz jakiekolwiek problemy z Twojej obecnej pracy Możesz nas o tym powiadomić za pomocą zakładki [problem](https://github.com/Maseshi/Shioru/issues) tego repozytorium.
