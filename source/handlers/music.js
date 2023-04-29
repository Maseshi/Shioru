const { EmbedBuilder } = require("discord.js");
const { catchError } = require("../utils/consoleUtils");

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
        const meChannel = channel.guild.members.me.voice.channel;
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

    client.music.on("searchCancel", (message) => {
        message.reply(client.translate.handlers.music.searchCancel.search_cancelled);
    });

    client.music.on("searchDone", (message) => {
        message.reply(client.translate.handlers.music.searchDone.get_list_of_songs);
    });

    client.music.on("searchInvalidAnswer", (_message, answer) => {
        answer.reply(client.translate.handlers.music.searchInvalidAnswer.search_cancelled);
    });

    client.music.on("searchNoResult", (message) => {
        message.reply(client.translate.handlers.music.searchNoResult.no_results);
    });

    client.music.on("searchResult", (message, result) => {
        let index = 0;
        const data = result.map(song => "**" + (++index) + "**. " + song.name + " `" + song.formattedDuration + "` : **" + song.uploader.name + "**").join("\n");

        const authorAvatar = message.author.displayAvatarURL();
        const authorUsername = message.author.username;
        const searchResultEmbed = new EmbedBuilder()
            .setTitle(client.translate.handlers.music.searchResult.searching)
            .setDescription(client.translate.handlers.music.addList.timer_choose)
            .setColor("Blue")
            .setTimestamp()
            .setAuthor({ "name": client.translate.handlers.music.tool_name, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/magnifying-glass-tilted-left_1f50d.png" })
            .setFooter({ "iconURL": authorAvatar, "text": authorUsername })
            .setFields(
                [
                    {
                        "name": client.translate.handlers.music.searchResult.title_results,
                        "value": data
                    }
                ]
            );

        message.channel.send({ "embeds": [searchResultEmbed] });
    });
};