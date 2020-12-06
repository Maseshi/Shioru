const ytdl = require("erit-ytdl");

module.exports = async function (client, channel, message, song) {
    let queue = message.client.queue.get(message.guild.id);

    if (!song) {
        setTimeout(function () {
            if (!queue.connection.dispatcher && !message.guild.me.voice.channel) {
                channel.leave();
            }
        }, 500000);
        queue.textChannel.send("🎐 ตอนนี้คิวเพลงว่างแล้วค้าา...");
        return message.client.queue.delete(message.guild.id);
    } else {
        queue.connection.on("disconnect", function () {
            message.client.queue.delete(message.guild.id);
        });

        let url = song.url;
        let stream = await ytdl(url, {
            "highWaterMark": 1 << 25,
            "opusEncoded": true
        });
        let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

        let dispatcher = queue.connection.play(stream, {
            "type": streamType,
            "filter": "audioonly",
            "quality": "highestaudio"
        });

        dispatcher.on("end", function () {
            if (queue.loop) {
                let lastSong = queue.songs.shift();
                queue.songs.push(lastSong);
                module.exports(client, channel, message, queue.songs[0]);
            } else {
                queue.songs.shift();
                module.exports(client, channel, message, queue.songs[0]);
            }
        });
        dispatcher.on("finish", function () {
            if (queue.loop) {
                let lastSong = queue.songs.shift();
                queue.songs.push(lastSong);
                module.exports(client, channel, message, queue.songs[0]);
            } else {
                queue.songs.shift();
                module.exports(client, channel, message, queue.songs[0]);
            }
        });
        dispatcher.on("error", function (error) {
            console.log(error);
            queue.songs.shift();
            message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังเล่นคะ: " + error);
        });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        queue.textChannel.send("🎶 กำลังเล่นเพลง: `" + song.title + "`");
    }
};