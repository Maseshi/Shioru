const { EmbedBuilder } = require("discord.js");

module.exports = {
    "name": "queueStatus",
    "description": "Check the status of the current song queue.",
    "category": "music",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "queueStatus",
    "aliases": ["qstatus", "qs", "สถานะคิว"],
    async execute(client, message, args) {
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.queueStatus.no_queue);

        const musicPaused = client.music.paused ? client.translate.commands.queueStatus.paused : client.translate.commands.queueStatus.playing;
        const queueVolume = queue.volume;
        const queueFilter = queue.filters.names.length > 0 ? queue.filters.names.join(", ") : "";
        const queueDuration = queue.songs[0].duration;
        const queueDurationCurrent = queue.currentTime;
        const queueRepeat = queue.repeatMode ? queue.repeatMode === 2 ? client.translate.commands.queueStatus.repeat_this_queue : client.translate.commands.queueStatus.repeat_this_song : client.translate.commands.queueStatus.repeat_off;
        const queueAutoplay = queue.autoplay ? client.translate.commands.queueStatus.on : client.translate.commands.queueStatus.off;
        const queueCreatedTimestamp = queue.createdTimestamp;
        const queueAuthorUid = queue.songs[0].user.id;
        const queueAuthorUsername = queue.songs[0].user.username;
        const queueAuthorAvatar = queue.songs[0].user.avatar;
        const avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

        const queueStatusEmbed = new EmbedBuilder()
            .setTitle(client.translate.commands.queueStatus.queue_status)
            .setColor("Blue")
            .setTimestamp(queueCreatedTimestamp)
            .setFooter({ "text": client.translate.commands.queueStatus.owner_this_queue.replace("%s", queueAuthorUsername), "iconURL": avatarURL })
            .addFields(
                [
                    {
                        "name": client.translate.commands.queueStatus.now,
                        "value": "```" + musicPaused + "```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.queueStatus.volume,
                        "value": "```" + queueVolume + "```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.queueStatus.filter,
                        "value": "```" + queueFilter + "```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.queueStatus.repeat,
                        "value": "```" + queueRepeat + "```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.queueStatus.autoplay,
                        "value": "```" + queueAutoplay + "```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.queueStatus.duration,
                        "value": "```" + queueDurationCurrent + " / " + queueDuration + "```",
                        "inline": true
                    }
                ]
            );

        message.channel.send({
            "embeds": [queueStatusEmbed]
        });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "queuestatus",
            "th": "สถานะคิว"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Check the status of the current song queue.",
            "th": "ตรวจสอบสถานะคิวเพลงปัจจุบัน"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.queueStatus.no_queue);

        const musicPaused = interaction.client.music.paused ? interaction.client.translate.commands.queueStatus.paused : interaction.client.translate.commands.queueStatus.playing;
        const queueVolume = queue.volume;
        const queueFilter = queue.filters.names.length > 0 ? queue.filters.names.join(", ") : "";
        const queueDuration = queue.songs[0].duration;
        const queueDurationCurrent = queue.currentTime;
        const queueRepeat = queue.repeatMode ? queue.repeatMode === 2 ? interaction.client.translate.commands.queueStatus.repeat_this_queue : interaction.client.translate.commands.queueStatus.repeat_this_song : interaction.client.translate.commands.queueStatus.repeat_off;
        const queueAutoplay = queue.autoplay ? interaction.client.translate.commands.queueStatus.on : interaction.client.translate.commands.queueStatus.off;
        const queueCreatedTimestamp = queue.createdTimestamp;
        const queueAuthorUid = queue.songs[0].user.id;
        const queueAuthorUsername = queue.songs[0].user.username;
        const queueAuthorAvatar = queue.songs[0].user.avatar;
        const avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

        const queueStatusEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.queueStatus.queue_status)
            .setColor("Blue")
            .setTimestamp(queueCreatedTimestamp)
            .setFooter({ "text": interaction.client.translate.commands.queueStatus.owner_this_queue.replace("%s", queueAuthorUsername), "iconURL": avatarURL })
            .addFields(
                [
                    {
                        "name": interaction.client.translate.commands.queueStatus.now,
                        "value": "```" + musicPaused + "```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.queueStatus.volume,
                        "value": "```" + queueVolume + "```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.queueStatus.filter,
                        "value": "```" + queueFilter + "```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.queueStatus.repeat,
                        "value": "```" + queueRepeat + "```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.queueStatus.autoplay,
                        "value": "```" + queueAutoplay + "```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.queueStatus.duration,
                        "value": "```" + queueDurationCurrent + " / " + queueDuration + "```",
                        "inline": true
                    }
                ]
            );

        await interaction.editReply({
            "embeds": [queueStatusEmbed]
        });
    }
};