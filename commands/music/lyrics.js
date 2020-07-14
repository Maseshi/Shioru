const discord = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports.run = async function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ");
    } else {
        let lyrics;

        try {
            lyrics = await lyricsFinder(serverQueue.songs[0].title, "");
            if (!lyrics) {
                lyrics = "ไม่พบเนื้อเพลงของ " + serverQueue.songs[0].title + ".";
            }
        } catch (error) {
            lyrics = "ไม่พบเนื้อเพลงของ " + serverQueue.songs[0].title + ".";
        }

        let lyricsEmbed = new discord.MessageEmbed()
            .setTitle("📋 เนื้อเพลงของเพลงที่กำลังเล่น")
            .setDescription("```" + lyrics + "```")
            .setColor("#F8AA2A")
            .setFooter(message.author.username, message.author.displayAvatarURL())
            .setTimestamp();

        if (lyricsEmbed.description.length >= 2048) 
            lyricsEmbed.description = lyricsEmbed.description.substr(0, 2045) + "...";
        return message.channel.send(lyricsEmbed);
    }
};

module.exports.help = {
    "name": "lyrics",
    "description": "Get lyrics for the currently playing song",
    "usage": "Ylyrics",
    "category": "music",
    "aliases": ["ly", "เนื้อร้อง"]
};