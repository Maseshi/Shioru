const superagent = require("superagent");

module.exports.run = async function (client, message, args) {
    superagent.get("https://nekos.life/api/v2/img/wallpaper")
    .then(function (wallpaper) {
        message.channel.send(wallpaper.body.url);
    }).catch(function (error) {
        console.log(error);
        message.channel.send(client.lang.command_fun_anime-wallpaper_function_error + error);
    });
};

module.exports.help = {
    "name": "animeWallpaper",
    "description": "Anime wallpapers",
    "usage": "animeWallpaper",
    "category": "personal",
    "aliases": ["animeWall", "animewallpaper", "awallpaper", "awall", "ภาพพื้นหลังอนิแมะ"]
};