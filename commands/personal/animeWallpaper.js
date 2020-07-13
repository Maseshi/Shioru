const discord = require("discord.js");
const superagent = require('superagent');

module.exports.run = async function (client, message, args) {
    let wallpaper = await superagent.get("https://nekos.life/api/v2/img/wallpaper");
    message.channel.send(wallpaper.body.url);
};

module.exports.help = {
    "name": "animeWallpaper",
    "description": "Anime wallpapers",
    "usage": "YanimeWallpaper",
    "category": "personal",
    "aliases": ["animeWall", "animewallpaper", "awallpaper", "awall", "ภาพพื้นหลังอนิแมะ"]
};