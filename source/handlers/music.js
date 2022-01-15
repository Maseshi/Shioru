module.exports = (client) => {
    client.music.on("playSong", (queue, song) => {
        queue.textChannel.send(client.translate.main.distube.playSong.playing_song.replace("%s1", song.name).replace("%s2", song.formattedDuration));
    });
    
    client.music.on("addSong", (queue, song) => {
        queue.textChannel.send(client.translate.main.distube.addSong.added_song.replace("%s1", song.name).replace("%s2", song.formattedDuration));
    });
    
    client.music.on("addList", (queue, playlist) => {
        const list = playlist.map((songs, index) => "**" + index + "**. " + songs.name);
    
        queue.textChannel.send({
            "embeds": [
                {
                    "title": playlist.name,
                    "description": client.translate.main.distube.addList.timer_choose.replace("%s", list),
                    "color": 16296490,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": queue.member.user.displayAvatarURL(),
                        "text": queue.member.user.username
                    }
                }
            ]
        });
    });
    
    client.music.on("searchResult", (message, result) => {
        let index = 0;
        const search = result.map(song => "**" + (++index) + "**. " + song.name + " - `" + song.formattedDuration + "`").join("\n");
    
        message.channel.send({
            "embeds": [
                {
                    "title": client.translate.main.distube.searchResult.searching.replace("%s", search),
                    "description": client.translate.main.distube.addList.timer_choose.replace("%s", search),
                    "color": 16296490,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": message.author.displayAvatarURL(),
                        "text": message.author.username
                    }
                }
            ]
        });
        client.music.options.searchSongs = false;
    });
    
    client.music.on("searchCancel", (message, query) => {
        message.reply(client.translate.main.distube.searchCancel.search_cancelled);
        client.music.options.searchSongs = false;
    });
    
    client.music.on("initQueue", (queue) => {
        queue.autoplay = false;
        queue.volume = 100;
        queue.filter = "clear";
        queue.createdTimestamp = new Date();
    });
    
    client.music.on("empty", (queue) => {
        queue.textChannel.send(client.translate.main.distube.empty.no_user_in_channel);
    });
    
    client.music.on("finish", (queue) => {
        queue.textChannel.send(client.translate.main.distube.finish.queue_is_empty);
    });
    
    client.music.on("error", (channel, error) => {
        console.error(error);
    });
};