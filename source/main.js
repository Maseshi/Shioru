/**
 * @license
 * MIT License
 * 
 * Copyright (c) 2020 Chaiwat Suwannarat
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const { generateDependencyReport } = require("@discordjs/voice");
const { OpenAIApi, Configuration } = require("openai");
const { DisTube, StreamType } = require("distube");
const { DeezerPlugin } = require("@distube/deezer");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { resolve } = require("node:dns");
const { initializeApp } = require("firebase/app");
const { ansiColor } = require("./utils/consoleUtils");
const { version } = require("../package.json");
const Spinnies = require("spinnies");
const config = require("./configs/data");
const language = require("./languages/en-US.json");

// Start detecting working time
const startTime = new Date().getTime();

const clearStyle = ansiColor(0, "sgr");
const underlineStyle = ansiColor(4, "sgr");
const yellowColor = ansiColor(11, "foreground");
const blueBrightColor = ansiColor(33, "foreground");

console.info(blueBrightColor + "  ███████╗██╗  ██╗██╗ ██████╗ ██████╗ ██╗   ██╗  v" + clearStyle);
console.info(blueBrightColor + "  ██╔════╝██║  ██║██║██╔═══██╗██╔══██╗██║   ██║  " + version.charAt(0) + clearStyle);
console.info(blueBrightColor + "  ███████╗███████║██║██║   ██║██████╔╝██║   ██║  " + version.charAt(1) + clearStyle);
console.info(blueBrightColor + "  ╚════██║██╔══██║██║██║   ██║██╔══██╗██║   ██║  " + version.charAt(2) + clearStyle);
console.info(blueBrightColor + "  ███████║██║  ██║██║╚██████╔╝██║  ██║╚██████╔╝  " + version.charAt(3) + clearStyle);
console.info(blueBrightColor + "  ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   " + version.charAt(4) + clearStyle);
console.info("Copyright (C) 2020-2023 Chaiwat Suwannarat. All rights reserved.");
console.info("Website: https://shiorus.web.app/, License: MIT, CC0-1.0");
console.info();

/**
 * Check the work system from the script in packages.json.
 * Example of use in development mode: npm run dev
 * Production mode is "start"
 * Development mode is "dev"
 */
if (process.env.npm_lifecycle_event && process.env.npm_lifecycle_event === "dev") {
    console.info(yellowColor + "┏━━━━━━━━━━━━━━━ DEVELOPMENT MODE ━━━━━━━━━━━━━━━┓" + clearStyle);
    console.info(yellowColor + "┃                                                ┃" + clearStyle);
    console.info(yellowColor + "┃   When in development mode some features may   ┃" + clearStyle);
    console.info(yellowColor + "┃      not work, you can restart your system     ┃" + clearStyle);
    console.info(yellowColor + "┃    immediately by typing " + underlineStyle + "rs" + clearStyle + yellowColor + " on the terminal.   ┃" + clearStyle);
    console.info(yellowColor + "┃                                                ┃" + clearStyle);
    console.info(yellowColor + "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛" + clearStyle);
    console.info();
    console.info("# Voice Dependency Report");
    console.info(generateDependencyReport());
    console.info();
}

// Check environnement
if (!config.openai.config.apiKey) return console.error("[ENV] OPENAI_API_KEY It needs to be set up in the environment.");
if (!config.openai.config.basePath) return console.error("[ENV] OPENAI_BASE_PATH It needs to be set up in the environment.");
if (!config.server.apiKey) return console.error("[ENV] API_KEY It needs to be set up in the environment.");
if (!config.server.authDomain) return console.error("[ENV] AUTH_DOMAIN It needs to be set up in the environment.");
if (!config.server.databaseURL) return console.error("[ENV] DATABASE_URL It needs to be set up in the environment.");
if (!config.server.projectId) return console.error("[ENV] PROJECT_ID It needs to be set up in the environment.");
if (!config.server.storageBucket) return console.error("[ENV] STORAGE_BUCKET It needs to be set up in the environment.");
if (!config.server.messagingSenderId) return console.error("[ENV] MESSAGING_SENDER_ID It needs to be set up in the environment.");
if (!config.server.appId) return console.error("[ENV] APP_ID It needs to be set up in the environment.");
if (!config.server.measurementId) return console.error("[ENV] MEASUREMENT_ID It needs to be set up in the environment.");
if (!config.token) return console.error("[ENV] TOKEN It needs to be set up in the environment.");

// Client setup
const client = new Client({
    "shards": "auto",
    "allowedMentions": {
        "parse": [
            "roles",
            "users"
        ],
        "repliedUser": true
    },
    "partials": [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember
    ],
    "presence": {
        "status": "dnd",
        "afk": true,
        "activities": [
            {
                "name": "information of each server",
                "type": ActivityType.Watching
            }
        ]
    },
    "intents": [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
});

// Configure in client
client.api = {};
client.temp = {};
client.commands = new Collection();
client.contexts = new Collection();
client.mode = process.env.npm_lifecycle_event || "start";
client.config = config;
client.startup = {
    "start": startTime,
    "end": 0
};
client.console = new Spinnies({
    "color": "white",
    "succeedColor": "green",
    "failColor": "red",
    "spinnerColor": "white",
    "succeedPrefix": "( ✅ )",
    "failPrefix": "( ❌ )",
    "spinner": {
        "interval": 100,
        "frames": [
            "( 🕐 )",
            "( 🕑 )",
            "( 🕒 )",
            "( 🕓 )",
            "( 🕔 )",
            "( 🕕 )",
            "( 🕖 )",
            "( 🕗 )",
            "( 🕘 )",
            "( 🕙 )",
            "( 🕚 )",
            "( 🕛 )"
        ]
    },
    "disableSpins": false
});
client.translate = language;
client.music = new DisTube(client, {
    "plugins": [
        new DeezerPlugin(),
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
        new YtDlpPlugin({ "update": false })
    ],
    "leaveOnStop": false,
    "youtubeIdentityToken": client.config.server.apiKey,
    "customFilters": client.config.filters,
    "ytdlOptions": {
        "highWaterMark": 1 << 24
    },
    "streamType": StreamType.OPUS
});

if (client.config.openai.config.apiKey && client.config.openai.enable) {
    client.ai = new OpenAIApi(
        new Configuration({
            "apiKey": client.config.openai.config.apiKey,
            "basePath": client.config.openai.config.basePath
        })
    );
} else {
    console.info("[ChatSystem] Use native chat system (v1) because OpenAI API key is not found or not enable.");
}

// Read the content file in the handlers.
const handlersPath = join(__dirname, "handlers");
const handlerFiles = readdirSync(handlersPath);

for (const handler of handlerFiles) {
    require(handlersPath + "/" + handler)(client);
}

// Check internet connection.
client.console.add("check-internet-connection", {
    "text": "Checking connection to server"
});

if (process.env.CHECK_CONNECTION) {
    // Start connecting to the server.
    initializeApp(client.config.server);

    // Start logging in and working
    client.login(client.config.token);

    client.console.succeed("check-internet-connection", {
        "text": "Connected to the Discord server and signed in."
    });
} else {
    resolve("discord.com", (error) => {
        if (error) {
            // If unable to connect to the internet
            client.console.fail("check-internet-connection", {
                "text": "Unable to connect to Discord server"
            });
        } else {
            // Start connecting to the server.
            initializeApp(client.config.server);

            // Start logging in and working
            client.login(client.config.token);

            client.console.succeed("check-internet-connection", {
                "text": "Connected to the Discord server and signed in."
            });
        }
    });
}
