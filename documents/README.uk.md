<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <h1>
    <strong>Шіору</strong>
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

[EN](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Ваш хороший серверний помічник допоможе вашому серверу виглядати жвавіше. Вона може робити багато речей, про які ви можете знайти детальну інформацію про різні команди, ввівши `/help` Ви можете запросити Шіору приєднатися до вашого сервера з[тут](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## особливості

- Працює на [Discord.js](https://discord.js.org/) v14.
- Можливість налаштування різноманітних бажаних елементів
- Музику можна відтворювати з [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) і [SoundCloud](https://soundcloud.com/) із автоматичним відтворенням.
- Підтримка кількох мов Ви можете перевірити підтримувані мови у файлах[мови](https://github.com/Maseshi/shioru/blob/main/source/languages)цього репозиторію.
- Ярусна система (рівень і досвід)
- Підтримка налаштування сповіщень сервера
- Ви можете говорити, ввівши `@Shioru` , а потім повідомлення, яке хочете надіслати.
- Можна використовувати команду програми (/).

та багато інших цікавих функцій...

## Покращити Перекладач

Ви можете допомогти нам перекласти існуючу мову або мову, яка зараз недоступна на [Crowdin](https://crowdin.com/project/shioru-bot).

## передумови

- [Node.js](https://nodejs.org/) версії 18.0.0 або новішої
- [Firebase](https://firebase.google.com/) версії 9.0.0 або новішої
- [Git](https://git-scm.com/downloads)

## Посібник із швидкого налаштування

### Почати

- Перейдіть на [портал розробників Discord](https://discord.com/developers/applications)
- Натисніть **«Нова програма»** , назвіть свого бота та прийміть правила політики Discord.
- Перейдіть на сторінку **«Бот»** і ввімкніть усі параметри в розділі **Привілейований шлюз Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Запросіть свого бота на сервер, перейшовши на сторінку **OAuth2 > Генератор URL-адрес** виберіть `бот` і `applications.commands` виберіть `Адміністратор` , потім скопіюйте посилання та вставте його в адресу свого браузера. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Налаштувати бота

- Запустіть термінал і виконайте таку команду.

```bash
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- Ви можете змінити деякі дані в **конфігурації** у `./source/config.js`

### Налаштуйте Firebase

- Перейдіть на сторінку https://firebase.google.com/ і почніть налаштування проекту.
- Додайте новий проект і виконайте вказівки.
- Додайте свою першу програму за допомогою **Веб-сайт** Назвіть програму за бажанням **«Також налаштуйте Firebase Hosting для цієї програми»** і зареєструйте програму. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase надасть вам інформацію про конфігурацію. Застосуйте ці значення до файлу `.env.example`
- Перейдіть до **створити > [базу даних у реальному часі](https://console.firebase.google.com/u/0/project/_/database/data)** , щоб створити базу даних для зберігання.

### розвивати

- Перейменуйте файл `.env.example` на `.env` і вставте всі необхідні значення.
- Перейдіть до терміналу та виконайте команди `npm run dev` для розробки та `npm start` для виробництва > **Примітка**: у режимі розробки Деякі функції можуть не працювати.

## Швидке усунення несправностей

- Якщо ви не можете встановити пакет **sodium** , замість цього встановіть **libsodium-wrappers**.
```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```
- Якщо ви не можете відтворити музику або команди відтворення музики не працюють, інсталюйте [ffmpeg](https://ffmpeg.org/download.html) **(рекомендовано)** або інсталюйте пакет **ffmpeg-static** і повторіть спробу.
```bat
npm install ffmpeg-static@latest --save
```

## кредит

Дякуємо всім оригінальним творцям за те, що дозволили використовувати ці ваші чудові роботи.

Намалював аватар: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## знайшов проблему

Якщо у вас виникнуть проблеми з вашої поточної роботи Ви можете повідомити нам про це на вкладці [випуск](https://github.com/Maseshi/Shioru/issues) цього репозиторію.
