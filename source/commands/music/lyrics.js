const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
    "enable": true,
    "name": "lyrics",
    "description": "Get lyrics for the currently playing song",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "lyrics",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เนื้อเพลง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "รับเนื้อเพลงสำหรับเพลงที่กำลังเล่นอยู่"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.reply(interaction.client.translate.commands.lyrics.no_queue);

        let lyrics;
        const queueName = queue.songs.map((song) => song.name);

        try {
            lyrics = await lyricsFinder(queueName, "");

            if (!lyrics) lyrics = interaction.client.translate.commands.lyrics.can_not_find_lyrics.replace("%s", queueName);
        } catch (error) {
            lyrics = interaction.client.translate.commands.lyrics.can_not_find_lyrics.replace("%s", queueName);
        }

        const authorUsername = interaction.author.username;
        const authorAvatar = interaction.author.displayAvatarURL();
        const lyricsEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.lyrics.playing_lyrics)
            .setDescription("```" + lyrics + "```")
            .setColor("Blue")
            .setTimestamp()
            .setFooter({ "text": authorUsername, "iconURL": authorAvatar });

        await interaction.reply({ "embeds": [lyricsEmbed] });
    }
};