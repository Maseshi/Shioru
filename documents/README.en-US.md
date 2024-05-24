<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/apple-icon.png" width="100" alt="Shioru" />
  <strong>
    <h1>Shioru</h1>
    <p>Personal assistants in Discord that will help make your guild a better place.</p>
  </strong>
  <p>
    <a title="Discord.js v14" href="https://discord.js.org/">
      <img src="https://img.shields.io/badge/discord.js-14-blue?logo=discord&logoColor=white&style=for-the-badge" alt="Discord.js v14" />
    </a>
    <a title="Last commit" href="https://github.com/Maseshi/Shioru/commits/">
      <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru?logo=github&style=for-the-badge" alt="Last commit" />
    </a>
    <a title="Status" href="https://shioru.statuspage.io/">
      <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json&query=status.indicator&logo=google-cloud&logoColor=white&label=status&style=for-the-badge" alt="Status" />
    </a>
    <br />
    <a title="Crowdin" href="https://crowdin.com/project/shioru">
      <img src="https://badges.crowdin.net/shioru/localized.svg" alt="Crowdin" />
    </a>
    <a title="CodeFactor" href="https://www.codefactor.io/repository/github/maseshi/shioru">
      <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
    </a>
    <a title="Top.gg" href="https://top.gg/bot/704706906505347183">
      <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" alt="Top.gg" />
    </a>
  </p>
  <p>
    <a href="https://shiorus.web.app/invite">Add App</a>
    ·
    <a href="https://github.com/Maseshi/Shioru/tree/main/documents">Switch Languages</a>
    ·
    <a href="https://shioru.statuspage.io/">Status</a>
    ·
    <a href="https://crowdin.com/project/shioru">Improve Translation</a>
    ·
    <a href="https://top.gg/bot/704706906505347183">Rate It</a>
  </p>
</div>

Your best personal assistants will help your guild look more lively. She can do so many things that you can easily see detailed information on all commands by typing `/help`.

## ✨ Outstanding features

- [x] Worked on [Discord.js](https://discord.js.org/) v14
- [x] Easy to read, easy to use and highly effective
- [x] You can customize many things you want
- [x] Contains all commands including 100+ available subcommands
- [x] Can play music both from [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/), [SoundCloud](https://soundcloud.com/) and [900+ more Website](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) along with an automatic music playback system
- [x] Supports multiple languages. You can check the supported languages ​​from the [Language File](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json) of this repository.
- [x] Tier system (Level and experience)
- [x] Support for customizing server notifications
- [x] You can talk by typing `@Shioru` followed by the message you want to communicate
- [x] Supports working on Shards or supports working in various guilds
- [x] You can use application commands (`/`)
- [x] Simulate the database system for testing.

And many other interesting features...

## 🧩 Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [Firebase Tools](https://firebase.google.com/docs/cli) (requires [Java](https://www.oracle.com/java/technologies/downloads/) v11.0.0 or higher)
- [Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) (requires [Python](https://www.python.org/downloads/) v3.12.0 or higher)
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

## 🔥 Get started

There are several options available. If you are using [Visual Studio Code](https://code.visualstudio.com/), you can choose your method directly via the Run and Debug tab (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>). For other operations, see Tasks (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> and <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> type `>Tasks: Run Task`)

### 🪛 Development

- Open a terminal and run the command `npm run dev`.

### ☕ Serve

Test the actual use by performing tasks similar to real use. The system will automatically calculate the split of the work fraction according to the number of guilds.

- Open the terminal and add all the necessary environmental variables.
  - For Windows, use commands `set variable=example`
  - For Linux or MacOS, use the command `export variable=example`
- Run the command `npm run serve`.

> [!NOTE]
> You will enter automatic development mode because it is a real use. All data will not be recorded.

### 🍵 Production

For actual use, the prepared command or set of commands can be used normally as follows:

- On Linux or MacOS

  ```sh
  sh start.sh || sudo sh start.sh

  # or

  npm start
  ```

- On Windows

  ```bat
  ./start.bat

  @REM or

  npm start
  ```

### 🐳 Running on Docker

This operation requires [Docker](https://www.docker.com/products/docker-desktop/)

- Open the terminal and add all the necessary environmental variables.
  - For Windows, use commands `set variable=example`
  - For Linux or MacOS, use the command `export variable=example`
- Create an image using the command `npm run docker:build` or `npm run docker:build:serve` for the serve mode and wait until the process is finished.
- After creating the images successfully, run by using the command `npm run docker:build` or `npm run docker:build:serve` for the serve mode.

[Learn more about commands Docker](https://docs.docker.com/reference/)

## ⚡ Quick Troubleshooting

- `gyp ERR! stack Error: not found: make`

  This problem may be caused by **Build tools** being installed incorrectly or may not have been installed yet. This problem can be solved by looking at the [installation](#1-install-build-tools) section.

## 🌐 Improve Translate

You can help us translate existing languages or languages that are not currently available on [Crowdin](https://crowdin.com/project/shioru).

## ⚠️ Found a problem

If you encounter any problems from your current job You can let us know through the tab. [issue](https://github.com/Maseshi/Shioru/issues) of this repository.
