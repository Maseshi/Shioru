const ytdl = require("ytdl-core-discord");

module.exports = async function (client, message, metadata, status) {
    let queue = message.client.data.get(message.guild.id);

    if (!metadata) {
        setTimeout(function () {
            if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
            queue.voiceChannel.leave();
        }, 300000);
        message.client.data.delete(message.guild.id);
    } else {
        queue.connection.on("disconnect", function () {
            message.client.data.delete(message.guild.id);
        });

        let stream = await ytdl(metadata.url, {
            "filter": "audioonly",
            "highWaterMark": 1 << 25,
            "opusEncoded": true,
            "quality": "highestaudio"
        }).then();
        let streamType = metadata.url.includes("youtube.com") ? "opus" : "ogg/opus";
        let dispatcher = queue.connection.play(stream, {
            "type": streamType
        });

        dispatcher.on("finish", function () {
            if (queue.loop) {
                let lastSong = queue.songs.shift();
                queue.songs.push(lastSong);
                module.exports(client, message, queue.songs[0]);
            } else {
                queue.songs.shift();
                module.exports(client, message, queue.songs[0]);
            }
        });

        dispatcher.on("error", function (error) {
            console.log(error);
            queue.songs.shift();
            if (!status) {
                message.channel.send(client.lang.structures_musicPlayer_dispatcher_error + error);
            } else {
                status.edit(client.lang.structures_musicPlayer_dispatcher_status_error + error);
            }
        });
        
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        if (!status) {
            message.channel.send(client.lang.structures_musicPlayer_playing.replace("%title", metadata.title));
        } else {
            status.edit(client.lang.structures_musicPlayer_status_playing.replace("%title", metadata.title));
        }
    }
};