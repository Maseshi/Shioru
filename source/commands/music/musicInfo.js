const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "musicInfo",
    "description": "See information for the currently playing song",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "musicInfo",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "musicinfo",
            "th": "ข้อมูลเพลง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "See information for the currently playing song",
            "th": "ดูข้อมูลสำหรับเพลงที่กำลังเล่นอยู่"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.musicInfo.no_queue);

        const queueName = queue.songs[0].name;
        const queueTimestamp = queue.songs[0].formattedDuration;
        const queueId = queue.songs[0].id;
        const queueURL = queue.songs[0].url;
        const queueStreamURL = queue.songs[0].streamURL;
        const queueUploaderName = queue.songs[0].uploader.name;
        const queueUploaderURL = queue.songs[0].uploader.url;
        const queueThumbnail = queue.songs[0].thumbnail;

        const musicInfoEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.musicInfo.detail)
            .setImage(queueThumbnail)
            .setColor("Blue")
            .setTimestamp()
            .addFields(
                [
                    {
                        "name": interaction.client.translate.commands.musicInfo.music_name,
                        "value": queueName,
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.musicInfo.uploader,
                        "value": "[" + queueUploaderName + "](" + queueUploaderURL + ")",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.musicInfo.duration,
                        "value": queueTimestamp,
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.musicInfo.id,
                        "value": queueId,
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.musicInfo.link,
                        "value": queueURL,
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.musicInfo.download_link,
                        "value": "[Google Video](" + queueStreamURL + ")",
                        "inline": true
                    }
                ]
            );

        await interaction.editReply({
            "embeds": [musicInfoEmbed]
        });
    }
}