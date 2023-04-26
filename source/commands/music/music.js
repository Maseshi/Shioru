const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "music",
    "description": "Details of the current song and queue.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "music",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เพลง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "รายละเอียดของเพลงและคิวในปัจจุบัน"
        },
        "options": [
            {
                "type": 1,
                "name": "detail",
                "name_localizations": {
                    "th": "รายละเอียด"
                },
                "description": "See information for the currently playing song",
                "description_localizations": {
                    "th": "ดูข้อมูลสำหรับเพลงที่กำลังเล่นอยู่"
                }
            },
            {
                "type": 1,
                "name": "playing",
                "name_localizations": {
                    "th": "กำลังเล่น"
                },
                "description": "Check the music that is currently playing.",
                "description_localizations": {
                    "th": "ตรวจสอบเพลงที่กำลังเล่นอยู่"
                }
            },
            {
                "type": 1,
                "name": "status",
                "name_localizations": {
                    "th": "สถานะ"
                },
                "description": "Check the status of the current song queue.",
                "description_localizations": {
                    "th": "ตรวจสอบสถานะคิวเพลงปัจจุบัน"
                }
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.reply(interaction.client.translate.commands.musicInfo.no_queue);

        const queueName = queue.songs[0].name;
        const queueTimestamp = queue.songs[0].formattedDuration;
        const queueId = queue.songs[0].id;
        const queueURL = queue.songs[0].url;
        const queueStreamURL = queue.songs[0].streamURL;
        const queueUploaderName = queue.songs[0].uploader.name;
        const queueUploaderURL = queue.songs[0].uploader.url;
        const queueThumbnail = queue.songs[0].thumbnail;
        const queuePaused = queue.paused;
        const queueVolume = queue.volume;
        const queueFilter = queue.filters;
        const queueDuration = queue.songs[0].duration;
        const queueDurationCurrent = queue.currentTime;
        const queueRepeat = queue.repeatMode;
        const queueAutoplay = queue.autoplay;
        const queueCreatedTimestamp = queue.createdTimestamp;
        const queueAuthorUid = queue.songs[0].user.id;
        const queueAuthorUsername = queue.songs[0].user.username;
        const queueAuthorAvatar = queue.songs[0].user.avatar;
        const queueAvatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

        switch (subCommand) {
            case "detail":
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

                await interaction.reply({ "embeds": [musicInfoEmbed] });
                break;
            case "playing":
                const nowPlayingEmbed = new EmbedBuilder()
                    .setTitle(queueName)
                    .setURL(queueURL)
                    .setThumbnail(queueThumbnail)
                    .setColor("Blue")
                    .setTimestamp(queueCreatedTimestamp)
                    .setFooter({ "text": interaction.client.translate.commands.nowPlaying.owner_this_queue.replace("%s", queueAuthorUsername), "iconURL": queueAvatarURL });

                await interaction.reply({ "embeds": [nowPlayingEmbed] });
                break;
            case "status":
                const queueStatusEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.queueStatus.queue_status)
                    .setColor("Blue")
                    .setTimestamp(queueCreatedTimestamp)
                    .setFooter({ "text": interaction.client.translate.commands.queueStatus.owner_this_queue.replace("%s", queueAuthorUsername), "iconURL": queueAvatarURL })
                    .addFields(
                        [
                            {
                                "name": interaction.client.translate.commands.queueStatus.now,
                                "value": "```" + queuePaused ? interaction.client.translate.commands.queueStatus.paused : interaction.client.translate.commands.queueStatus.playing + "```",
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.queueStatus.volume,
                                "value": "```" + queueVolume + "```",
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.queueStatus.filter,
                                "value": "```" + queueFilter.names.length > 0 ? queue.filters.names.join(", ") : "-:-" + "```",
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.queueStatus.repeat,
                                "value": "```" + queueRepeat? queue.repeatMode === 2 ? interaction.client.translate.commands.queueStatus.repeat_this_queue : interaction.client.translate.commands.queueStatus.repeat_this_song : interaction.client.translate.commands.queueStatus.repeat_off + "```",
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.queueStatus.autoplay,
                                "value": "```" + queueAutoplay ? interaction.client.translate.commands.queueStatus.on : interaction.client.translate.commands.queueStatus.off + "```",
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.queueStatus.duration,
                                "value": "```" + queueDurationCurrent + " / " + queueDuration + "```",
                                "inline": true
                            }
                        ]
                    );

                await interaction.reply({ "embeds": [queueStatusEmbed] });
                break;
        }
    }
}