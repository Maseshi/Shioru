const lyricsFinder = require("lyrics-finder");

module.exports.run = async function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let lyrics;
        let queue = client.music.getQueue(message);
        let queueName = queue.songs.map((song, id) => song.name);
    
        try {
            lyrics = await lyricsFinder(queueName, "");
            if (!lyrics) lyrics = client.data.language.command_music_lyrics_not_found.replace("%title", queueName);
        } catch (error) {
            lyrics = client.data.language.command_music_lyrics_try_catch_error.replace("%title", queueName);
        }
    
        message.channel.send({
            "embed": {
                "title": client.data.language.command_music_lyrics_found,
                "description": "```" + lyrics + "```",
                "color": 14684245,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": message.author.displayAvatarURL(),
                    "text": message.author.username
                }
            }
        });
    } else {
        message.reply(client.data.language.command_music_lyrics_no_queue);
    }
};

module.exports.help = {
    "name": "lyrics",
    "description": "Get lyrics for the currently playing song",
    "usage": "lyrics",
    "category": "music",
    "aliases": ["ly", "เนื้อร้อง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};