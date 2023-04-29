<div align="center">
    <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
    <h1>
        <strong>Shioru</strong>
    </h1>
    <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white&style=for-the-badge" />
    <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github&style=for-the-badge" />
    <img src="https://img.shields.io/github/v/release/Maseshi/Shioru?&style=for-the-badge">
    <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github&style=for-the-badge" />
    <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru?style=for-the-badge">
    <a title="Status" target="_blank" href="https://shioru.statuspage.io/">
        <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&style=for-the-badge&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
    </a>
    <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru-bot">
      <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
    </a>
    <a href="https://www.codefactor.io/repository/github/maseshi/shioru">
      <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
    </a>
</div>

[EN](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Your good server assistant will help make your server look more lively. She can do a number of things, where you can view detailed information for the commands by typing `/help`, You can [invite Shioru to your server from here](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you).

## Outstanding features

- Works on [Discord.js](https://discord.js.org/) v14
- A wide variety of customizations can be made.
- It can play music from [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) and [SoundCloud](https://soundcloud.com/), with an automatic playback feature.
- Support for multiple languages You can check the supported languages from the [language file](https://github.com/Maseshi/Shioru/blob/main/source/languages) of this repository.
- Tier system (level and experience)
- Support customization of server notifications
- You can chat by typing `@Shioru` followed by the message you wish to communicate.
- Able to use application commands (/)

And many other interesting features...

## Improve Translate

You can help us translate existing languages or languages that are not currently available on [Crowdin](https://crowdin.com/project/shioru-bot).

## Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [Firebase](https://firebase.google.com/) v9.0.0 or higher
- [FFmpeg](https://ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Quick setup guide

### Get started

- Go to the [Discord Developer Portal](https://discord.com/developers/applications)
- Click **"New Application"** and give your bot a name and accept the Discord policy rules.
- Go to the **"Bot"** page and enable all options in the **Privileged Gateway Intents** section.
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Invite your bot to the server by going to the **OAuth2 > URL Generator** page, selecting `bot` and `applications.commands` selecting `Administrator`. Then copy the link and paste it on your browser's address.
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Setup a bot

- Launch a terminal and run the following commands.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- You can edit some data in **config** at `./source/config.js`.

### Setup Firebase

- Go to https://firebase.google.com/ and start setting up the project.
- Add a new project and go through the steps.
- Add your first application with **Website**, name your app without the need to select **"Also set up Firebase Hosting for this app."** and register the app.
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase will provide you with information about the configuration. Apply these values to the `.env.example` file.
- Go to **Build > [Realtime Database](https://console.firebase.google.com/u/0/project/_/database/data)** to create a database for storing data.

### Development

- Rename the `.env.example` file to `.env` and add all values.
- Go to terminal and run `npm run dev` for development and `npm start` for production.
  > **NOTE**: When in development mode Some features may not work.

## Quick Troubleshooting

- If you can't install the **sodium** dependency, install **libsodium-wrappers** instead.

```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```

- If you can't play music or music playback commands are not working, install [ffmpeg](https://ffmpeg.org/download.html) **(recommended)** or install the **ffmpeg-static** package. and try again

```bat
npm install ffmpeg-static@latest --save
```

## Credits

Thank you to all the original creators for allowing us to use these wonderful works of yours.

Personal drawing by: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## Found a problem

If you encounter any problems from your current job You can let us know through the tab. [issue](https://github.com/Maseshi/Shioru/issues) of this repository.

## Google Translate

The content of this document has been translated by the [Google Translate](https://translate.google.com/) service. We apologize for any errors.
