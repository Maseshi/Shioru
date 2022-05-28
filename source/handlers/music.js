const catchError = require("../extras/catchError");

module.exports = (client) => {
    client.music.on("addList", (queue, playlist) => {
        queue.textChannel.send(client.translate.handlers.music.addList.added_list.replace("%s1", playlist.name).replace("%s2", playlist.songs.length));
    });

    client.music.on("addSong", (queue, song) => {
        queue.textChannel.send(client.translate.handlers.music.addSong.added_song.replace("%s1", song.name).replace("%s2", song.formattedDuration));
    });

    client.music.on("disconnect", (queue) => {
        queue.textChannel.send(client.translate.handlers.music.disconnect.disconnected);
    });
    
    client.music.on("empty", (queue) => {
        queue.textChannel.send(client.translate.handlers.music.empty.no_user_in_channel);
    });

    client.music.on("error", (channel, error) => {
        const meChannel = channel.guild.me.voice.channel;
        const connection = client.music.voices.get(meChannel.guild);

        if ((error.toString()).includes("Unknown Playlist")) return channel.send(client.translate.handlers.music.error.playlist_not_found);
		
        connection.leave(meChannel.guild);
        catchError(client, channel, "music", error);
    });

    client.music.on("finish", (queue) => {
        queue.textChannel.send(client.translate.handlers.music.finish.queue_is_empty);
    });

    client.music.on("initQueue", (queue) => {
        queue.autoplay = false;
        queue.volume = 100;
        queue.filter = "clear";
        queue.createdTimestamp = new Date();
    });

    client.music.on("playSong", (queue, song) => {
        queue.textChannel.send(client.translate.handlers.music.playSong.playing_song.replace("%s1", song.name).replace("%s2", song.formattedDuration));
    });

    client.music.on("searchCancel", (message, query) => {
        message.reply(client.translate.handlers.music.searchCancel.search_cancelled);
    });

    client.music.on("searchDone", (message, answer, query) => {
        message.reply(client.translate.handlers.music.searchDone.get_list_of_songs);
    });

    client.music.on("searchInvalidAnswer", (message, answer, query) => {
        answer.reply(client.translate.handlers.music.searchInvalidAnswer.search_cancelled);
    });

    client.music.on("searchNoResult", (message, query) => {
        message.reply(client.translate.handlers.music.searchNoResult.no_results);
    });

    client.music.on("searchResult", (message, result) => {
        let index = 0;
        const data = result.map(song => "**" + (++index) + "**. " + song.name + " `" + song.formattedDuration + "` : **" + song.uploader.name + "**").join("\n");
    
        message.channel.send({
            "embeds": [
                {
                    "title": client.translate.handlers.music.searchResult.searching,
                    "description": client.translate.handlers.music.addList.timer_choose,
                    "color": 13632027,
                    "timestamp": new Date(),
                    "author": {
                        "name": "YouTube",
                        "url": "https://www.youtube.com/",
                        "iconURL": "https://www.youtube.com/s/desktop/6007d895/img/favicon_144x144.png"
                    },
                    "footer": {
                        "icon_url": message.author.displayAvatarURL(),
                        "text": message.author.username
                    },
                    "fields": [
                        {
                            "name": client.translate.handlers.music.searchResult.title_results,
                            "value": data
                        }
                    ]
                }
            ]
        });
    });
};