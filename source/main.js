const { Client } = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp")
const { initializeApp } = require("firebase/app");
const { readdirSync, readFileSync } = require("node:fs");
const { version } = require("../package.json")
const ansiColor = require("./extras/ansiColor");
const config = require("./config/data");
const language = require("./languages/en.json");

// Start detecting working time
console.time("\u001b[34m\u001b[7m Bot is ready to work on the servers! \u001b[0m");

// Show when bots start working To check that bots do not have a problem
const clearStyle = ansiColor(0, "sgr");
const underlineStyle = ansiColor(4, "sgr");
const whiteColor = ansiColor(15, "foreground");
const yellowColor = ansiColor(11, "foreground");
const blueBrightColor = ansiColor(33, "foreground");

const file = readFileSync("./source/assets/ascii-art.txt", "utf-8");
const text = file.split('\n').join("\n");
const textFormat =  text.replace("%s1", "v")
                        .replace("%s2", version.charAt(0))
                        .replace("%s3", version.charAt(1))
                        .replace("%s4", version.charAt(2))
                        .replace("%s5", version.charAt(3))
                        .replace("%s6", version.charAt(4));

console.clear();
console.info(blueBrightColor + textFormat + clearStyle);
console.info(whiteColor + "Copyright (C) 2020-2022 Chaiwat Suwannarat. All rights reserved." + clearStyle);
console.info(whiteColor + "Website: https://shiorus.web.app/\n" + clearStyle);

// Check the work system from the script in packages.json.
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
    // Fetch the recommended amount of shards from Discord and spawn that amount
    "shards": "auto",
    // Preset status
    "presence": {
        "status": "dnd",
        "afk": true,
        "activities": [
            {
                "name": "information of each server",
                "type": "WATCHING"
            }
        ]
    },
    // Required in Discord.js v13
    "intents": [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILD_SCHEDULED_EVENTS"
    ]
});

// Configure in client
client.temp = {};
client.mode = process.env.npm_lifecycle_event || "start";
client.config = config;
client.translate = language;
client.music = new DisTube(client, {
    "plugins": [
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ],
    "leaveOnStop": false,
    "youtubeIdentityToken": client.config.server.apiKey,
    "youtubeDL": false,
    "updateYouTubeDL": false,
    "customFilters": {
        "3d": "apulsator=hz=0.125",
        "8d": "apulsator=hz=0.08",
        "bassboost": "bass=g=20,dynaudnorm=f=200",
        "clear": "dynaudnorm=f=200",
        "earwax": "earwax",
        "echo": "aecho=0.8:0.9:1000:0.3",
        "flanger": "flanger",
        "gate": "agate",
        "haas": "haas",
        "karaoke": "stereotools=mlev=0.03",
        "lowbass": "bass=g=6,dynaudnorm=f=200",
        "mcompand": "mcompand",
        "nightcore": "aresample=48000,asetrate=48000*1.25",
        "normalizer": "dynaudnorm=f=200",
        "phaser": "aphaser=in_gain=0.4",
        "pulsator": "apulsator=hz=1",
        "purebass": "bass=g=20,dynaudnorm=f=200,asubboost,apulsator=hz=0.08",
        "reverse": "areverse",
        "subboost": "asubboost",
        "surround": "surround",
        "surrounding": "surround",
        "treble": "treble=g=5",
        "tremolo": "tremolo",
        "vaporwave": "aresample=48000,asetrate=48000*0.8",
        "vibrato": "vibrato=f=6.5"
    },
    "ytdlOptions": {
        "highWaterMark": 1 << 24
    }
});

// Read the code in the handlers.
readdirSync("./source/handlers/").forEach(dirs => require("./handlers/" + dirs)(client));

// Start connecting to the server.
initializeApp(client.config.server);

// Start logging in and working
client.login(client.config.token);