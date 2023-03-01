// Start detecting working time
const startTime = new Date().getTime();

const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const { initializeApp } = require("firebase/app");
const { DisTube, StreamType } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { readdirSync } = require("node:fs");
const { version } = require("../package.json");
const { asciiArt, ansiColor } = require("./utils/consoleUtils");
const Spinnies = require("spinnies");
const config = require("./configs/data");
const language = require("./languages/en.json");

// Show when bots start working To check that bots do not have a problem
const clearStyle = ansiColor(0, "sgr");
const underlineStyle = ansiColor(4, "sgr");
const whiteColor = ansiColor(15, "foreground");
const yellowColor = ansiColor(11, "foreground");
const blueBrightColor = ansiColor(33, "foreground");

const textFormat = asciiArt.replace("%s1", "v")
    .replace("%s2", version.charAt(0))
    .replace("%s3", version.charAt(1))
    .replace("%s4", version.charAt(2))
    .replace("%s5", version.charAt(3))
    .replace("%s6", version.charAt(4));

console.info(blueBrightColor + textFormat + clearStyle);
console.info(whiteColor + "Copyright (C) 2020-2023 Chaiwat Suwannarat. All rights reserved." + clearStyle);
console.info(whiteColor + "Website: https://shiorus.web.app/ License: MIT\n" + clearStyle);

// ? Check the work system from the script in packages.json.
// Example of use in development mode: npm run dev
// Production mode is "start"
// Development mode is "dev"
if (process.env.npm_lifecycle_event && process.env.npm_lifecycle_event === "dev") {
    console.info(yellowColor + "┏━━━━━━━━━━━━━━ DEVELOPMENT MODE ━━━━━━━━━━━━━━┓" + clearStyle);
    console.info(yellowColor + "┃                                              ┃" + clearStyle);
    console.info(yellowColor + "┃  When in development mode some features may  ┃" + clearStyle);
    console.info(yellowColor + "┃     not work, you can restart your system    ┃" + clearStyle);
    console.info(yellowColor + "┃   immediately by typing " + underlineStyle + "rs" + clearStyle + yellowColor + " on the terminal.  ┃" + clearStyle);
    console.info(yellowColor + "┃                                              ┃" + clearStyle);
    console.info(yellowColor + "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n" + clearStyle);
}

// Client setup
const client = new Client({
    // ? This is necessary to get the most out of the cluster.
    // Fetch the recommended amount of shards from Server and spawn that amount
    "shards": "auto",
    // Status when starting
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
    // ? The enumeration for partials.
    // https://discord.js.org/#/docs/discord.js/14.0.3/typedef/Partials
    "partials": [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember
    ],
    // ! Required in Discord.js v14
    // https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits
    "intents": [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
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
client.mode = process.env.npm_lifecycle_event || "start";
client.config = config;
client.startup = {
    "start": startTime,
    "end": 0
};
client.console = new Spinnies({
    "spinnerColor": "blueBright",
    "succeedPrefix": "✅",
    "failColor": "yellowBright",
    "failPrefix": "⚠️"
});
client.translate = language;
client.music = new DisTube(client, {
    "plugins": [
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

// Start connecting to the server.
initializeApp(client.config.server);

// Read the code in the handlers.
readdirSync("./source/handlers/").forEach(dirs => require("./handlers/" + dirs)(client));

// Start logging in and working
client.login(client.config.token);