<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/apple-icon.png" width="100" style="border-radius: 100%;" />
  <strong>
    <h1>Shioru</h1>
    <p>Personal assistants in Discord that will help make your guild a better place.</p>
  </strong>
  <img src="https://img.shields.io/badge/discord.js-14-blue?logo=discord&logoColor=white
  " />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru?logo=github
  " />
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json&query=status.indicator&logo=google-cloud&logoColor=white&label=status&link=https%3A%2F%2Fshioru.statuspage.io%2F
  " />
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

[Switch Languages](https://github.com/Maseshi/Shioru/tree/main/documents)

Your best personal assistants will help your guild look more lively. She can do so many things that you can easily see detailed information on all commands by typing `/help`.

<div align="center">
  <a href="https://shiorus.web.app/invite">
    <img src="https://img.shields.io/badge/Invite_Bot-_?style=for-the-badge&logo=discord&logoColor=white&color=blue
    " />
  </a>
</div>

## ✨ Outstanding features

- Works on [Discord.js](https://discord.js.org/) v14
- A wide variety of customizations can be made.
- It can play music from [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) and [SoundCloud](https://soundcloud.com/), with an automatic playback feature.
- Support for multiple languages, You can check the supported languages from the [language file](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json) of this repository.
- Tier system (level and experience)
- Support customization of server notifications
- You can chat by typing `@Shioru` followed by the message you wish to communicate.
- Able to use application commands (/)
- Simulate a database system for testing
- Supports working on shards

And many other interesting features...

## 🧩 Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [Python](https://www.python.org/downloads/) v3.8.0 or higher
- [Java](https://www.oracle.com/java/technologies/downloads/) v11.0.0 or higher
- [Firebase Tools](https://firebase.google.com/docs/cli)
- [Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
- [FFmpeg](https://ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## ⌛ Installation

### 1. Install **Build Tools**

Install **Build tools** by running the following command according to your operating system.

- For Linux and MacOS operating systems

  ```sh
  sudo apt update
  sudo apt install build-essential
  ```

- For Windows operating system
  ```sh
  npm install --global --production --add-python-to-path windows-build-tools
  ```

> [!TIP]
> You can skip this step by checking the **Automatically install the necessary tools** option through the Node.js installer as shown in the following image.
>
> ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

### 2. Clone the bot and install the components.

- Launch a terminal and run the following command.
  ```bat
  git clone https://github.com/Maseshi/Shioru.git
  cd Shioru
  npm install
  ```
- Change the file name `.env.example` to `.env` and enter all required values.

> [!NOTE]
> You can edit some data in **config** at [./source/configs/data.js](./source/configs/data.js).

### 3. Setup bot and invite to join.

- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Click **"New Application"** and name your bot and accept the Discord policy rules.
- Go to the **"Bot"** page and enable all options in the **Privileged Gateway Intent** section.
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Invite your bot to the server by going to the **OAuth2 > URL Generator** page, selecting `bot` and `applications.commands`, selecting `Administrator`, then copy the link and paste it in the browser address bar. Your sir
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### 4. Setup database

- Go to https://firebase.google.com/ and start setting up the project.
- Add a new project and follow the steps.
- Add your first application with **Website** Name your app without needing to select the **"Also set up Firebase Hosting for this app."** option and register the app.
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase will provide you with information about its configuration. Apply these values to the file. `.env`
- Go to **Build > [Realtime Database](https://console.firebase.google.com/u/0/project/_/database/data)** to create a database for storing data.

## 🪛 Development

- Open a terminal and run `npm run emulators` to simulate the database system in **dev mode**.
- Open a new terminal and run the command `npm run dev`.

> [!NOTE]
> When you enter development mode. Some features may be disabled, such as sending statistics, updating data, etc.

## ☕ Serve

Test the actual use by performing tasks similar to real use. The system will automatically calculate the split of the work fraction according to the number of guilds.

- Open a terminal and run `npm run emulators` to simulate the database system in **emulation mode**.
- Open a new terminal and run the command `npm run serve`.

> [!NOTE]
> You will automatically enter development mode as this is a production simulation. Cause some features may not work.

## 🍵 Production

For actual use, the prepared command or set of commands can be used normally as follows:

- On Linux or MacOS

  ```sh
  # with command file (recommend)

  sh start.sh || sudo sh start.sh

  # or with call command

  npm start
  ```

- On Windows

  ```bat
  @REM with command file (recommend)

  ./start.bat

  @REM or with call command

  npm start
  ```

### 🐳 Running on Docker

This operation requires [Docker](https://www.docker.com/products/docker-desktop/)

- Use the command `npm run docker:build` and wait for all the work to complete.
- Then open the Docker program and run it with the required environment information (env) or use the command `npm run docker:run` and wait until the bot is running.

> [!TIP]
> You can check the functionality using the command `docker ps -a`.

## ⚡ Quick Troubleshooting

- `gyp ERR! stack Error: not found: make`

  This problem may be caused by **Build tools** being installed incorrectly or may not have been installed yet. This problem can be solved by looking at the [installation](#1-install-build-tools) section.

- `GrpcConnection RPC 'Write' stream 0x58a118ce error. Code: 14 Message: 14 UNAVAILABLE: No connection established. Last error: connect ECONNREFUSED 127.0.0.1:8080`

  It is possible that you have not yet simulated the database system on the machine in test mode. You can solve this problem by closing the bot and running the following command on another page.

  ```bat
  npm run emulators
  ```

## 🌐 Improve Translate

You can help us translate existing languages or languages that are not currently available on [Crowdin](https://crowdin.com/project/shioru).

## ⚠️ Found a problem

If you encounter any problems from your current job You can let us know through the tab. [issue](https://github.com/Maseshi/Shioru/issues) of this repository.
