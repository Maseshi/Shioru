const { version, Client, Intents } = require("discord.js");
const { DisTube } = require("distube");
const firebase = require("firebase");
const packages = require("../package.json");
const config = require("./config/data");
const lang = require("./languages/en.json");

// Show when bots start working To check that bots do not have a problem
console.log("\x1b[31m┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
console.log("\x1b[31m┃\x1b[33m Copyright (c) 2020-2021 Chaiwat Suwannarat. All rights reserved. \x1b[31m┃");
console.group("\x1b[31m┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\x1b[0m");

// Check package version
console.log("\u001b[1mPackage\u001b[0m version: " + packages.version);
console.log("\u001b[1mDiscord.js\u001b[0m version: " + version);
console.log("\u001b[1mNode.js\u001b[0m version: " + process.version);

// Client setup
const client = new Client({
    "shards": "auto",
    "allowedMentions": {
        "repliedUser": true
    },
    "partials": [
        "USER",
        "GUILD_MEMBER",
        "MESSAGE",
        "REACTION"
    ],
    "presence": {
        "status": "dnd",
        "afk": true,
        "activities": [
            {
                "name": "information of each server",
                "type": "WATCHING",
                "url": null
            }
        ]
    },
    "intents": [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.config = config;
client.translate = lang;
client.music = new DisTube(client, {
    "leaveOnStop": false,
    "youtubeDL": true,
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
}).on("playSong", function (queue, song) {
    queue.textChannel.send(client.translate.main.distube.playSong.playing_song.replace("%s1", song.name).replace("%s2", song.formattedDuration));
}).on("addSong", function (queue, song) {
    queue.textChannel.send(client.translate.main.distube.addSong.added_song.replace("%s1", song.name).replace("%s2", song.formattedDuration));
}).on("addList", function (queue, playlist) {
    let list = playlist.map((songs, index) => "**" + index + "**. " + songs.name);

    queue.textChannel.send({
        "embeds": [
            {
                "title": playlist.name,
                "description": client.translate.main.distube.addList.timer_choose.replace("%s", list),
                "color": 16296490,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": queue.member.user.displayAvatarURL(),
                    "text": queue.member.user.username
                }
            }
        ]
    });
}).on("searchResult", function (message, result) {
    let index = 0;
    let search = result.map(song => "**" + (++index) + "**. " + song.name + " - `" + song.formattedDuration + "`").join("\n");

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.main.distube.searchResult.searching.replace("%s", search),
                "description": client.translate.main.distube.addList.timer_choose.replace("%s", search),
                "color": 16296490,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": message.author.displayAvatarURL(),
                    "text": message.author.username
                }
            }
        ]
    });
    client.music.options.searchSongs = false;
}).on("searchCancel", function (message, query) {
    message.reply(client.translate.main.distube.searchCancel.search_cancelled);
    client.music.options.searchSongs = false;
}).on("initQueue", function (queue) {
    queue.autoplay = false;
    queue.volume = 100;
    queue.filter = "clear";
    queue.createdTimestamp = new Date();
}).on("empty", function (queue) {
    queue.textChannel.send(client.translate.main.distube.empty.no_user_in_channel);
}).on("finish", function (queue) {
    queue.textChannel.send(client.translate.main.distube.finish.queue_is_empty);
}).on("error", function (channel, err) {
    catchError(client, channel, "player", err);
});

["command", "event"].forEach(dirs => require("./handlers/" + dirs)(client));

process.on("rejectionHandled", function (error) {
    console.error("Rejection promise rejection:", error);
}).on("uncaughtException", function (error) {
    console.error("Uncaught promise rejection:", error);
}).on("unhandledRejection", function (error) {
    console.error("Unhandled promise rejection:", error);
});

firebase.initializeApp(client.config.server);
client.login(client.config.token);