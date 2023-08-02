<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <strong>
    <h1>Shioru</h2>
    <p>Assistants within your Discord server will help make your server a better place to live.</p>
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

Your good server assistant will help make your server look more lively. She can do a number of things, where you can view detailed information for the commands by typing `/help`, You can [invite Shioru to your server from here](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you).

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## Outstanding features

- Works on [Discord.js](https://discord.js.org/) v14
- A wide variety of customizations can be made.
- It can play music from [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) and [SoundCloud](https://soundcloud.com/), with an automatic playback feature.
- Support for multiple languages You can check the supported languages from the [language file](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json) of this repository.
- Tier system (level and experience)
- Support customization of server notifications
- You can chat by typing `@Shioru` followed by the message you wish to communicate.
- Able to use application commands (/)

And many other interesting features...

## Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Quick setup guide

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- Go to the [Discord Developer Portal](https://discord.com/developers/applications)
- Click **"New Application"** and give your bot a name and accept the Discord policy rules.
- Go to the **"Bot"** page and enable all options in the **Privileged Gateway Intents** section. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Invite your bot to the server by going to the **OAuth2 > URL Generator** page, selecting `bot` and `applications.commands` selecting `Administrator`. Then copy the link and paste it on your browser's address. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Setup a bot

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

- Launch a terminal and run the following commands.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- You can edit some data in **config** at `./source/configs/data.js`.

### Setup Firebase

- Go to https://firebase.google.com/ and start setting up the project.
- Add a new project and go through the steps.
- Add your first application with **Website**, name your app without the need to select **"Also set up Firebase Hosting for this app."** and register the app. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase will provide you with information about the configuration. Apply these values to the `.env.example` file.
- Go to **Build > [Realtime Database](https://console.firebase.google.com/u/0/project/_/database/data)** to create a database for storing data.

### Development

- Rename the `.env.example` file to `.env` and add all values.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## Quick Troubleshooting

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- If you can't install the **sodium** dependency, install **libsodium-wrappers** instead.
```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```
- If you can't play music or music playback commands are not working, install [FFmpeg](https://ffmpeg.org/download.html) **(recommended)** or install the **ffmpeg-static** package.
```bat
npm install ffmpeg-static@latest --save
```

## Improve Translate

You can help us translate existing languages or languages that are not currently available on [Crowdin](https://crowdin.com/project/shioru).

## Credits

Thank you to all the original creators for allowing us to use these wonderful works of yours.

Personal drawing by: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## Found a problem

If you encounter any problems from your current job You can let us know through the tab. [issue](https://github.com/Maseshi/Shioru/issues) of this repository.
