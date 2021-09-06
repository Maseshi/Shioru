module.exports.run = function (client, message, args) {
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.queueStatus.no_queue);

    let musicPaused = client.music.paused ? client.translate.commands.queueStatus.paused : client.translate.commands.queueStatus.playing;
    let queueVolume = queue.volume;
    let queueFilter = queue.filter;
    let queueRepeat = queue.repeatMode ? queue.repeatMode === 2 ? client.translate.commands.queueStatus.repeat_this_queue : client.translate.commands.queueStatus.repeat_this_song : client.translate.commands.queueStatus.repeat_off;
    let queueAutoplay = queue.autoplay ? client.translate.commands.queueStatus.on : client.translate.commands.queueStatus.off;
    let queueCreatedTimestamp = queue.createdTimestamp;
    let queueAuthorUid = queue.songs[0].user.id;
    let queueAuthorUsername = queue.songs[0].user.username;
    let queueAuthorAvatar = queue.songs[0].user.avatar;
    let avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.queueStatus.queue_status,
                "color": 4886754,
                "timestamp": queueCreatedTimestamp,
                "footer": {
                    "icon_url": avatarURL,
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
	"permissions": ["SEND_MESSAGES", "CONNECT"]
};