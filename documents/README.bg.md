<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <h1>
    <strong>Шиору</strong>
  </h1>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru">
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru">
  <a title="Статус" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Топ.гг" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[BG](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Вашият добър асистент на сървъра ще помогне на вашия сървър да изглежда по-оживен. Тя може да прави много неща, за които можете да намерите подробна информация за различни команди, като напишете `/help` Можете да поканите Shioru да се присъедини към вашия сървър от[тук](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Характеристика

- Работи на [Discord.js](https://discord.js.org/) v14.
- Възможност за персонализиране на различни желани елементи
- Музиката може да се възпроизвежда от [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) и [SoundCloud](https://soundcloud.com/) с автоматично възпроизвеждане.
- Поддръжка на множество езици Можете да проверите поддържаните езици от[езикови](https://github.com/Maseshi/shioru/blob/main/source/languages)файлове на това хранилище.
- Система на нива (ниво и опит)
- Поддръжка за персонализиране на известията на сървъра
- Можете да говорите, като напишете `@Shioru` , последвано от съобщението, което искате да комуникирате.
- Може да се използва командата на приложението (/).

и много други интересни функции...

## Подобрете Преводач

Можете да ни помогнете да преведем съществуващ език или език, който в момента не е наличен в [Crowdin](https://crowdin.com/project/shioru-bot).

## Предпоставки

- [Node.js](https://nodejs.org/) v18.0.0 или по-нова версия
- [Firebase](https://firebase.google.com/) v9.0.0 или по-нова версия
- [Git](https://git-scm.com/downloads)

## Ръководство за бързо инсталиране

### Първи стъпки

- Отидете на [Портал за разработчици на Discord](https://discord.com/developers/applications)
- Щракнете върху **„Ново приложение“** и дайте име на своя бот и приемете правилата на правилата на Discord.
- Отидете на страница **„Бот“** и активирайте всички опции в раздел **Привилегировано намерение за шлюз** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Поканете вашия бот към сървъра, като отидете на страница **OAuth2 > URL генератор** изберете `бот` и `applications.commands` изберете `Администратор` след това копирайте връзката и я поставете в адреса на вашия браузър. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Настройте бот

- Стартирайте терминал и изпълнете следната команда.

```bash
git клонинг https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- Можете да промените някои данни в **config** в `./source/config.js`

### Настройте Firebase

- Отидете на https://firebase.google.com/ и започнете да настройвате проекта.
- Добавете нов проект и следвайте стъпките.
- Добавете първото си приложение с **Уебсайт** Наименувайте приложението си по избор **„Също така настройте Firebase хостинг за това приложение“** и регистрирайте приложението. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase ще ви предостави информация за конфигурацията. Приложете тези стойности към файл `.env.example`
- Отидете на **създаване > [база данни в реално време](https://console.firebase.google.com/u/0/project/_/database/data)** , за да създадете база данни за съхранение.

### развиват се

- Преименувайте файла `.env.example` на `.env` и вмъкнете всички необходими стойности.
- Отидете до терминала и изпълнете командите `npm run dev` за разработка и `npm start` за производство > **Забележка**: Когато сте в режим на разработка Някои функции може да не работят.

## Бързо отстраняване на неизправности

- Ако не можете да инсталирате пакет **sodium** , вместо това инсталирайте **libsodium-wrappers**.
```bat
npm деинсталиране на натрий
npm инсталиране на libsodium-wrappers@latest --save
```
- Ако не можете да възпроизвеждате музиката си или командите за възпроизвеждане на музика не работят, инсталирайте [ffmpeg](https://ffmpeg.org/download.html) **(препоръчително)** или инсталирайте пакета **ffmpeg-static** и опитайте отново.
```bat
npm инсталирайте ffmpeg-static@latest --save
```

## кредит

Благодарим на всички оригинални творци, че позволиха използването на тези ваши прекрасни произведения.

Рисунка на аватар от: [夏月 まりな (НАЦУКИ МАРИНА)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## намери проблем

Ако срещнете някакви проблеми от текущата ви работа Можете да ни уведомите чрез раздела [проблем](https://github.com/Maseshi/Shioru/issues) на това хранилище.
