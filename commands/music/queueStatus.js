module.exports.run = function (client, message, args) {
    if (client.music.isPaused(message) || client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);
        let musicPaused = client.music.isPaused(message) ? "กำลังเล่น" : "หยุดชั่วคราว";
        let queueVolume = queue.volume;
        let queueFilter = queue.filter;
        let queueRepeat = queue.repeatMode ? queue.repeatMode === 2 ? "คิวนี้" : "เพลงนี้" : "ไม่ได้เปิด";
        let queueAutoplay = queue.autoplay ? "เปิด" : "ปิด";
        let queueCreatedTimestamp = queue.initMessage.createdTimestamp;
        let queueAuthorUid = queue.initMessage.author.id;
        let queueAuthorUsername = queue.initMessage.author.username;
        let queueAuthorAvatar = queue.initMessage.author.avatar;
        let avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";
    
        message.channel.send({
            "embed": {
                "title": "📑 สถานะของคิวเพลงปัจจุบัน",
                "color": 4886754,
                "timestamp": queueCreatedTimestamp,
                "footer": {
                    "icon_url": avatarURL,
                    "text": queueAuthorUsername + " คือเจ้าของคิวนี้"
                },
                "fields": [
                    {
                        "name": "⌚ ตอนนี้",
                        "value": "```" + musicPaused + "```"
                    },
                    {
                        "name": "🔉 ระดับเสียง",
                        "value": "```" + queueVolume + "```"
                    },
                    {
                        "name": "🎼 รูปแบบการกรองเสียง",
                        "value": "```" + queueFilter + "```"
                    },
                    {
                        "name": "🔁 ทำซ้ำ",
                        "value": "```" + queueRepeat + "```"
                    },
                    {
                        "name": "📻 เล่นอัตโนมัติ",
                        "value": "```" + queueAutoplay + "```"
                    }
                ]
            }
        });
    } else {
        message.reply("❎ ตอนนี้ยังไม่ได้เล่นเพลงอะไรเลยนะ");
    }
};

module.exports.help = {
    "name": "queueStatus",
    "description": "Check the status of the current song queue.",
    "usage": "queueStatus",
    "category": "music",
	"aliases": ["qstatus", "qs", "สถานะคิว"],
	"permissions": ["SEND_MESSAGES", "CONNECT"]
};