module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.queueStatus.no_queue);

    const musicPaused = client.music.paused ? client.translate.commands.queueStatus.paused : client.translate.commands.queueStatus.playing;
    const queueVolume = queue.volume;
    const queueFilter = queue.filter;
    const queueRepeat = queue.repeatMode ? queue.repeatMode === 2 ? client.translate.commands.queueStatus.repeat_this_queue : client.translate.commands.queueStatus.repeat_this_song : client.translate.commands.queueStatus.repeat_off;
    const queueAutoplay = queue.autoplay ? client.translate.commands.queueStatus.on : client.translate.commands.queueStatus.off;
    const queueCreatedTimestamp = queue.createdTimestamp;
    const queueAuthorUid = queue.songs[0].user.id;
    const queueAuthorUsername = queue.songs[0].user.username;
    const queueAuthorAvatar = queue.songs[0].user.avatar;
    const avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.queueStatus.queue_status,
                "color": 4886754,
                "timestamp": queueCreatedTimestamp,
                "footer": {
                    "iconURL": avatarURL,
                    "text": client.translate.commands.queueStatus.owner_this_queue.replace("%s", queueAuthorUsername)
                },
                "fields": [
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
                    }
                ]
            }
        ]
    });
};

module.exports.help = {
    "name": "queueStatus",
    "description": "Check the status of the current song queue.",
    "usage": "queueStatus",
    "category": "music",
	"aliases": ["qstatus", "qs", "สถานะคิว"],
	"clientPermissions": ["SEND_MESSAGES"]
};