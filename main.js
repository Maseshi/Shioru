const discord = require("discord.js");
const firebase = require("firebase");
const packageInfo = require("./package.json");
const clientConfig = require("./config/client");
const dataConfig = require("./config/data");
const lang = require("./languages/th_TH.json");

// Show when bots start working To check that bots do not have a problem
console.log("\x1b[31m┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
console.log("\x1b[31m┃\x1b[33m Copyright (c) 2020-2021 Chaiwat Suwannarat. All rights reserved. \x1b[31m┃");
console.group("\x1b[31m┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\x1b[0m");

// Check package version
console.log("\u001b[1mPackage\u001b[0m version: " + packageInfo.version);
console.log("\u001b[1mDiscord.js\u001b[0m version: " + discord.version);
console.log("\u001b[1mNode.js\u001b[0m version: " + process.version);

const client = new discord.Client({
    "messageCacheLifetime": 60,
    "fetchAllMembers": false,
    "messageCacheMaxSize": 10,
    "restTimeOffset": 0,
    "restWsBridgetimeout": 100,
    "autoReconnect": true,
    "disableEveryone": false,
    "partials": ["MESSAGE", "CHANNEL", "REACTION"]
});

client.data = {
    "config": {
        "client": clientConfig,
        "data": dataConfig
    },
    "language": lang
};

["command", "event", "music"].forEach(dirs => require("./handlers/" + dirs)(client));

process.on("rejectionHandled", function (error) {
    console.error("Rejection promise rejection:", error);
});

process.on("uncaughtException", function (error) {
    console.error("Uncaught promise rejection:", error);
});

process.on("unhandledRejection", function (error) {
    console.error("Unhandled promise rejection:", error);
});

firebase.initializeApp(client.data.config.data.server);
client.login(client.data.config.client.token);