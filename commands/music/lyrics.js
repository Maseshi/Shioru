const discord = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports.run = async function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_lyrics_no_queue);
    } else {
        let lyrics;

        try {
            lyrics = await lyricsFinder(serverQueue.songs[0].title, "");
            if (!lyrics) {
                lyrics = client.lang.command_music_lyrics_not_found.replace("%title", (serverQueue.songs[0].title));
            }
        } catch (error) {
            lyrics = client.lang.command_music_lyrics_try_catch_error.replace("%title", (serverQueue.songs[0].title));
        }

        let lyricsEmbed = new discord.MessageEmbed()
            .setTitle(client.lang.command_music_lyrics_found)
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
    "usage": "lyrics",
    "category": "music",
    "aliases": ["ly", "เนื้อร้อง"]
};