const lyricsFinder = require("lyrics-finder");

module.exports.run = async (client, message, args) => {
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

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.lyrics.playing_lyrics,
                "description": "```" + lyrics + "```",
                "color": 14684245,
                "timestamp": new Date(),
                "footer": {
                    "iconURL": message.author.displayAvatarURL(),
                    "text": message.author.username
                }
            }
        ]
    });
};

module.exports.help = {
    "name": "lyrics",
    "description": "Get lyrics for the currently playing song",
    "usage": "lyrics",
    "category": "music",
    "aliases": ["ly", "เนื้อร้อง"],
    "clientPermissions": ["SEND_MESSAGES"]
};