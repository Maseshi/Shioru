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
  <a title="Краудин" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="КодФактор" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="КодФактор" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

Ваш хороший помощник по серверу поможет вашему серверу выглядеть более живым. Она может делать много вещей, и вы можете найти подробную информацию о различных командах, набрав `/help` Вы можете пригласить Шиору присоединиться к вашему серверу из[здесь](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Функции

- Работает на [Discord.js](https://discord.js.org/) v14.
- Возможность настроить различные желаемые элементы
- Музыку можно воспроизводить с [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) и [SoundCloud](https://soundcloud.com/) с автоматическим воспроизведением.
- รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์ภาษา](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json)ของที่เก็บนี้
- Уровневая система (уровень и опыт)
- Поддержка настройки уведомлений сервера
- Вы можете говорить, набрав `@Shioru` , а затем сообщение, которое вы хотите передать.
- Можно использовать команду приложения (/).

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## ปรับปรุงการแปล

คุณสามารถช่วยเราแปลภาษาที่มีอยู่หรือภาษาที่ยังไม่พร้อมใช้งานในขณะนี้ได้ที่ [Crowdin](https://crowdin.com/project/shioru).

## ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v18.0.0 или выше
- [Firebase](https://firebase.google.com/) v9.0.0 или выше
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Руководство по быстрой установке

### เริ่มต้นใช้งาน

- Перейти на [Портал разработчиков Discord](https://discord.com/developers/applications)
- Нажмите **«Новое приложение»** , назовите своего бота и примите правила политики Discord.
- Перейдите на страницу **«Бот»** и включите все параметры в разделе **Намерение привилегированного шлюза** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Пригласите своего бота на сервер, перейдя на страницу **OAuth2 > Генератор URL-адресов** выберите `бот` и `application.commands` выберите `Администратор` затем скопируйте ссылку и вставьте ее в адрес вашего браузера. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Настроить бота

- Запустите терминал и выполните следующую команду.

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

### Настроить Firebase

- Перейдите на https://firebase.google.com/ и начните настройку проекта.
- Добавьте новый проект и следуйте инструкциям.
- Добавьте свое первое приложение с помощью **Веб-сайт** Назовите свое приложение по желанию **«Также настройте хостинг Firebase для этого приложения»** и зарегистрируйте приложение. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase предоставит вам информацию о конфигурации. Примените эти значения к файлу `.env.example`
- Перейдите к **, создайте > [базу данных реального времени](https://console.firebase.google.com/u/0/project/_/database/data)** , чтобы создать базу данных хранилища.

### развивать

- Переименуйте файл `.env.example` в `.env` и вставьте все необходимые значения.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Быстрое устранение неполадок

- Если вы не можете установить пакет **натрия** , установите вместо него **libsodium-wrappers**.
```bat
npm удалить натрий
npm установить libsodium-wrappers@latest --save
```
- หากคุณไม่สามารถเล่นเพลงหรือคำสั่งเล่นเพลงไม่ทำงาน ให้ติดตั้ง [FFmpeg](https://ffmpeg.org/download.html) **(แนะนำ)** หรือติดตั้งแพ็คเกจ **ffmpeg-static** แล้วลองใหม่อีกครั้ง
```bat
npm установить ffmpeg-static@latest --save
```

## кредит

Спасибо всем создателям за то, что разрешили использовать эти ваши замечательные работы.

Рисунок аватара: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## нашел проблему

Если вы столкнулись с какими-либо проблемами с вашей текущей работы Вы можете сообщить нам об этом через вкладку [выпуск](https://github.com/Maseshi/Shioru/issues) этого репозитория.
