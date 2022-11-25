const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
    "name": "lyrics",
    "description": "Get lyrics for the currently playing song",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "lyrics",
    "aliases": ["ly", "เนื้อร้อง"],
    async execute(client, message, args) {
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.lyrics.no_queue);

        let lyrics;
        const queueName = queue.songs.map((song, id) => song.name);

        try {
            lyrics = await lyricsFinder(queueName, "");

            if (!lyrics) lyrics = client.translate.commands.lyrics.can_not_find_lyrics.replace("%s", queueName);
        } catch (error) {
            lyrics = client.translate.commands.lyrics.can_not_find_lyrics.replace("%s", queueName);
        }

        const authorUsername = message.author.username;
        const authorAvatar = message.author.displayAvatarURL();
        const lyricsEmbed = new EmbedBuilder()
            .setTitle(client.translate.commands.lyrics.playing_lyrics)
            .setDescription("```" + lyrics + "```")
            .setColor("Blue")
            .setTimestamp()
            .setFooter({ "text": authorUsername, "iconURL": authorAvatar });

        message.channel.send({
            "embeds": [lyricsEmbed]
        });
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "lyrics",
            "th": "เนื้อเพลง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Get lyrics for the currently playing song",
            "th": "รับเนื้อเพลงสำหรับเพลงที่กำลังเล่นอยู่"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.lyrics.no_queue);

        let lyrics;
        const queueName = queue.songs.map((song, id) => song.name);

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

        await interaction.editReply({
            "embeds": [lyricsEmbed]
        });
    }
};